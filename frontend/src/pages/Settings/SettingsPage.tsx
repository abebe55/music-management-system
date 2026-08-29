import React from 'react';
import styled from '@emotion/styled';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { ChangePasswordForm } from '../../components/auth/ChangePasswordForm/ChangePasswordForm';
import { UpdateEmailForm } from '../../components/auth/UpdateEmailForm/UpdateEmailForm';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAuthUser } from '../../features/auth/auth.selectors';
import { authActions } from '../../features/auth/auth.slice';
import { theme } from '../../styles/theme';
import { useEffect } from 'react';

const PageHeader = styled.div`
  margin-bottom: 28px;
`;

const PageTitle = styled.h1`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.textPrimary};
`;

const PageSubtitle = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
  margin-top: 4px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 24px;
  box-shadow: ${theme.shadows.card};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ProfileAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.bold};
  margin: 0 auto 16px;
`;

const ProfileEmail = styled.p`
  text-align: center;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  font-weight: ${theme.fontWeights.medium};
  word-break: break-all;
`;

const ProfileRole = styled.p`
  text-align: center;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
  margin-top: 4px;
`;

const ProfileInfo = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${theme.colors.borderLight};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.sm};
`;

const InfoLabel = styled.span`
  color: ${theme.colors.textMuted};
  font-weight: ${theme.fontWeights.medium};
`;

const InfoValue = styled.span`
  color: ${theme.colors.textPrimary};
  font-weight: ${theme.fontWeights.medium};
  word-break: break-all;
  text-align: right;
  max-width: 60%;
`;

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';

  // Clear any leftover auth errors when landing on settings
  useEffect(() => {
    dispatch(authActions.clearError());
  }, [dispatch]);

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account preferences</PageSubtitle>
      </PageHeader>

      <Grid>
        {/* Left — profile summary */}
        <Card>
          <SectionTitle>Profile</SectionTitle>
          <ProfileAvatar>{initials}</ProfileAvatar>
          <ProfileEmail>{user?.email}</ProfileEmail>
          <ProfileRole>Account User</ProfileRole>

          <ProfileInfo>
            <InfoRow>
              <InfoLabel>User ID</InfoLabel>
              <InfoValue style={{ fontSize: theme.fontSizes.xs, color: theme.colors.textMuted }}>
                {user?.id?.slice(0, 16)}…
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Status</InfoLabel>
              <InfoValue style={{ color: theme.colors.success, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.success, display: 'inline-block' }} />
                Active
              </InfoValue>
            </InfoRow>
          </ProfileInfo>
        </Card>

        {/* Right — forms */}
        <RightColumn>
          {/* Update email */}
          <Card>
            <SectionTitle>Update Email Address</SectionTitle>
            <UpdateEmailForm />
          </Card>

          {/* Change password */}
          <Card>
            <SectionTitle>Change Password</SectionTitle>
            <ChangePasswordForm />
          </Card>
        </RightColumn>
      </Grid>
    </MainLayout>
  );
};

export default SettingsPage;
