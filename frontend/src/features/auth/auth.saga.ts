import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { authActions } from './auth.slice';
import { authApi } from '../../api/auth.api';
import { storage } from '../../utils/storage';
import { extractErrorMessage } from '../../utils/error-handler';
import { ApiResponse } from '../../types/api';
import { User, AuthTokens } from '../../types/auth';

function* loginSaga(action: ReturnType<typeof authActions.loginRequest>) {
  try {
    const response: AxiosResponse<ApiResponse<{ user: User; tokens: AuthTokens }>> = yield call(
      authApi.login,
      action.payload,
    );
    const { user, tokens } = response.data.data!;
    storage.setAccessToken(tokens.accessToken);
    storage.setRefreshToken(tokens.refreshToken);
    storage.setUser(user);
    yield put(authActions.loginSuccess({ user, tokens }));
  } catch (error) {
    yield put(authActions.loginFailure(extractErrorMessage(error)));
  }
}

function* logoutSaga() {
  try {
    yield call(authApi.logout);
  } finally {
    storage.clearAll();
    yield put(authActions.logoutSuccess());
  }
}

function* forgotPasswordSaga(action: ReturnType<typeof authActions.forgotPasswordRequest>) {
  try {
    yield call(authApi.forgotPassword, { email: action.payload.email });
    yield put(authActions.forgotPasswordSuccess({ email: action.payload.email }));
  } catch (error) {
    yield put(authActions.forgotPasswordFailure(extractErrorMessage(error)));
  }
}

function* verifyOtpSaga(action: ReturnType<typeof authActions.verifyOtpRequest>) {
  try {
    yield call(authApi.verifyOtp, action.payload);
    // Pass the OTP forward so ResetPasswordForm can use it
    yield put(authActions.verifyOtpSuccess({ otp: action.payload.otp }));
  } catch (error) {
    yield put(authActions.verifyOtpFailure(extractErrorMessage(error)));
  }
}

function* resetPasswordSaga(action: ReturnType<typeof authActions.resetPasswordRequest>) {
  try {
    yield call(authApi.resetPassword, action.payload);
    yield put(authActions.resetPasswordSuccess());
  } catch (error) {
    yield put(authActions.resetPasswordFailure(extractErrorMessage(error)));
  }
}

function* changePasswordSaga(action: ReturnType<typeof authActions.changePasswordRequest>) {
  try {
    yield call(authApi.changePassword, action.payload);
    yield put(authActions.changePasswordSuccess());
  } catch (error) {
    yield put(authActions.changePasswordFailure(extractErrorMessage(error)));
  }
}

function* updateEmailSaga(action: ReturnType<typeof authActions.updateEmailRequest>) {
  try {
    const response: AxiosResponse<ApiResponse<{ email: string }>> = yield call(
      authApi.updateEmail,
      action.payload,
    );
    const newEmail = response.data.data!.email;
    // Persist updated user to localStorage
    const stored = storage.getUser<{ id: string; email: string }>();
    if (stored) storage.setUser({ ...stored, email: newEmail });
    yield put(authActions.updateEmailSuccess({ email: newEmail }));
  } catch (error) {
    yield put(authActions.updateEmailFailure(extractErrorMessage(error)));
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginRequest.type, loginSaga);
  yield takeLatest(authActions.logoutRequest.type, logoutSaga);
  yield takeLatest(authActions.forgotPasswordRequest.type, forgotPasswordSaga);
  yield takeLatest(authActions.verifyOtpRequest.type, verifyOtpSaga);
  yield takeLatest(authActions.resetPasswordRequest.type, resetPasswordSaga);
  yield takeLatest(authActions.changePasswordRequest.type, changePasswordSaga);
  yield takeLatest(authActions.updateEmailRequest.type, updateEmailSaga);
}
