import { CorsOptions } from 'cors';
import { env } from './env.config';

/**
 * Build the allowed-origins list from environment variables.
 *
 * Priority (all are comma-separated lists):
 *   1. FRONTEND_URL  — set this on Render to your Vercel app URL
 *   2. CORS_ORIGIN   — legacy / local dev fallback
 *
 * Examples:
 *   FRONTEND_URL=https://musicflow.vercel.app
 *   CORS_ORIGIN=http://localhost:5173
 */
function buildAllowedOrigins(): string[] {
  const sources = [
    env.cors.frontendUrl,  // production Vercel URL
    env.cors.origin,       // dev fallback / extra origins
  ];

  return sources
    .filter(Boolean)
    .flatMap((s) => s.split(',').map((o) => o.trim()))
    .filter(Boolean);
}

const allowedOrigins = buildAllowedOrigins();

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // In dev, allow everything for convenience
    if (env.node.isDev) return callback(null, true);

    if (allowedOrigins.some((allowed) => origin === allowed || origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin "${origin}" not allowed. Add it to FRONTEND_URL or CORS_ORIGIN.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  maxAge: 86400, // 24-hour preflight cache
};
