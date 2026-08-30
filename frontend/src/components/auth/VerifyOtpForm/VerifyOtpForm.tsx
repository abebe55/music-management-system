import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authActions } from '../../../features/auth/auth.slice';
import {
  selectAuthLoading, selectAuthError, selectForgotPasswordEmail,
} from '../../../features/auth/auth.selectors';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

// ── Styles ───────────────────────────────────────────────────────
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: 1.7;
  margin: 0;
`;

const OtpRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const OtpInput = styled.input<{ filled: boolean }>`
  width: 48px;
  height: 56px;
  border: 2px solid ${({ filled }) => (filled ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.radii.md};
  text-align: center;
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  background: ${({ filled }) => (filled ? theme.colors.primaryLight : theme.colors.white)};
  outline: none;
  transition: border-color ${theme.transitions.fast},
              background ${theme.transitions.fast},
              box-shadow ${theme.transitions.fast};
  caret-color: ${theme.colors.primary};

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResendSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const CountdownText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  margin: 0;
  text-align: center;
`;

const ResendButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  font-family: inherit;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  cursor: ${({ active }) => (active ? 'pointer' : 'default')};
  color: ${({ active }) => (active ? theme.colors.primary : theme.colors.textMuted)};
  padding: 4px 8px;
  border-radius: ${theme.radii.md};
  transition: all ${theme.transitions.fast};
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};

  &:hover {
    color: ${({ active }) => (active ? theme.colors.primaryDark : theme.colors.textMuted)};
    background: ${({ active }) => (active ? theme.colors.primaryLight : 'transparent')};
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  text-align: center;
  width: 100%;
  &:hover { text-decoration: underline; }
`;

const OTP_EXPIRY_SECONDS = 600; // 10 min — matches backend OTP_EXPIRES_MINUTES=10

interface VerifyOtpFormProps {
  onBack: () => void;
}

export const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const email = useAppSelector(selectForgotPasswordEmail);

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS);
  const [resendLoading, setResendLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const canResend = countdown === 0;

  // ── Input handlers ───────────────────────────────────────────
  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        // Clear current cell
        const next = [...digits];
        next[i] = '';
        setDigits(next);
      } else if (i > 0) {
        // Move to previous cell
        refs.current[i - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < 5) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill('');
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? '';
    setDigits(next);
    // Focus last filled cell or last cell
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) return;
    dispatch(authActions.verifyOtpRequest({ email, otp }));
  };

  // ── Resend ───────────────────────────────────────────────────
  const handleResend = useCallback(() => {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    setDigits(['', '', '', '', '', '']);
    setCountdown(OTP_EXPIRY_SECONDS);
    dispatch(authActions.clearError());
    dispatch(authActions.forgotPasswordRequest({ email }));
    setTimeout(() => setResendLoading(false), 2000);
    refs.current[0]?.focus();
  }, [canResend, resendLoading, dispatch, email]);

  const otpComplete = digits.join('').length === 6;

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <InfoText>
        We've sent a 6-digit code to<br />
        <strong>{email}</strong>
      </InfoText>

      <FormError message={error} />

      {/* OTP digit inputs */}
      <OtpRow onPaste={handlePaste}>
        {digits.map((d, i) => (
          <OtpInput
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={d}
            filled={!!d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            disabled={isLoading}
            autoComplete="one-time-code"
            aria-label={`OTP digit ${i + 1} of 6`}
          />
        ))}
      </OtpRow>

      {/* Countdown + Resend — ALWAYS visible */}
      <ResendSection>
        {countdown > 0 ? (
          <CountdownText>
            Code expires in{' '}
            <strong style={{ color: countdown < 60 ? theme.colors.danger : theme.colors.textPrimary }}>
              {formatTime(countdown)}
            </strong>
          </CountdownText>
        ) : (
          <CountdownText style={{ color: theme.colors.danger }}>
            Code has expired
          </CountdownText>
        )}

        <ResendButton
          type="button"
          active={canResend}
          onClick={handleResend}
          disabled={!canResend || resendLoading}
          aria-disabled={!canResend}
          title={canResend ? 'Click to resend code' : `Wait ${formatTime(countdown)} to resend`}
        >
          {resendLoading ? 'Sending...' : canResend ? '↺ Resend Code' : `Resend available in ${formatTime(countdown)}`}
        </ResendButton>
      </ResendSection>

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        disabled={!otpComplete || isLoading}
      >
        Verify Code
      </Button>

      <BackLink type="button" onClick={onBack}>
        ← Back to login
      </BackLink>
    </Form>
  );
};
