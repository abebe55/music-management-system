import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm/LoginForm';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectIsAuthenticated } from '../../features/auth/auth.selectors';
import { authActions } from '../../features/auth/auth.slice';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActions.clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout title="Welcome back" subtitle="Please login to your account">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
