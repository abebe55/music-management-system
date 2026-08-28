import { HttpStatus, HttpStatusCode } from '../constants/http-status';
import { ErrorCode, ErrorCodes } from './error-codes';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    code: ErrorCode = ErrorCodes.INTERNAL_ERROR,
    details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(message, HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR, details);
  }

  static unauthorized(message: string, code: ErrorCode = ErrorCodes.UNAUTHORIZED): AppError {
    return new AppError(message, HttpStatus.UNAUTHORIZED, code);
  }

  static forbidden(message: string): AppError {
    return new AppError(message, HttpStatus.FORBIDDEN, ErrorCodes.FORBIDDEN);
  }

  static notFound(message: string, code: ErrorCode = ErrorCodes.NOT_FOUND): AppError {
    return new AppError(message, HttpStatus.NOT_FOUND, code);
  }

  static conflict(message: string): AppError {
    return new AppError(message, HttpStatus.CONFLICT, ErrorCodes.CONFLICT);
  }

  static tooManyRequests(message: string): AppError {
    return new AppError(message, HttpStatus.TOO_MANY_REQUESTS, ErrorCodes.TOO_MANY_REQUESTS);
  }

  static internal(message: string): AppError {
    return new AppError(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCodes.INTERNAL_ERROR);
  }
}
