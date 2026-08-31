import { AuthRepository } from './repositories/auth.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { OtpService } from './services/otp.service';
import { EmailService } from './services/email.service';
import { SessionService } from './services/session.service';
import { hashPassword, comparePassword } from '../../common/utils/password';
import { AppError } from '../../common/errors/app-error';
import { Messages } from '../../common/constants/messages';
import { ErrorCodes } from '../../common/errors/error-codes';
import { logger } from '../../common/utils/logger';
import {
  LoginDto,
  ForgotPasswordDto,
  VerifyOtpDto,
  ResetPasswordDto,
  ChangePasswordDto,
  AuthResponse,
} from './auth.types';

export class AuthService {
  private readonly authRepo: AuthRepository;
  private readonly passwordResetRepo: PasswordResetRepository;
  private readonly otpService: OtpService;
  private readonly emailService: EmailService;
  private readonly sessionService: SessionService;

  constructor() {
    this.authRepo = new AuthRepository();
    this.passwordResetRepo = new PasswordResetRepository();
    this.otpService = new OtpService(this.passwordResetRepo);
    this.emailService = new EmailService();
    this.sessionService = new SessionService();
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.authRepo.findByEmail(dto.email, true);

    if (!user || !(await comparePassword(dto.password, user.password))) {
      throw AppError.unauthorized(
        Messages.auth.INVALID_CREDENTIALS,
        ErrorCodes.INVALID_CREDENTIALS,
      );
    }

    const tokens = this.sessionService.generateTokens(String(user._id), user.email);
    return {
      user: { id: String(user._id), email: user.email },
      tokens,
    };
  }

  /**
   * SECURITY: Always returns the same generic response whether or not the
   * email exists, preventing account enumeration attacks.
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.authRepo.findByEmail(dto.email);
    if (!user) {
      logger.info(`Forgot password: no account for ${dto.email} (silenced)`);
      return;
    }
    const otp = await this.otpService.generateAndStoreOtp(String(user._id), dto.email);
    await this.emailService.sendOtpEmail(dto.email, otp);
  }

  /**
   * Verifies the OTP (comparing against stored bcrypt hash) and returns a
   * short-lived single-use reset token. The OTP is never re-used.
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<{ resetToken: string }> {
    const resetToken = await this.otpService.validateOtpAndIssueResetToken(
      dto.email,
      dto.otp,
    );
    return { resetToken };
  }

  /**
   * Resets the password using the reset token issued by verifyOtp.
   * Token is single-use, expires after 15 minutes.
   */
  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const userId = await this.otpService.consumeResetToken(dto.resetToken);
    const hashedPassword = await hashPassword(dto.newPassword);
    await this.authRepo.updatePassword(userId, hashedPassword);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.authRepo.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    const userWithPassword = await this.authRepo.findByEmail(user.email, true);
    if (!userWithPassword) throw AppError.notFound('User not found');

    const isMatch = await comparePassword(dto.currentPassword, userWithPassword.password);
    if (!isMatch) {
      throw AppError.unauthorized('Current password is incorrect', ErrorCodes.INVALID_CREDENTIALS);
    }

    const hashed = await hashPassword(dto.newPassword);
    await this.authRepo.updatePassword(userId, hashed);
  }

  async updateEmail(userId: string, dto: { newEmail: string; password: string }): Promise<{ email: string }> {
    const user = await this.authRepo.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    const userWithPassword = await this.authRepo.findByEmail(user.email, true);
    if (!userWithPassword) throw AppError.notFound('User not found');

    const isMatch = await comparePassword(dto.password, userWithPassword.password);
    if (!isMatch) {
      throw AppError.unauthorized('Password is incorrect', ErrorCodes.INVALID_CREDENTIALS);
    }

    const emailTaken = await this.authRepo.existsByEmail(dto.newEmail);
    if (emailTaken) throw AppError.conflict('That email address is already in use');

    await this.authRepo.updateEmail(userId, dto.newEmail);
    return { email: dto.newEmail.toLowerCase() };
  }
}
