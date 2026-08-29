import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { Spinner } from '../components/common/Spinner/Spinner';
import { ErrorBoundary } from '../components/common/ErrorBoundary/ErrorBoundary';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPassword/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const SongsPage = lazy(() => import('../pages/Songs/SongsPage'));
const StatisticsPage = lazy(() => import('../pages/Statistics/StatisticsPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

const PageFallback: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Spinner size={40} />
  </div>
);

const AppRoutes: React.FC = () => (
  <ErrorBoundary>
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public-only routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={
            <ErrorBoundary><LoginPage /></ErrorBoundary>
          } />
          <Route path="/forgot-password" element={
            <ErrorBoundary><ForgotPasswordPage /></ErrorBoundary>
          } />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={
            <ErrorBoundary><DashboardPage /></ErrorBoundary>
          } />
          <Route path="/songs" element={
            <ErrorBoundary><SongsPage /></ErrorBoundary>
          } />
          <Route path="/statistics" element={
            <ErrorBoundary><StatisticsPage /></ErrorBoundary>
          } />
          <Route path="/settings" element={
            <ErrorBoundary><SettingsPage /></ErrorBoundary>
          } />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

export default AppRoutes;
