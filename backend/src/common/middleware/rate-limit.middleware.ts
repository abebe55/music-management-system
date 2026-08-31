import rateLimit from 'express-rate-limit';
import { env } from '../../config/env.config';
import { sendError } from '../utils/response';
import { HttpStatus } from '../constants/http-status';

/**
 * Global rate limit — applied to all routes.
 * Dev: 1000 req/15 min. Prod: env RATE_LIMIT_MAX.
 */
export const globalRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 1000 : env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 'Too many requests. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  },
});

/**
 * Login rate limit — counts only FAILED attempts.
 * Dev: 50 failures/15 min. Prod: env AUTH_RATE_LIMIT_MAX.
 */
export const loginRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 50 : env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,   // only failed logins count
  handler: (_req, res) => {
    sendError(res, 'Too many failed login attempts. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  },
});

/**
 * OTP request rate limit — applied to /forgot-password.
 * Limits how many OTP emails a single IP can request.
 * Dev: 20 req/15 min. Prod: 5 req/15 min.
 * skipSuccessfulRequests: false — every request counts.
 */
export const otpRequestRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 20 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (_req, res) => {
    sendError(res,
      'Too many verification code requests. Please wait before requesting another.',
      HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  },
});

/**
 * OTP verification rate limit — applied to /verify-otp and /reset-password.
 * Limits brute-force attempts on OTP codes.
 * Dev: 30 req/15 min. Prod: 10 req/15 min.
 */
export const otpVerifyRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 30 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => {
    sendError(res,
      'Too many verification attempts. Please wait before trying again.',
      HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  },
});

/** @deprecated Use loginRateLimit instead */
export const authRateLimit = loginRateLimit;
