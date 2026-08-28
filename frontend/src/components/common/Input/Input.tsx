import React, { useState } from 'react';
import {
  InputWrapper, Label, InputContainer, StyledInput,
  RightIconWrapper, ErrorMessage, HelperText,
} from './Input.styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required,
  type,
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <InputWrapper>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </Label>
      )}
      <InputContainer>
        <StyledInput
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          hasError={!!error}
          hasRightIcon={isPassword}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          required={required}
          {...props}
        />
        {isPassword && (
          <RightIconWrapper
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </RightIconWrapper>
        )}
      </InputContainer>
      {error && <ErrorMessage id={`${inputId}-error`} role="alert">{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
};
