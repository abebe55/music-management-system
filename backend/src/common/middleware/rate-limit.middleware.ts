import rateLimit from 'express-rate-limit';
import { env } from '../../config/env.config';
import { sendError } from '../utils/response';
import { HttpStatus } from '../constants/http-status';

/**
 * Global rate limit — applied to all routes.
 * Development: 1000 req / 15 min (generous for local use, never blocks normal app usage).
 * Production: uses env RATE_LIMIT_MAX value.
 */
export const globalRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 1000 : env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (_req, res) => {
    sendError(
      res,
      'Too many requests. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS,
      'TOO_MANY_REQUESTS',
    );
  },
});

/**
 * Auth rate limit — applied only to login / forgot-password / OTP routes.
 * Only FAILED requests count (skipSuccessfulRequests: true).
 * Prevents brute-force without ever blocking normal usage.
 * Development: 100 failures / 15 min.
 * Production: uses env AUTH_RATE_LIMIT_MAX value.
 */
export const authRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 100 : env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => {
    sendError(
      res,
      'Too many authentication attempts. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS,
      'TOO_MANY_REQUESTS',
    );
  },
});
