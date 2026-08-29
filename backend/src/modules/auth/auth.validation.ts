import Joi from 'joi';
import { AuthConstants } from '../../common/constants/auth.constants';

const passwordSchema = Joi.string()
  .min(AuthConstants.PASSWORD_MIN_LENGTH)
  .max(AuthConstants.PASSWORD_MAX_LENGTH)
  .required();

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

export const resetPasswordSchema = Joi.object({
  email: emailSchema,
  otp: Joi.string()
    .length(AuthConstants.OTP_LENGTH)
    .pattern(/^\d+$/)
    .required(),
  newPassword: passwordSchema,
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordSchema,
});

export const updateEmailSchema = Joi.object({
  newEmail: emailSchema,
  password: Joi.string().required().messages({
    'any.required': 'Password is required to change email',
    'string.empty': 'Password is required to change email',
  }),
});
