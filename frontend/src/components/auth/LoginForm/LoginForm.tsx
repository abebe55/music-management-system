import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authActions } from '../../../features/auth/auth.slice';
import { selectAuthLoading, selectAuthError } from '../../../features/auth/auth.selectors';
import { Input } from '../../common/Input/Input';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import { Form, ForgotLink, CheckboxRow, LinkText } from './LoginForm.styles';

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(authActions.loginRequest({ email: email.trim(), password }));
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <FormError message={error} />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
        error={errors.email}
        required
        disabled={isLoading}
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
        error={errors.password}
        required
        disabled={isLoading}
        autoComplete="current-password"
      />

      <ForgotLink>
        <CheckboxRow>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Remember me
        </CheckboxRow>
        <LinkText type="button" onClick={() => navigate('/forgot-password')}>
          Forgot password?
        </LinkText>
      </ForgotLink>

      <Button type="submit" fullWidth isLoading={isLoading}>
        Login
      </Button>
    </Form>
  );
};
