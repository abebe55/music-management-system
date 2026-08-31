import { RootState } from '../../app/store';

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectForgotPasswordStep = (state: RootState) => state.auth.forgotPasswordStep;
export const selectForgotPasswordEmail = (state: RootState) => state.auth.forgotPasswordEmail;
export const selectForgotPasswordResetToken = (state: RootState) => state.auth.forgotPasswordResetToken;
