import { CorsOptions } from 'cors';
import { env } from './env.config';

function buildAllowedOrigins(): string[] {
  return [env.cors.frontendUrl, env.cors.origin]
    .filter(Boolean)
    .flatMap((s) => s.split(',').map((o) => o.trim()))
    .filter(Boolean);
}

const allowedOrigins = buildAllowedOrigins();

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (env.node.isDev) return callback(null, true);
    if (allowedOrigins.some((a) => origin === a || origin.startsWith(a))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin "${origin}" not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  maxAge: 86400,
};
