export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}
