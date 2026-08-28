import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

export const AppShell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme.colors.background};
`;

export const Sidebar = styled.nav<{ isOpen?: boolean }>`
  width: ${theme.layout.sidebarWidth};
  background: ${theme.colors.sidebarBg};
  border-right: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;

  @media (max-width: ${theme.breakpoints.md}) {
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
    transition: transform ${theme.transitions.base};
  }
`;

export const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid ${theme.colors.border};
`;

export const LogoIcon = styled.div`
  width: 34px;
  height: 34px;
  background: ${theme.colors.primary};
  border-radius: ${theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LogoTextBlock = styled.div``;
export const LogoName = styled.div`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  line-height: 1.2;
`;
export const LogoSub = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
`;

export const NavSection = styled.div`
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`;

export const NavItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: ${theme.radii.md};
  border: none;
  background: ${({ active }) => (active ? theme.colors.sidebarActive : 'transparent')};
  color: ${({ active }) => (active ? theme.colors.sidebarActiveText : theme.colors.textSecondary)};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ active }) => (active ? theme.fontWeights.semibold : theme.fontWeights.normal)};
  cursor: pointer;
  text-align: left;
  transition: all ${theme.transitions.fast};
  font-family: inherit;

  &:hover {
    background: ${({ active }) => (active ? theme.colors.sidebarActive : theme.colors.surfaceHover)};
    color: ${({ active }) => (active ? theme.colors.sidebarActiveText : theme.colors.textPrimary)};
  }

  svg { flex-shrink: 0; }
`;

export const SidebarFooter = styled.div`
  padding: 16px 12px;
  border-top: 1px solid ${theme.colors.border};
`;

export const MainArea = styled.div`
  flex: 1;
  margin-left: ${theme.layout.sidebarWidth};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    margin-left: 0;
  }
`;

export const Header = styled.header`
  height: ${theme.layout.headerHeight};
  background: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 40;
  box-shadow: ${theme.shadows.sm};
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.bold};
  cursor: pointer;
`;

export const PageContent = styled.main`
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  width: 100%;
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.textPrimary};
  padding: 4px;

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
