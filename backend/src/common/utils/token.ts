import jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config';
import { AppError } from '../errors/app-error';
import { ErrorCodes } from '../errors/error-codes';
import { Messages } from '../constants/messages';

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function signAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
  });
}

export function signRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, authConfig.jwt.refreshSecret, {
    expiresIn: authConfig.jwt.refreshExpiresIn,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, authConfig.jwt.secret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized(Messages.auth.TOKEN_EXPIRED, ErrorCodes.TOKEN_EXPIRED);
    }
    throw AppError.unauthorized(Messages.auth.TOKEN_INVALID, ErrorCodes.TOKEN_INVALID);
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, authConfig.jwt.refreshSecret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized(Messages.auth.TOKEN_EXPIRED, ErrorCodes.TOKEN_EXPIRED);
    }
    throw AppError.unauthorized(Messages.auth.TOKEN_INVALID, ErrorCodes.TOKEN_INVALID);
  }
}
