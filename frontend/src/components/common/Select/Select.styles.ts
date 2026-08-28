import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

export const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
`;

export const StyledSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 10px 36px 10px 14px;
  border: 1.5px solid ${({ hasError }) => (hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.white};
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
  cursor: pointer;
  outline: none;
  transition: border-color ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};

  &:focus {
    border-color: ${({ hasError }) => (hasError ? theme.colors.danger : theme.colors.primary)};
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
  }

  &:disabled {
    background-color: ${theme.colors.borderLight};
    cursor: not-allowed;
    color: ${theme.colors.textMuted};
  }
`;

export const ErrorMessage = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.danger};
`;
