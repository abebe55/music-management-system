import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { ChangePasswordForm } from '../../components/auth/ChangePasswordForm/ChangePasswordForm';
import { UpdateEmailForm } from '../../components/auth/UpdateEmailForm/UpdateEmailForm';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAuthUser } from '../../features/auth/auth.selectors';
import { authActions } from '../../features/auth/auth.slice';
import { theme } from '../../styles/theme';

// ── All 3 cards in one row, tighter gap ───────────────────────
const ThreeColGrid = styled.div`
  display: grid;
  grid-template-columns: 170px 1fr 1fr;
  gap: 12px;
  align-items: start;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    & > :first-child { grid-column: 1 / -1; }
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    & > :first-child { grid-column: auto; }
  }
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 16px;
  box-shadow: ${theme.shadows.card};
  height: fit-content;
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ProfileAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${theme.colors.borderLight};  /* neutral grey — no blue */
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  margin: 0 auto 8px;
  border: 2px solid ${theme.colors.border};
`;

const ProfileEmail = styled.p`
  text-align: center;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeights.medium};
  word-break: break-all;
  line-height: 1.4;
`;

const ProfileRole = styled.p`
  text-align: center;
  font-size: 11px;
  color: ${theme.colors.textMuted};
  margin-top: 2px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: ${theme.colors.borderLight};
  border-radius: ${theme.radii.sm};
  font-size: 11px;
  margin-top: 6px;
`;

const InfoLabel = styled.span`
  color: ${theme.colors.textMuted};
  font-weight: ${theme.fontWeights.medium};
  flex-shrink: 0;
  margin-right: 4px;
`;

const InfoValue = styled.span`
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeights.medium};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80px;
`;

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';

  useEffect(() => {
    dispatch(authActions.clearError());
  }, [dispatch]);

  return (
    <MainLayout>
      {/* Title + subtitle are now in the header bar — no extra header here */}
      <ThreeColGrid>
        {/* 1 — Profile */}
        <Card>
          <SectionTitle>Profile</SectionTitle>
          <ProfileAvatar>{initials}</ProfileAvatar>
          <ProfileEmail>{user?.email}</ProfileEmail>
          <ProfileRole>Account User</ProfileRole>
          <InfoRow>
            <InfoLabel>Status</InfoLabel>
            <InfoValue style={{ color: theme.colors.success, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.colors.success, display: 'inline-block', flexShrink: 0 }} />
              Active
            </InfoValue>
          </InfoRow>
        </Card>

        {/* 2 — Update email */}
        <Card>
          <SectionTitle>Update Email</SectionTitle>
          <UpdateEmailForm />
        </Card>

        {/* 3 — Change password */}
        <Card>
          <SectionTitle>Change Password</SectionTitle>
          <ChangePasswordForm />
        </Card>
      </ThreeColGrid>
    </MainLayout>
  );
};

export default SettingsPage;
