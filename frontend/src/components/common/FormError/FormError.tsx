import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const ErrorBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  background: ${theme.colors.dangerLight};
  border: 1px solid #fca5a5;
  border-radius: ${theme.radii.md};
  color: #991b1b;
  font-size: ${theme.fontSizes.sm};
`;

interface FormErrorProps {
  message?: string | null;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <ErrorBox role="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {message}
    </ErrorBox>
  );
};
