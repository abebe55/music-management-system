import rateLimit from 'express-rate-limit';
import { env } from '../../config/env.config';
import { sendError } from '../utils/response';
import { HttpStatus } from '../constants/http-status';

export const globalRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(
      res,
      'Too many requests. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS,
      'TOO_MANY_REQUESTS',
    );
  },
});

export const authRateLimit = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.authMax,
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
