import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types/api-response';
import { HttpStatus } from '../constants/http-status';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string,
  statusCode: number = HttpStatus.OK,
  pagination?: PaginationMeta,
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...(pagination ? { pagination } : {}),
    },
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  code: string = 'INTERNAL_ERROR',
  details?: unknown,
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    error: { code, ...(details ? { details } : {}) },
    meta: { timestamp: new Date().toISOString() },
  };
  return res.status(statusCode).json(response);
}
