import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectIsAuthenticated } from '../../../features/auth/auth.selectors';
import { Navigate } from 'react-router-dom';

interface ProtectedContentProps {
  children: React.ReactNode;
  fallback?: string;
}

export const ProtectedContent: React.FC<ProtectedContentProps> = ({
  children,
  fallback = '/login',
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) return <Navigate to={fallback} replace />;
  return <>{children}</>;
};
