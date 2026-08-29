import jwt, { SignOptions } from 'jsonwebtoken';
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
  const options: SignOptions = { expiresIn: authConfig.jwt.expiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, authConfig.jwt.secret as string, options);
}

export function signRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = { expiresIn: authConfig.jwt.refreshExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, authConfig.jwt.refreshSecret as string, options);
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, authConfig.jwt.secret as string) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized(Messages.auth.TOKEN_EXPIRED, ErrorCodes.TOKEN_EXPIRED);
    }
    throw AppError.unauthorized(Messages.auth.TOKEN_INVALID, ErrorCodes.TOKEN_INVALID);
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, authConfig.jwt.refreshSecret as string) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized(Messages.auth.TOKEN_EXPIRED, ErrorCodes.TOKEN_EXPIRED);
    }
    throw AppError.unauthorized(Messages.auth.TOKEN_INVALID, ErrorCodes.TOKEN_INVALID);
  }
}
