import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { generateOtp, getOtpExpiryDate, isOtpExpired } from '../../../common/utils/otp';
import { AppError } from '../../../common/errors/app-error';
import { Messages } from '../../../common/constants/messages';
import { ErrorCodes } from '../../../common/errors/error-codes';
import { authConfig } from '../../../config/auth.config';
import { IPasswordReset } from '../auth.types';

export class OtpService {
  constructor(
    private readonly passwordResetRepo: PasswordResetRepository,
    private readonly authRepo: AuthRepository,
  ) {}

  async generateAndStoreOtp(email: string): Promise<{ otp: string; record: IPasswordReset }> {
    const user = await this.authRepo.findByEmail(email);
    if (!user) {
      throw AppError.notFound(Messages.auth.EMAIL_NOT_FOUND, ErrorCodes.EMAIL_NOT_FOUND);
    }

    const otp = generateOtp();
    const expiresAt = getOtpExpiryDate();

    const record = await this.passwordResetRepo.create(
      String(user._id),
      email,
      otp,
      expiresAt,
    );

    return { otp, record };
  }

  async validateOtp(email: string, otp: string): Promise<IPasswordReset> {
    const record = await this.passwordResetRepo.findLatestByEmail(email);

    if (!record) {
      throw AppError.unauthorized(Messages.auth.INVALID_OTP, ErrorCodes.OTP_INVALID);
    }

    if (record.attempts >= authConfig.otp.maxAttempts) {
      throw AppError.unauthorized(Messages.auth.OTP_MAX_ATTEMPTS, ErrorCodes.OTP_MAX_ATTEMPTS);
    }

    if (isOtpExpired(record.expiresAt)) {
      throw AppError.unauthorized(Messages.auth.INVALID_OTP, ErrorCodes.OTP_EXPIRED);
    }

    if (record.otp !== otp) {
      await this.passwordResetRepo.incrementAttempts(String(record._id));
      throw AppError.unauthorized(Messages.auth.INVALID_OTP, ErrorCodes.OTP_INVALID);
    }

    return record;
  }

  async consumeOtp(id: string): Promise<void> {
    await this.passwordResetRepo.markAsUsed(id);
  }
}
