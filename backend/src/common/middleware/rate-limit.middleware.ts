import rateLimit from 'express-rate-limit';
import { env } from '../../config/env.config';
import { sendError } from '../utils/response';
import { HttpStatus } from '../constants/http-status';

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

// Only failed login attempts count toward this limit
export const loginRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 50 : env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => {
    sendError(res, 'Too many failed login attempts. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  },
});

// Every OTP email request counts (prevents email spam)
export const otpRequestRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 20 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (_req, res) => {
    sendError(res, 'Too many verification code requests. Please wait before requesting another.',
      HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  },
});

// OTP verification attempts — prevents brute-force guessing
export const otpVerifyRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.node.isDev ? 30 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => {
    sendError(res, 'Too many verification attempts. Please wait before trying again.',
      HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  },
});

/** @deprecated Use loginRateLimit */
export const authRateLimit = loginRateLimit;
