import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
  span.required { color: ${theme.colors.danger}; margin-left: 2px; }
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input<{ hasError?: boolean; hasRightIcon?: boolean }>`
  width: 100%;
  padding: 10px 14px;
  padding-right: ${({ hasRightIcon }) => (hasRightIcon ? '42px' : '14px')};
  border: 1.5px solid ${({ hasError }) => (hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.white};
  transition: border-color ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};
  outline: none;

  &::placeholder { color: ${theme.colors.textMuted}; }

  &:focus {
    border-color: ${({ hasError }) => (hasError ? theme.colors.danger : theme.colors.primary)};
    box-shadow: 0 0 0 3px ${({ hasError }) =>
      hasError ? 'rgba(239,68,68,0.15)' : 'rgba(108,99,255,0.15)'};
  }

  &:disabled {
    background: ${theme.colors.borderLight};
    cursor: not-allowed;
    color: ${theme.colors.textMuted};
  }
`;

export const RightIconWrapper = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.textMuted};
  display: flex;
  align-items: center;
  padding: 0;
  &:hover { color: ${theme.colors.textSecondary}; }
`;

export const ErrorMessage = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.danger};
`;

export const HelperText = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
`;
