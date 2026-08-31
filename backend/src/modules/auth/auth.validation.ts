import Joi from 'joi';
import { AuthConstants } from '../../common/constants/auth.constants';

/**
 * Enterprise password policy:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 digit
 * - At least 1 special character (!@#$%^&*…)
 */
const passwordSchema = Joi.string()
  .min(AuthConstants.PASSWORD_MIN_LENGTH)
  .max(AuthConstants.PASSWORD_MAX_LENGTH)
  .pattern(/[A-Z]/, 'uppercase letter')
  .pattern(/[a-z]/, 'lowercase letter')
  .pattern(/[0-9]/, 'number')
  .pattern(/[^A-Za-z0-9]/, 'special character')
  .required()
  .messages({
    'string.min': `Password must be at least ${AuthConstants.PASSWORD_MIN_LENGTH} characters`,
    'string.pattern.name': 'Password must contain at least one {#name}',
  });

const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .max(AuthConstants.EMAIL_MAX_LENGTH)
  .lowercase()
  .trim()
  .required();

export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password is required',
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

export const verifyOtpSchema = Joi.object({
  email: emailSchema,
  otp: Joi.string()
    .length(AuthConstants.OTP_LENGTH)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.length': `OTP must be ${AuthConstants.OTP_LENGTH} digits`,
      'string.pattern.base': 'OTP must contain only digits',
    }),
});

// New: uses resetToken issued by verify-otp, not email+otp
export const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().length(64).required().messages({
    'string.length': 'Invalid reset token',
    'any.required': 'Reset token is required',
  }),
  newPassword: passwordSchema,
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordSchema,
});

export const updateEmailSchema = Joi.object({
  newEmail: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'Password is required to confirm email change',
  }),
});
