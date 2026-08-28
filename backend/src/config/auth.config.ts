import { env } from './env.config';

export const authConfig = {
  jwt: {
    secret: env.jwt.secret,
    expiresIn: env.jwt.expiresIn,
    refreshSecret: env.jwt.refreshSecret,
    refreshExpiresIn: env.jwt.refreshExpiresIn,
  },
  bcrypt: {
    saltRounds: 12,
  },
  otp: {
    length: 6,
    expiresMinutes: env.otp.expiresMinutes,
    maxAttempts: env.otp.maxAttempts,
  },
  session: {
    cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  },
} as const;
