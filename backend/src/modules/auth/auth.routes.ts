import { Router } from 'express';
import { asyncHandler } from '../../common/utils/async-handler';
import { validate } from '../../common/middleware/validation.middleware';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authRateLimit } from '../../common/middleware/rate-limit.middleware';
import {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  getMe,
  logout,
  refreshToken,
} from './auth.controller';
import {
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validation';

const router = Router();

// Public routes (rate-limited)
router.post('/login', authRateLimit, validate(loginSchema), asyncHandler(login));
router.post('/forgot-password', authRateLimit, validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/verify-otp', authRateLimit, validate(verifyOtpSchema), asyncHandler(verifyOtp));
router.post('/reset-password', authRateLimit, validate(resetPasswordSchema), asyncHandler(resetPassword));
router.post('/refresh-token', asyncHandler(refreshToken));

// Protected routes
router.get('/me', authenticate, asyncHandler(getMe));
router.post('/logout', authenticate, asyncHandler(logout));
router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(changePassword));

export default router;
