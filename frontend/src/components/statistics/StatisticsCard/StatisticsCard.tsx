import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import { formatNumber } from '../../../utils/formatters';

const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 20px 24px;
  box-shadow: ${theme.shadows.card};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const Label = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeights.medium};
`;

const Value = styled.span`
  font-size: ${theme.fontSizes['3xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  line-height: 1.2;
`;

const IconWrap = styled.div<{ bg?: string }>`
  width: 44px;
  height: 44px;
  border-radius: ${theme.radii.lg};
  background: ${({ bg }) => bg ?? theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface StatisticsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  label, value, icon, iconBg,
}) => (
  <Card>
    <Left>
      <Label>{label}</Label>
      <Value>{formatNumber(value)}</Value>
    </Left>
    <IconWrap bg={iconBg}>{icon}</IconWrap>
  </Card>
);
