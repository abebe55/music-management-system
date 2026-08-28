import React from 'react';
import styled from '@emotion/styled';
import { MainLayout } from '../../layouts/MainLayout/MainLayout';
import { ChangePasswordForm } from '../../components/auth/ChangePasswordForm/ChangePasswordForm';
import { useAppSelector } from '../../app/hooks';
import { selectAuthUser } from '../../features/auth/auth.selectors';
import { theme } from '../../styles/theme';

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
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  align-items: start;

  @media (max-width: ${theme.breakpoints.md}) { grid-template-columns: 1fr; }
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
`;

const ProfileRole = styled.p`
  text-align: center;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
  margin-top: 4px;
`;

const SettingsPage: React.FC = () => {
  const user = useAppSelector(selectAuthUser);
  const initials = user?.email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account preferences</PageSubtitle>
      </PageHeader>

      <Grid>
        {/* Profile info card */}
        <Card>
          <SectionTitle>Profile</SectionTitle>
          <ProfileAvatar>{initials}</ProfileAvatar>
          <ProfileEmail>{user?.email}</ProfileEmail>
          <ProfileRole>Account User</ProfileRole>
        </Card>

        {/* Change password card */}
        <Card>
          <SectionTitle>Change Password</SectionTitle>
          <ChangePasswordForm />
        </Card>
      </Grid>
    </MainLayout>
  );
};

export default SettingsPage;
