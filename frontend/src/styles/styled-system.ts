import styled from '@emotion/styled';
import { theme } from './theme';

// Flex helpers
export const Flex = styled.div<{
  align?: string;
  justify?: string;
  gap?: string;
  wrap?: string;
  direction?: string;
}>`
  display: flex;
  align-items: ${({ align }) => align ?? 'initial'};
  justify-content: ${({ justify }) => justify ?? 'initial'};
  gap: ${({ gap }) => gap ?? '0'};
  flex-wrap: ${({ wrap }) => wrap ?? 'initial'};
  flex-direction: ${({ direction }) => direction ?? 'row'};
`;

export const Grid = styled.div<{ cols?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols ?? 1}, 1fr);
  gap: ${({ gap }) => gap ?? theme.space[4]};
`;

export const Stack = styled.div<{ gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap ?? theme.space[4]};
`;

export const Card = styled.div<{ padding?: string }>`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  box-shadow: ${theme.shadows.card};
  padding: ${({ padding }) => padding ?? theme.space[6]};
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.border};
  margin: ${theme.space[4]} 0;
`;

export const Text = styled.span<{
  size?: keyof typeof theme.fontSizes;
  weight?: keyof typeof theme.fontWeights;
  color?: string;
  align?: string;
}>`
  font-size: ${({ size }) => (size ? theme.fontSizes[size] : 'inherit')};
  font-weight: ${({ weight }) => (weight ? theme.fontWeights[weight] : 'inherit')};
  color: ${({ color }) => color ?? 'inherit'};
  text-align: ${({ align }) => align ?? 'inherit'};
`;

export const Badge = styled.span<{ color?: string; bg?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${theme.radii.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  color: ${({ color }) => color ?? theme.colors.primary};
  background: ${({ bg }) => bg ?? theme.colors.primaryLight};
`;
