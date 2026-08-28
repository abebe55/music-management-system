import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '../../../styles/theme';

const spin = keyframes`to { transform: rotate(360deg); }`;

const SpinnerRing = styled.div<{ size?: number; color?: string }>`
  width: ${({ size }) => size ?? 32}px;
  height: ${({ size }) => size ?? 32}px;
  border: 3px solid ${theme.colors.borderLight};
  border-top-color: ${({ color }) => color ?? theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px 0;
`;

interface SpinnerProps {
  size?: number;
  color?: string;
  centered?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ size, color, centered = false }) => {
  const ring = <SpinnerRing size={size} color={color} role="status" aria-label="Loading" />;
  return centered ? <Center>{ring}</Center> : ring;
};
