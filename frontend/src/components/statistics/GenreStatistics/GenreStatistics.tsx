import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import { GenreStat } from '../../../types/statistics';
import { GENRE_COLORS } from '../../../utils/constants';

const Wrapper = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 20px 24px;
  box-shadow: ${theme.shadows.card};
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const ChartArea = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const DonutWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 140px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const LegendDot = styled.div<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ color }) => color};
  flex-shrink: 0;
`;

const LegendLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  flex: 1;
`;

const LegendCount = styled.span`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.textPrimary};
`;

interface GenreStatisticsProps {
  data: GenreStat[];
}

export const GenreStatistics: React.FC<GenreStatisticsProps> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const top = data.slice(0, 6);

  // Build SVG donut segments
  const radius = 50;
  const cx = 60;
  const cy = 60;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = top.map((d, _i) => {
    const pct = total > 0 ? d.count / total : 0;
    const dashArray = pct * circumference;
    const dashOffset = circumference - cumulative * circumference;
    const color = GENRE_COLORS[d.genre] ?? '#9ca3af';
    cumulative += pct;
    return { ...d, color, dashArray, dashOffset };
  });

  return (
    <Wrapper>
      <Title>Songs by Genre</Title>
      <ChartArea>
        <DonutWrapper>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke={theme.colors.borderLight} strokeWidth={strokeWidth} />
            {segments.map((seg, _i) => (
              <circle
                key={seg.genre}
                cx={cx} cy={cy} r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.dashArray} ${circumference}`}
                strokeDashoffset={seg.dashOffset}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            ))}
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill={theme.colors.textPrimary}>{total}</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fill={theme.colors.textMuted}>Songs</text>
          </svg>
        </DonutWrapper>

        <LegendList>
          {top.map((d) => (
            <LegendItem key={d.genre}>
              <LegendDot color={GENRE_COLORS[d.genre] ?? '#9ca3af'} />
              <LegendLabel>{d.genre}</LegendLabel>
              <LegendCount>{d.count}</LegendCount>
            </LegendItem>
          ))}
        </LegendList>
      </ChartArea>
    </Wrapper>
  );
};
