import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authActions } from '../../../features/auth/auth.slice';
import {
  selectAuthLoading, selectAuthError,
  selectForgotPasswordEmail,
} from '../../../features/auth/auth.selectors';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import styled from '@emotion/styled';

const Form = styled.form`display: flex; flex-direction: column; gap: 18px;`;

// The OTP is carried from the verify step via redux state (forgotPasswordEmail is already set)
// But we need the otp string — it's stored in a local prop passed from the parent
interface ResetPasswordFormProps {
  otp: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ otp }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const email = useAppSelector(selectForgotPasswordEmail);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(authActions.resetPasswordRequest({ email, otp, newPassword: password }));
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormError message={error} />
      <Input
        label="New Password"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
        error={errors.password}
        required
        disabled={isLoading}
        autoComplete="new-password"
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })); }}
        error={errors.confirm}
        required
        disabled={isLoading}
        autoComplete="new-password"
      />
      <Button type="submit" fullWidth isLoading={isLoading}>
        Reset Password
      </Button>
    </Form>
  );
};
