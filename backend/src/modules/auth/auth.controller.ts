import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../common/utils/response';
import { Messages } from '../../common/constants/messages';
import { HttpStatus } from '../../common/constants/http-status';
import {
  LoginDto,
  ForgotPasswordDto,
  VerifyOtpDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './auth.types';

const authService = new AuthService();

export async function login(req: Request, res: Response): Promise<void> {
  const dto = req.body as LoginDto;
  const result = await authService.login(dto);
  sendSuccess(res, result, Messages.auth.LOGIN_SUCCESS);
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const dto = req.body as ForgotPasswordDto;
  await authService.forgotPassword(dto);
  sendSuccess(res, null, Messages.auth.OTP_SENT);
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const dto = req.body as VerifyOtpDto;
  await authService.verifyOtp(dto);
  sendSuccess(res, null, Messages.auth.OTP_VERIFIED);
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const dto = req.body as ResetPasswordDto;
  await authService.resetPassword(dto);
  sendSuccess(res, null, Messages.auth.PASSWORD_RESET);
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const dto = req.body as ChangePasswordDto;
  await authService.changePassword(req.userId!, dto);
  sendSuccess(res, null, Messages.auth.PASSWORD_CHANGED);
}

export async function getMe(req: Request, res: Response): Promise<void> {
  sendSuccess(res, { id: req.userId, email: req.user?.email }, 'Profile retrieved');
}

export async function logout(_req: Request, res: Response): Promise<void> {
  // Stateless JWT — client discards token; server-side is a no-op
  sendSuccess(res, null, Messages.auth.LOGOUT_SUCCESS);
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { verifyRefreshToken } = await import('../../common/utils/token');
  const { refreshToken: token } = req.body as { refreshToken: string };
  if (!token) {
    res.status(400).json({ success: false, message: 'Refresh token required' });
    return;
  }
  const payload = verifyRefreshToken(token);
  const { SessionService } = await import('./services/session.service');
  const session = new SessionService();
  const tokens = session.generateTokens(payload.userId, payload.email);
  sendSuccess(res, { tokens }, 'Token refreshed');
}
