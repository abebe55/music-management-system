import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authActions } from '../../../features/auth/auth.slice';
import { selectAuthLoading, selectAuthError } from '../../../features/auth/auth.selectors';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const Form = styled.form`display: flex; flex-direction: column; gap: 18px;`;

const SuccessBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: #d1fae5;
  border: 1px solid #6ee7b7;
  border-radius: ${theme.radii.md};
  color: #065f46;
  font-size: ${theme.fontSizes.sm};
`;

function isPasswordStrong(pwd: string): boolean {
  return (
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)
  );
}

export const ChangePasswordForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});
  const [success, setSuccess] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);

  useEffect(() => {
    if (isLoading) setWasLoading(true);
    if (wasLoading && !isLoading && !error) {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
      setWasLoading(false);
    }
  }, [isLoading, error, wasLoading]);

  const validate = () => {
    const e: typeof errors = {};
    if (!currentPassword) e.current = 'Current password is required';
    if (!newPassword) {
      e.new = 'New password is required';
    } else if (!isPasswordStrong(newPassword)) {
      e.new = 'Password must be 8+ chars with uppercase, lowercase, number and special character';
    } else if (newPassword === currentPassword) {
      e.new = 'New password must be different from current password';
    }
    if (!confirm) e.confirm = 'Please confirm your new password';
    else if (newPassword !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    if (!validate()) return;
    dispatch(authActions.changePasswordRequest({ currentPassword, newPassword }));
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {success && (
        <SuccessBox>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Password changed successfully!
        </SuccessBox>
      )}
      <FormError message={error} />

      <Input
        label="Current Password"
        type="password"
        placeholder="Enter current password"
        value={currentPassword}
        onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, current: undefined })); }}
        error={errors.current}
        required
        disabled={isLoading}
        autoComplete="current-password"
      />

      <div>
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, new: undefined })); }}
          error={errors.new}
          required
          disabled={isLoading}
          autoComplete="new-password"
        />
        {/* Live strength indicator */}
        {newPassword.length > 0 && <div style={{ marginTop: 8 }}><PasswordStrength password={newPassword} /></div>}
      </div>

      <Input
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: undefined })); }}
        error={errors.confirm}
        required
        disabled={isLoading}
        autoComplete="new-password"
      />

      <Button type="submit" isLoading={isLoading}>
        Update Password
      </Button>
    </Form>
  );
};
