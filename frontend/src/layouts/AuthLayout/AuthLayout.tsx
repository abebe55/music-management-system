import React from 'react';
import {
  AuthPageWrapper, AuthCard, LogoRow, LogoIcon, LogoText,
  CardTitle, CardSubtitle, Footer,
} from './AuthLayout.styles';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => (
  <AuthPageWrapper>
    <AuthCard>
      <LogoRow>
        <LogoIcon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        </LogoIcon>
        <LogoText>MusicFlow</LogoText>
      </LogoRow>
      <CardTitle>{title}</CardTitle>
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      {children}
      <Footer>© {new Date().getFullYear()} MusicFlow. All rights reserved.</Footer>
    </AuthCard>
  </AuthPageWrapper>
);
