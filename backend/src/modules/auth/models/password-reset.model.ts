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
    otp: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Auto-delete expired documents
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
passwordResetSchema.index({ email: 1, isUsed: 1 });

export const PasswordResetModel = mongoose.model<IPasswordReset>(
  'PasswordReset',
  passwordResetSchema,
);
