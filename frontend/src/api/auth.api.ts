import client from './client';
import {
  LoginRequest,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
  AuthTokens,
} from '../types/auth';
import { ApiResponse } from '../types/api';

interface LoginResponseData {
  user: User;
  tokens: AuthTokens;
}

export const authApi = {
  login: (data: LoginRequest) =>
    client.post<ApiResponse<LoginResponseData>>('/auth/login', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    client.post<ApiResponse<null>>('/auth/forgot-password', data),

  verifyOtp: (data: VerifyOtpRequest) =>
    client.post<ApiResponse<null>>('/auth/verify-otp', data),

  resetPassword: (data: ResetPasswordRequest) =>
    client.post<ApiResponse<null>>('/auth/reset-password', data),

  changePassword: (data: ChangePasswordRequest) =>
    client.post<ApiResponse<null>>('/auth/change-password', data),

  getMe: () =>
    client.get<ApiResponse<{ id: string; email: string }>>('/auth/me'),

  logout: () =>
    client.post<ApiResponse<null>>('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    client.post<ApiResponse<{ tokens: AuthTokens }>>('/auth/refresh-token', { refreshToken }),
};
