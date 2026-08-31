import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 8px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  margin: 0;
  white-space: nowrap;
`;

const Separator = styled.span`
  color: ${theme.colors.border};
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.normal};
`;

const Subtitle = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  white-space: nowrap;
`;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <Wrapper>
    <TitleGroup>
      <Title>{title}</Title>
      {subtitle && (
        <>
          <Separator>·</Separator>
          <Subtitle>{subtitle}</Subtitle>
        </>
      )}
    </TitleGroup>
    {action}
  </Wrapper>
);
