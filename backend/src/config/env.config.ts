import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

/**
 * Validates all required environment variables at startup.
 * Throws immediately with a descriptive message if any are missing
 * so the app never starts silently misconfigured.
 */
export function validateEnv(): void {
  const required: Record<string, string | undefined> = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
  };

  const missing = Object.entries(required)
    .filter(([, v]) => !v || v.length < 10)
    .map(([k]) => k);

  if (missing.length > 0) {
    throw new Error(
      `Missing or invalid required environment variables: ${missing.join(', ')}\n` +
      `Copy backend/.env.example to backend/.env and fill in the values.`,
    );
  }

  // Warn about insecure defaults in production
  if (process.env.NODE_ENV === 'production') {
    const insecureDefaults = [
      'music_management_jwt_secret_super_secure_key_2024',
      'music_management_refresh_secret_super_secure_key_2024',
    ];
    if (insecureDefaults.includes(process.env.JWT_SECRET ?? '')) {
      throw new Error('JWT_SECRET must be changed from the default value in production');
    }
  }
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
    uri: optionalEnv('MONGODB_URI', 'mongodb://localhost:27017/music_management'),
  },
  jwt: {
    secret: optionalEnv('JWT_SECRET', 'music_management_jwt_secret_super_secure_key_2024'),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
    refreshSecret: optionalEnv('JWT_REFRESH_SECRET', 'music_management_refresh_secret_super_secure_key_2024'),
    refreshExpiresIn: optionalEnv('JWT_REFRESH_EXPIRES_IN', '30d'),
  },
  email: {
    host: optionalEnv('SMTP_HOST', 'smtp.gmail.com'),
    port: parseInt(optionalEnv('SMTP_PORT', '587'), 10),
    secure: optionalEnv('SMTP_SECURE', 'false') === 'true',
    user: optionalEnv('SMTP_USER', ''),
    pass: optionalEnv('SMTP_PASS', ''),
    from: optionalEnv('EMAIL_FROM', 'MusicFlow <noreply@musicflow.com>'),
    brevoApiKey: optionalEnv('BREVO_API_KEY', ''),
    fromName: optionalEnv('EMAIL_FROM_NAME', 'MusicFlow'),
    fromAddress: optionalEnv('EMAIL_FROM_ADDRESS', 'noreply@musicflow.com'),
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
