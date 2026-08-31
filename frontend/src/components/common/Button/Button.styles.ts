import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  // Card background (white) with strong blue text and a thin light border
  primary: `
    background: ${theme.colors.white};
    color: #1d4ed8;
    border: 1px solid #93c5fd;
    font-weight: ${theme.fontWeights.semibold};
    &:hover:not(:disabled) {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1e40af;
    }
  `,
  secondary: `
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
    border: 1px solid #c4b5fd;
    &:hover:not(:disabled) { background: #e4deff; border-color: #a78bfa; }
  `,
  danger: `
    background: ${theme.colors.white};
    color: ${theme.colors.danger};
    border: 1px solid #fca5a5;
    font-weight: ${theme.fontWeights.semibold};
    &:hover:not(:disabled) { background: ${theme.colors.dangerLight}; border-color: #f87171; color: #dc2626; }
  `,
  ghost: `
    background: transparent;
    color: ${theme.colors.textSecondary};
    border: 1px solid transparent;
    &:hover:not(:disabled) { background: ${theme.colors.surfaceHover}; color: ${theme.colors.textPrimary}; }
  `,
  outline: `
    background: transparent;
    color: #1d4ed8;
    border: 1px solid #93c5fd;
    &:hover:not(:disabled) { background: #eff6ff; border-color: #3b82f6; }
  `,
};

const sizeStyles: Record<Size, string> = {
  sm: `padding: 6px 14px; font-size: ${theme.fontSizes.sm}; border-radius: ${theme.radii.md};`,
  md: `padding: 10px 20px; font-size: ${theme.fontSizes.md}; border-radius: ${theme.radii.md};`,
  lg: `padding: 14px 28px; font-size: ${theme.fontSizes.lg}; border-radius: ${theme.radii.lg};`,
};

export const StyledButton = styled.button<ButtonStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  white-space: nowrap;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  opacity: ${({ isLoading }) => (isLoading ? 0.7 : 1)};
  pointer-events: ${({ isLoading }) => (isLoading ? 'none' : 'auto')};

  ${({ variant = 'primary' }) => variantStyles[variant]}
  ${({ size = 'md' }) => sizeStyles[size]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;
