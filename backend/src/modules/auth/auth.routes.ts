import { Router } from 'express';
import { asyncHandler } from '../../common/utils/async-handler';
import { validate } from '../../common/middleware/validation.middleware';
import { authenticate } from '../../common/middleware/auth.middleware';
import {
  loginRateLimit,
  otpRequestRateLimit,
  otpVerifyRateLimit,
} from '../../common/middleware/rate-limit.middleware';
import {
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  updateEmail,
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
  updateEmailSchema,
} from './auth.validation';

const router = Router();

// ── Public routes ─────────────────────────────────────────────
router.post('/login',
  loginRateLimit,
  validate(loginSchema),
  asyncHandler(login),
);

router.post('/forgot-password',
  otpRequestRateLimit,        // dedicated OTP-request limiter
  validate(forgotPasswordSchema),
  asyncHandler(forgotPassword),
);

router.post('/verify-otp',
  otpVerifyRateLimit,          // dedicated OTP-verify limiter
  validate(verifyOtpSchema),
  asyncHandler(verifyOtp),
);

router.post('/reset-password',
  otpVerifyRateLimit,          // same strict limit on reset attempts
  validate(resetPasswordSchema),
  asyncHandler(resetPassword),
);

router.post('/refresh-token', asyncHandler(refreshToken));

// ── Protected routes ──────────────────────────────────────────
router.get('/me', authenticate, asyncHandler(getMe));
router.post('/logout', authenticate, asyncHandler(logout));
router.post('/change-password',
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(changePassword),
);

router.post('/update-email',
  authenticate,
  validate(updateEmailSchema),
  asyncHandler(updateEmail),
);

export default router;

