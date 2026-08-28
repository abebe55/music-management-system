import crypto from 'crypto';
import { authConfig } from '../../config/auth.config';

/**
 * Generates a cryptographically secure numeric OTP of the configured length.
 */
export function generateOtp(): string {
  const length = authConfig.otp.length;
  const max = Math.pow(10, length);
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0) % max;
  return num.toString().padStart(length, '0');
}

export function getOtpExpiryDate(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + authConfig.otp.expiresMinutes);
  return expiry;
}

export function isOtpExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
