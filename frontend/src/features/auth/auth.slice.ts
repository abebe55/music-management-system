import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, AuthTokens } from '../../types/auth';
import { storage } from '../../utils/storage';

const initialState: AuthState = {
  user: storage.getUser<User>(),
  tokens: storage.getAccessToken()
    ? { accessToken: storage.getAccessToken()!, refreshToken: storage.getRefreshToken() ?? '' }
    : null,
  isAuthenticated: !!storage.getAccessToken(),
  isLoading: false,
  error: null,
  forgotPasswordStep: 'email',
  forgotPasswordEmail: '',
  forgotPasswordResetToken: '',   // short-lived token from verifyOtp
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ── Login ─────────────────────────────────────────────────
    loginRequest: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── Logout ────────────────────────────────────────────────
    logoutRequest: (state) => { state.isLoading = true; },
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.tokens = null;
      state.error = null;
    },

    // ── Forgot password ───────────────────────────────────────
    forgotPasswordRequest: (state, _action: PayloadAction<{ email: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    forgotPasswordSuccess: (state, action: PayloadAction<{ email: string }>) => {
      state.isLoading = false;
      state.forgotPasswordStep = 'otp';
      state.forgotPasswordEmail = action.payload.email;
    },
    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── Verify OTP ────────────────────────────────────────────
    verifyOtpRequest: (state, _action: PayloadAction<{ email: string; otp: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    // Backend now returns a short-lived resetToken — store it for the reset step
    verifyOtpSuccess: (state, action: PayloadAction<{ resetToken: string }>) => {
      state.isLoading = false;
      state.forgotPasswordStep = 'reset';
      state.forgotPasswordResetToken = action.payload.resetToken;
    },
    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── Reset password ────────────────────────────────────────
    resetPasswordRequest: (
      state,
      _action: PayloadAction<{ resetToken: string; newPassword: string }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state) => {
      state.isLoading = false;
      state.forgotPasswordStep = 'done';
      state.forgotPasswordResetToken = '';   // clear after use
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── Change password ───────────────────────────────────────
    changePasswordRequest: (
      state,
      _action: PayloadAction<{ currentPassword: string; newPassword: string }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    changePasswordSuccess: (state) => { state.isLoading = false; },
    changePasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── Update email ──────────────────────────────────────────
    updateEmailRequest: (
      state,
      _action: PayloadAction<{ newEmail: string; password: string }>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateEmailSuccess: (state, action: PayloadAction<{ email: string }>) => {
      state.isLoading = false;
      if (state.user) {
        state.user = { ...state.user, email: action.payload.email };
      }
    },
    updateEmailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ── UI helpers ────────────────────────────────────────────
    clearError: (state) => { state.error = null; },
    resetForgotPasswordFlow: (state) => {
      state.forgotPasswordStep = 'email';
      state.forgotPasswordEmail = '';
      state.forgotPasswordResetToken = '';
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;

