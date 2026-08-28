import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authActions } from '../../../features/auth/auth.slice';
import { selectAuthLoading, selectAuthError } from '../../../features/auth/auth.selectors';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const Form = styled.form`display: flex; flex-direction: column; gap: 18px;`;
const BackLink = styled.button`
  background: none; border: none; color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm}; cursor: pointer; font-family: inherit;
  padding: 0; text-align: center; width: 100%;
  &:hover { text-decoration: underline; }
`;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setEmailError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Invalid email format'); return; }
    dispatch(authActions.forgotPasswordRequest({ email: email.trim() }));
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormError message={error} />
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
        error={emailError}
        required
        disabled={isLoading}
        helperText="We'll send you a 6-digit code to reset your password."
      />
      <Button type="submit" fullWidth isLoading={isLoading}>
        Send Code
      </Button>
      <BackLink type="button" onClick={onBack}>
        Remember your password? Login
      </BackLink>
    </Form>
  );
};
