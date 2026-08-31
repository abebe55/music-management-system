import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPasswordReset extends Document {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  otpHash: string;
  resetToken?: string;
  resetTokenExpiresAt?: Date;
  expiresAt: Date;
  attempts: number;
  isUsed: boolean;
  /** When the most recent OTP was requested — used for resend cooldown */
  lastRequestedAt: Date;
  createdAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  resetToken: string;       // replaces email+otp — token is single-use
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  tokens: AuthTokens;
}
