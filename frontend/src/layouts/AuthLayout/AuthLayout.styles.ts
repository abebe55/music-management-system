import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

export const AuthPageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0eeff 0%, #e8f4fd 100%);
  padding: 24px 16px;
`;

export const AuthCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.xl};
  box-shadow: ${theme.shadows.xl};
  padding: 40px 40px;
  width: 100%;
  max-width: 420px;
`;

export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  justify-content: center;
`;

export const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${theme.colors.primary};
  border-radius: ${theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoText = styled.span`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
`;

export const CardTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: 4px;
  text-align: center;
`;

export const CardSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  text-align: center;
  margin-bottom: 28px;
`;

export const Footer = styled.p`
  margin-top: 28px;
  text-align: center;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
`;
