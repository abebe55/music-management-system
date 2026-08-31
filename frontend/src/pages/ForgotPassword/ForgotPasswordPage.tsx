import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectForgotPasswordStep, selectForgotPasswordResetToken } from '../../features/auth/auth.selectors';
import { authActions } from '../../features/auth/auth.slice';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm/ForgotPasswordForm';
import { VerifyOtpForm } from '../../components/auth/VerifyOtpForm/VerifyOtpForm';
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm/ResetPasswordForm';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const SuccessBox = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const GreenCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TITLES: Record<string, { title: string; subtitle: string }> = {
  email: { title: 'Forgot Password', subtitle: "Enter your email and we'll send you a 6-digit code" },
  otp:   { title: 'Verify Code',     subtitle: 'Enter the 6-digit code we sent you' },
  reset: { title: 'New Password',    subtitle: 'Choose a strong new password' },
  done:  { title: 'Password Reset!', subtitle: '' },
};

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const step = useAppSelector(selectForgotPasswordStep);
  // OTP is stored in Redux after successful verify — no local state needed
  const verifiedOtp = useAppSelector(selectForgotPasswordResetToken);

  const { title, subtitle } = TITLES[step] ?? TITLES.email;

  useEffect(() => {
    dispatch(authActions.clearError());
    return () => { dispatch(authActions.resetForgotPasswordFlow()); };
  }, [dispatch]);

  const handleBack = () => navigate('/login');

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {step === 'email' && <ForgotPasswordForm onBack={handleBack} />}
      {step === 'otp'   && <VerifyOtpForm onBack={handleBack} />}
      {step === 'reset' && <ResetPasswordForm resetToken={verifiedOtp} />}
      {step === 'done'  && (
        <SuccessBox>
          <GreenCircle>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </GreenCircle>
          <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm, textAlign: 'center', lineHeight: 1.6 }}>
            Your password has been reset successfully.<br />
            You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: theme.colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: theme.radii.md,
              padding: '10px 28px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: theme.fontSizes.md,
              fontWeight: 600,
            }}
          >
            Back to Login
          </button>
        </SuccessBox>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
