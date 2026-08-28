import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;

const Title = styled.p`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
  margin-top: 12px;
  margin-bottom: 8px;
`;

const Desc = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  max-width: 320px;
`;

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong.',
  onRetry,
}) => (
  <Wrapper>
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.colors.danger} strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <Title>Error</Title>
    <Desc>{message}</Desc>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          marginTop: 16,
          padding: '8px 20px',
          background: theme.colors.primary,
          color: '#fff',
          border: 'none',
          borderRadius: theme.radii.md,
          cursor: 'pointer',
          fontSize: theme.fontSizes.sm,
        }}
      >
        Try again
      </button>
    )}
  </Wrapper>
);
