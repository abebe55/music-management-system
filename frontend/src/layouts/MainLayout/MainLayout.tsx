import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { authActions } from '../../features/auth/auth.slice';
import { selectAuthUser } from '../../features/auth/auth.selectors';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import {
  AppShell, Sidebar, SidebarLogo, LogoIcon, LogoTextBlock, LogoName, LogoSub,
  NavSection, NavItem, SidebarFooter, MainArea, Header, HeaderLeft, HeaderRight,
  UserAvatar, PageContent, MobileMenuButton,
} from './MainLayout.styles';

// ── Header title area ─────────────────────────────────────────
const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  margin-left: 12px;
`;

const HeaderTitle = styled.h1`
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
  margin: 0;
  white-space: nowrap;
`;

const HeaderDot = styled.span`
  color: ${theme.colors.border};
  font-size: ${theme.fontSizes.md};
  flex-shrink: 0;
`;

const HeaderSubtitle = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

// ── Nav items ─────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    subtitle: 'Overview of your music library',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    path: '/songs',
    label: 'Songs',
    subtitle: 'Manage your songs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    path: '/statistics',
    label: 'Statistics',
    subtitle: 'Insights about your music library',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    path: '/settings',
    label: 'Settings',
    subtitle: 'Manage your account preferences',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────
interface MainLayoutProps {
  children: React.ReactNode;
  /** Optional action element shown in the header right side (e.g. "Add Song" button) */
  headerAction?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, headerAction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(authActions.logoutRequest());
    navigate('/login');
  };

  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';

  // Determine current page title + subtitle from route
  const currentNav = NAV_ITEMS.find((item) => location.pathname.startsWith(item.path));

  return (
    <AppShell>
      <Sidebar isOpen={sidebarOpen} aria-label="Main navigation">
        <SidebarLogo>
          <LogoIcon>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </LogoIcon>
          <LogoTextBlock>
            <LogoName>MusicFlow</LogoName>
            <LogoSub>Music Management</LogoSub>
          </LogoTextBlock>
        </SidebarLogo>

        <NavSection>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.path}
              active={location.pathname.startsWith(item.path)}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              aria-current={location.pathname.startsWith(item.path) ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </NavItem>
          ))}
        </NavSection>

        <SidebarFooter>
          <NavItem onClick={handleLogout} style={{ color: '#ef4444' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </NavItem>
        </SidebarFooter>
      </Sidebar>

      <MainArea>
        <Header>
          <HeaderLeft>
            <MobileMenuButton
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </MobileMenuButton>

            {/* Page title + subtitle live in the header bar */}
            {currentNav && (
              <HeaderTitleGroup>
                <HeaderTitle>{currentNav.label}</HeaderTitle>
                <HeaderDot>·</HeaderDot>
                <HeaderSubtitle>{currentNav.subtitle}</HeaderSubtitle>
              </HeaderTitleGroup>
            )}
          </HeaderLeft>

          <HeaderRight>
            {/* Page-level action (e.g. "+ Add Song") */}
            {headerAction}

            <UserAvatar
              title={user?.email ?? 'Profile'}
              onClick={() => navigate('/settings')}
              aria-label="User profile"
            >
              {initials}
            </UserAvatar>
          </HeaderRight>
        </Header>

        <PageContent>{children}</PageContent>
      </MainArea>
    </AppShell>
  );
};
