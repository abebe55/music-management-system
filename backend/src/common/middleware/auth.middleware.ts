import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { AppError } from '../errors/app-error';
import { Messages } from '../constants/messages';
import { AuthConstants } from '../constants/auth.constants';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers[AuthConstants.HEADER_NAME.toLowerCase()];

    if (!authHeader || typeof authHeader !== 'string') {
      throw AppError.unauthorized(Messages.auth.UNAUTHORIZED);
    }

    if (!authHeader.startsWith(AuthConstants.TOKEN_PREFIX)) {
      throw AppError.unauthorized(Messages.auth.TOKEN_INVALID);
    }

    const token = authHeader.slice(AuthConstants.TOKEN_PREFIX.length);
    const payload = verifyAccessToken(token);

    req.userId = payload.userId;
    req.user = { _id: payload.userId, email: payload.email } as never;

    next();
  } catch (error) {
    next(error);
  }
}
