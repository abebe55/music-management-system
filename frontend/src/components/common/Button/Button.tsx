import React from 'react';
import { StyledButton } from './Button.styles';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => (
  <StyledButton
    variant={variant}
    size={size}
    fullWidth={fullWidth}
    isLoading={isLoading}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    {...props}
  >
    {isLoading ? (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
          <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        {children}
      </span>
    ) : (
      <>
        {leftIcon}
        {children}
        {rightIcon}
      </>
    )}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </StyledButton>
);
