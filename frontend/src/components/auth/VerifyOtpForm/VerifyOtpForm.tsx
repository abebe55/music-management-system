import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authActions } from '../../../features/auth/auth.slice';
import {
  selectAuthLoading, selectAuthError, selectForgotPasswordEmail,
} from '../../../features/auth/auth.selectors';
import { Button } from '../../common/Button/Button';
import { FormError } from '../../common/FormError/FormError';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const Form = styled.form`display: flex; flex-direction: column; gap: 20px;`;

const OtpRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const OtpInput = styled.input`
  width: 48px;
  height: 56px;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  text-align: center;
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  outline: none;
  transition: border-color ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
  }
`;

const InfoText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: 1.6;
`;

const BackLink = styled.button`
  background: none; border: none; color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm}; cursor: pointer; font-family: inherit;
  padding: 0; text-align: center; width: 100%;
  &:hover { text-decoration: underline; }
`;

const ResendRow = styled.div`
  text-align: center;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
`;

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
  const [countdown, setCountdown] = useState(299); // 4:59

  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? '';
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) return;
    dispatch(authActions.verifyOtpRequest({ email, otp }));
  };

  const handleResend = () => {
    setCountdown(299);
    setDigits(['', '', '', '', '', '']);
    dispatch(authActions.forgotPasswordRequest({ email }));
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <InfoText>
        We've sent a 6-digit code to<br />
        <strong>{email}</strong>
      </InfoText>

      <FormError message={error} />

      <OtpRow onPaste={handlePaste}>
        {digits.map((d, i) => (
          <OtpInput
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={isLoading}
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </OtpRow>

      <ResendRow>
        {countdown > 0 ? (
          <>Code expires in <strong>{formatTime(countdown)}</strong></>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            style={{ background: 'none', border: 'none', color: theme.colors.primary, cursor: 'pointer', fontFamily: 'inherit', fontSize: theme.fontSizes.sm }}
          >
            Resend Code
          </button>
        )}
      </ResendRow>

      <Button type="submit" fullWidth isLoading={isLoading} disabled={digits.join('').length !== 6}>
        Verify Code
      </Button>
      <BackLink type="button" onClick={onBack}>
        Back to login
      </BackLink>
    </Form>
  );
};
