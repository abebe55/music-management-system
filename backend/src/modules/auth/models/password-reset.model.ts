import mongoose, { Schema } from 'mongoose';
import { IPasswordReset } from '../auth.types';

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    // Store bcrypt hash, never plaintext OTP
    otpHash: {
      type: String,
      required: true,
    },
    // Short-lived token issued after successful OTP verification
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiresAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    // Timestamp of most recent OTP request — enforces resend cooldown
    lastRequestedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Auto-delete expired documents via MongoDB TTL index
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
passwordResetSchema.index({ email: 1, isUsed: 1 });
passwordResetSchema.index({ resetToken: 1 }, { sparse: true });

export const PasswordResetModel = mongoose.model<IPasswordReset>(
  'PasswordReset',
  passwordResetSchema,
);
