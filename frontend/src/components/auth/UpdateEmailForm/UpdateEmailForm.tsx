import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authActions } from '../../../features/auth/auth.slice';
import { selectAuthLoading, selectAuthError, selectAuthUser } from '../../../features/auth/auth.selectors';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
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

const CurrentEmail = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  padding: 10px 14px;
  background: ${theme.colors.borderLight};
  border-radius: ${theme.radii.md};
  border: 1.5px solid ${theme.colors.border};
`;

export const UpdateEmailForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const user = useAppSelector(selectAuthUser);

  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [success, setSuccess] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);

  useEffect(() => {
    if (isLoading) setWasLoading(true);
    if (wasLoading && !isLoading && !error) {
      setSuccess(true);
      setNewEmail('');
      setPassword('');
      setWasLoading(false);
    }
  }, [isLoading, error, wasLoading]);

  const validate = () => {
    const e: typeof errors = {};
    if (!newEmail.trim()) e.email = 'New email is required';
    else if (!/\S+@\S+\.\S+/.test(newEmail)) e.email = 'Invalid email format';
    else if (newEmail.toLowerCase() === user?.email?.toLowerCase())
      e.email = 'New email must be different from current email';
    if (!password) e.password = 'Password is required to confirm change';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    dispatch(authActions.clearError());
    if (!validate()) return;
    dispatch(authActions.updateEmailRequest({ newEmail: newEmail.trim(), password }));
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      {success && (
        <SuccessBox>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Email updated successfully!
        </SuccessBox>
      )}

      <FormError message={error} />

      <div>
        <label style={{ fontSize: theme.fontSizes.sm, fontWeight: 500, color: theme.colors.textPrimary, display: 'block', marginBottom: 6 }}>
          Current Email
        </label>
        <CurrentEmail>{user?.email}</CurrentEmail>
      </div>

      <Input
        label="New Email Address"
        type="email"
        placeholder="Enter new email address"
        value={newEmail}
        onChange={(e) => {
          setNewEmail(e.target.value);
          setErrors((p) => ({ ...p, email: undefined }));
        }}
        error={errors.email}
        required
        disabled={isLoading}
        autoComplete="email"
      />

      <Input
        label="Confirm with Password"
        type="password"
        placeholder="Enter your current password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors((p) => ({ ...p, password: undefined }));
        }}
        error={errors.password}
        required
        disabled={isLoading}
        autoComplete="current-password"
      />

      <Button type="submit" isLoading={isLoading}>
        Update Email
      </Button>
    </Form>
  );
};
