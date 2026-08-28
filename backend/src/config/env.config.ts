import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  node: {
    env: optionalEnv('NODE_ENV', 'development'),
    port: parseInt(optionalEnv('PORT', '5000'), 10),
    isDev: optionalEnv('NODE_ENV', 'development') === 'development',
    isProd: optionalEnv('NODE_ENV', 'development') === 'production',
    isTest: optionalEnv('NODE_ENV', 'development') === 'test',
  },
  db: {
    uri: optionalEnv(
      'MONGODB_URI',
      'mongodb://localhost:27017/music_management',
    ),
  },
  jwt: {
    secret: optionalEnv(
      'JWT_SECRET',
      'music_management_jwt_secret_super_secure_key_2024',
    ),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
    refreshSecret: optionalEnv(
      'JWT_REFRESH_SECRET',
      'music_management_refresh_secret_super_secure_key_2024',
    ),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
  },
  email: {
    host: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
    port: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
    secure: optionalEnv('SMTP_SECURE', 'false') === 'true',
    user: optionalEnv('SMTP_USER', ''),
    pass: optionalEnv('SMTP_PASS', ''),
    from: optionalEnv('EMAIL_FROM', 'MusicFlow <noreply@musicflow.com>'),
  },
  otp: {
    expiresMinutes: parseInt(optionalEnv('OTP_EXPIRES_MINUTES', '10'), 10),
    maxAttempts: parseInt(optionalEnv('OTP_MAX_ATTEMPTS', '5'), 10),
  },
  cors: {
    origin: optionalEnv('CORS_ORIGIN', 'http://localhost:5173'),
  },
  rateLimit: {
    windowMs: parseInt(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(optionalEnv('RATE_LIMIT_MAX', '100'), 10),
    authMax: parseInt(optionalEnv('AUTH_RATE_LIMIT_MAX', '10'), 10),
  },
} as const;
