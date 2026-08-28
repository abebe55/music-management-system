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
  primary: `
    background: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: 2px solid ${theme.colors.primary};
    &:hover:not(:disabled) { background: ${theme.colors.primaryDark}; border-color: ${theme.colors.primaryDark}; }
  `,
  secondary: `
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primaryLight};
    &:hover:not(:disabled) { background: #e4deff; border-color: #e4deff; }
  `,
  danger: `
    background: ${theme.colors.danger};
    color: ${theme.colors.white};
    border: 2px solid ${theme.colors.danger};
    &:hover:not(:disabled) { background: #dc2626; border-color: #dc2626; }
  `,
  ghost: `
    background: transparent;
    color: ${theme.colors.textSecondary};
    border: 2px solid transparent;
    &:hover:not(:disabled) { background: ${theme.colors.surfaceHover}; color: ${theme.colors.textPrimary}; }
  `,
  outline: `
    background: transparent;
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};
    &:hover:not(:disabled) { background: ${theme.colors.primaryLight}; }
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
