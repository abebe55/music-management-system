import crypto from 'crypto';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { generateOtp, getOtpExpiryDate, isOtpExpired } from '../../../common/utils/otp';
import { hashPassword, comparePassword } from '../../../common/utils/password';
import { AppError } from '../../../common/errors/app-error';
import { Messages } from '../../../common/constants/messages';
import { ErrorCodes } from '../../../common/errors/error-codes';
import { authConfig } from '../../../config/auth.config';
import { HttpStatus } from '../../../common/constants/http-status';

// Reset token lives 15 minutes after OTP verification
const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000;

// Minimum seconds a user must wait before requesting another OTP for the same email
const RESEND_COOLDOWN_SECONDS = 60;

export class OtpService {
  constructor(
    private readonly passwordResetRepo: PasswordResetRepository,
  ) {}

  /**
   * Generate a 6-digit OTP, hash it, and store the hash.
   * Enforces a per-email resend cooldown (60 seconds).
   * Returns the plaintext OTP for sending by email — it is NEVER stored.
   */
  async generateAndStoreOtp(userId: string, email: string): Promise<string> {
    // ── Resend cooldown ────────────────────────────────────────
    const lastRequest = await this.passwordResetRepo.findLatestRequestTime(email);
    if (lastRequest) {
      const secondsSinceLast = (Date.now() - lastRequest.getTime()) / 1000;
      if (secondsSinceLast < RESEND_COOLDOWN_SECONDS) {
        const waitSeconds = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLast);
        throw new AppError(
          `Please wait ${waitSeconds} second${waitSeconds !== 1 ? 's' : ''} before requesting a new code`,
          HttpStatus.TOO_MANY_REQUESTS,
          ErrorCodes.TOO_MANY_REQUESTS,
        );
      }
    }

    const otp = generateOtp();
    const otpHash = await hashPassword(otp);      // bcrypt hash — plaintext never stored
    const expiresAt = getOtpExpiryDate();

    await this.passwordResetRepo.create(userId, email, otpHash, expiresAt);

    return otp;
  }

  /**
   * Validate a submitted OTP by comparing it to the stored hash.
   * On success, invalidate the OTP record and issue a short-lived reset token.
   * Returns the resetToken for use in the next step.
   */
  async validateOtpAndIssueResetToken(email: string, otp: string): Promise<string> {
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

    // Compare submitted OTP against stored hash
    const isMatch = await comparePassword(otp, record.otpHash);
    if (!isMatch) {
      await this.passwordResetRepo.incrementAttempts(String(record._id));
      throw AppError.unauthorized(Messages.auth.INVALID_OTP, ErrorCodes.OTP_INVALID);
    }

    // OTP is valid — issue a short-lived, cryptographically secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

    await this.passwordResetRepo.setResetToken(
      String(record._id),
      resetToken,
      resetTokenExpiresAt,
    );

    return resetToken;
  }

  /**
   * Validate a reset token and return the associated user ID.
   * Consumes (marks used) the record on success.
   */
  async consumeResetToken(resetToken: string): Promise<string> {
    const record = await this.passwordResetRepo.findByResetToken(resetToken);

    if (!record) {
      throw AppError.unauthorized('Invalid or expired reset token', ErrorCodes.TOKEN_INVALID);
    }

    if (!record.resetTokenExpiresAt || new Date() > record.resetTokenExpiresAt) {
      throw AppError.unauthorized('Reset token has expired', ErrorCodes.TOKEN_EXPIRED);
    }

    await this.passwordResetRepo.markAsUsed(String(record._id));

    return record.userId;
  }
}
