import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const ForgotLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
`;

export const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    accent-color: ${theme.colors.primary};
    cursor: pointer;
  }
`;

export const LinkText = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  font-family: inherit;
  padding: 0;

  &:hover { text-decoration: underline; }
`;
