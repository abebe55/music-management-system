import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { HttpStatus } from '../constants/http-status';
import { env } from '../../config/env.config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (!env.node.isTest) {
      logger.warn(`[${err.code}] ${err.message}`, {
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
      });
    }
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    sendError(res, 'Validation failed', HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', err.message);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    sendError(res, 'Invalid ID format', HttpStatus.BAD_REQUEST, 'INVALID_ID');
    return;
  }

  // MongoDB duplicate key
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError' &&
      (err as { code?: number }).code === 11000) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue ?? {};
    const isDuplicate = 'title' in keyValue || 'artist' in keyValue;
    const message = isDuplicate
      ? 'A song with this title, artist and album already exists'
      : 'Duplicate entry';
    sendError(res, message, HttpStatus.CONFLICT, 'CONFLICT');
    return;
  }

  // JWT errors handled in token utility, but just in case
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', HttpStatus.UNAUTHORIZED, 'TOKEN_INVALID');
    return;
  }

  // Unknown / programming errors
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  sendError(
    res,
    env.node.isProd ? 'Internal server error' : err.message,
    HttpStatus.INTERNAL_SERVER_ERROR,
    'INTERNAL_ERROR',
  );
}
