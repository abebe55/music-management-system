import { PasswordResetModel } from '../models/password-reset.model';
import { IPasswordReset } from '../auth.types';

export class PasswordResetRepository {
  async create(
    userId: string,
    email: string,
    otpHash: string,          // hashed OTP
    expiresAt: Date,
  ): Promise<IPasswordReset> {
    // Invalidate any existing unused resets for this email
    await PasswordResetModel.updateMany(
      { email: email.toLowerCase(), isUsed: false },
      { isUsed: true },
    );

    const record = await PasswordResetModel.create({
      userId,
      email: email.toLowerCase(),
      otpHash,
      expiresAt,
    });
    return record.toObject() as unknown as IPasswordReset;
  }

  async findLatestByEmail(email: string): Promise<IPasswordReset | null> {
    return PasswordResetModel.findOne({
      email: email.toLowerCase(),
      isUsed: false,
    })
      .sort({ createdAt: -1 })
      .lean<IPasswordReset>()
      .exec();
  }

  /**
   * Returns the most recent OTP request time for this email
   * regardless of isUsed status — used for resend cooldown.
   */
  async findLatestRequestTime(email: string): Promise<Date | null> {
    const record = await PasswordResetModel.findOne({
      email: email.toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .select('lastRequestedAt createdAt')
      .lean()
      .exec();

    if (!record) return null;
    return (record as { lastRequestedAt?: Date; createdAt: Date }).lastRequestedAt
      ?? (record as { createdAt: Date }).createdAt;
  }

  async findByResetToken(token: string): Promise<IPasswordReset | null> {
    return PasswordResetModel.findOne({
      resetToken: token,
      isUsed: false,
    })
      .lean<IPasswordReset>()
      .exec();
  }

  async setResetToken(id: string, resetToken: string, resetTokenExpiresAt: Date): Promise<void> {
    await PasswordResetModel.findByIdAndUpdate(id, {
      resetToken,
      resetTokenExpiresAt,
    });
  }

  async incrementAttempts(id: string): Promise<void> {
    await PasswordResetModel.findByIdAndUpdate(id, { $inc: { attempts: 1 } });
  }

  async markAsUsed(id: string): Promise<void> {
    await PasswordResetModel.findByIdAndUpdate(id, {
      isUsed: true,
      resetToken: null,
      resetTokenExpiresAt: null,
    });
  }

  async deleteByEmail(email: string): Promise<void> {
    await PasswordResetModel.deleteMany({ email: email.toLowerCase() });
  }
}
