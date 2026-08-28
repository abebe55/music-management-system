import { AuthRepository } from './repositories/auth.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { OtpService } from './services/otp.service';
import { EmailService } from './services/email.service';
import { SessionService } from './services/session.service';
import { hashPassword, comparePassword } from '../../common/utils/password';
import { AppError } from '../../common/errors/app-error';
import { Messages } from '../../common/constants/messages';
import { ErrorCodes } from '../../common/errors/error-codes';
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
    this.otpService = new OtpService(this.passwordResetRepo, this.authRepo);
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

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const { otp } = await this.otpService.generateAndStoreOtp(dto.email);
    await this.emailService.sendOtpEmail(dto.email, otp);
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<void> {
    // Just validates — does not consume. Frontend will use OTP in reset step.
    await this.otpService.validateOtp(dto.email, dto.otp);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const record = await this.otpService.validateOtp(dto.email, dto.otp);

    const user = await this.authRepo.findByEmail(dto.email);
    if (!user) {
      throw AppError.notFound(Messages.auth.EMAIL_NOT_FOUND, ErrorCodes.EMAIL_NOT_FOUND);
    }

    const hashedPassword = await hashPassword(dto.newPassword);
    await this.authRepo.updatePassword(String(user._id), hashedPassword);
    await this.otpService.consumeOtp(String(record._id));
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.authRepo.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    // Reload with password
    const userWithPassword = await this.authRepo.findByEmail(user.email, true);
    if (!userWithPassword) {
      throw AppError.notFound('User not found');
    }

    const isMatch = await comparePassword(dto.currentPassword, userWithPassword.password);
    if (!isMatch) {
      throw AppError.unauthorized(
        'Current password is incorrect',
        ErrorCodes.INVALID_CREDENTIALS,
      );
    }

    const hashed = await hashPassword(dto.newPassword);
    await this.authRepo.updatePassword(userId, hashed);
  }
}
