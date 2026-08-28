import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { Spinner } from '../components/common/Spinner/Spinner';

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPassword/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const SongsPage = lazy(() => import('../pages/Songs/SongsPage'));
const StatisticsPage = lazy(() => import('../pages/Statistics/StatisticsPage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

const PageFallback: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Spinner size={40} />
  </div>
);

const AppRoutes: React.FC = () => (
  <Suspense fallback={<PageFallback />}>
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public-only routes (redirect to dashboard if logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/songs" element={<SongsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
