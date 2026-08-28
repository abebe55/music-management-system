import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background};
  text-align: center;
  padding: 24px;
  gap: 16px;
`;

const Code = styled.h1`
  font-size: 96px;
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  opacity: 0.3;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: ${theme.fontSizes['2xl']};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
`;

const Desc = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textMuted};
  max-width: 400px;
`;

const HomeBtn = styled.button`
  padding: 12px 28px;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  font-family: inherit;
  transition: background ${theme.transitions.fast};
  margin-top: 8px;

  &:hover { background: ${theme.colors.primaryDark}; }
`;

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Code>404</Code>
      <Title>Page not found</Title>
      <Desc>The page you're looking for doesn't exist or has been moved.</Desc>
      <HomeBtn onClick={() => navigate('/dashboard')}>Back to Dashboard</HomeBtn>
    </Wrapper>
  );
};

export default NotFoundPage;
