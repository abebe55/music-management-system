import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authActions } from '../../../features/auth/auth.slice';
import { selectAuthLoading, selectAuthError } from '../../../features/auth/auth.selectors';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import styled from '@emotion/styled';

const Form = styled.form`display: flex; flex-direction: column; gap: 18px;`;

interface ResetPasswordFormProps {
  resetToken: string; // short-lived token from verifyOtp step
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ resetToken }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!password) {
      e.password = 'Password is required';
    } else if (!isPasswordStrong(password)) {
      e.password = 'Password must be 8+ chars with uppercase, lowercase, number and special character';
    }
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // No email or OTP — uses the short-lived reset token from verifyOtp
    dispatch(authActions.resetPasswordRequest({ resetToken, newPassword: password }));
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormError message={error} />

      <Input
        label="New Password"
        type="password"
        placeholder="Create a strong password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
        error={errors.password}
        required
        disabled={isLoading}
        autoComplete="new-password"
      />

      {/* Live password strength indicator */}
      {password.length > 0 && <PasswordStrength password={password} />}

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Repeat your new password"
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

function isPasswordStrong(pwd: string): boolean {
  return (
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)
  );
}
