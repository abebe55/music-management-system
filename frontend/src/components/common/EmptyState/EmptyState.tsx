import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
  color: ${theme.colors.textSecondary};
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Title = styled.p`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  max-width: 320px;
`;

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No songs found',
  description = 'Try adjusting your filters or add a new song.',
  icon,
  action,
}) => (
  <Wrapper>
    <Icon>{icon ?? '🎵'}</Icon>
    <Title>{title}</Title>
    <Description>{description}</Description>
    {action && <div style={{ marginTop: 20 }}>{action}</div>}
  </Wrapper>
);
