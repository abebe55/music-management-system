import { PasswordResetModel } from '../models/password-reset.model';
import { IPasswordReset } from '../auth.types';

export class PasswordResetRepository {
  async create(
    userId: string,
    email: string,
    otp: string,
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
      otp,
      expiresAt,
    });
    return record.toObject() as IPasswordReset;
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

  async incrementAttempts(id: string): Promise<void> {
    await PasswordResetModel.findByIdAndUpdate(id, { $inc: { attempts: 1 } });
  }

  async markAsUsed(id: string): Promise<void> {
    await PasswordResetModel.findByIdAndUpdate(id, { isUsed: true });
  }

  async deleteByEmail(email: string): Promise<void> {
    await PasswordResetModel.deleteMany({ email: email.toLowerCase() });
  }
}
