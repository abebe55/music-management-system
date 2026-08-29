import React, { Component, ErrorInfo } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const Wrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
`;

const Code = styled.pre`
  margin-top: 16px;
  padding: 16px;
  background: ${theme.colors.borderLight};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.danger};
  max-width: 600px;
  overflow: auto;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
`;

const RetryBtn = styled.button`
  margin-top: 20px;
  padding: 10px 24px;
  background: ${theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${theme.radii.md};
  cursor: pointer;
  font-family: inherit;
  font-size: ${theme.fontSizes.md};
  font-weight: 500;
  &:hover { background: ${theme.colors.primaryDark}; }
`;

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in dev — visible in browser DevTools
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <Wrapper>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.colors.danger} strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2 style={{ marginTop: 12, fontSize: theme.fontSizes.xl, color: theme.colors.textPrimary }}>
            Something went wrong
          </h2>
          <p style={{ color: theme.colors.textMuted, fontSize: theme.fontSizes.sm, marginTop: 6 }}>
            An unexpected error occurred in this section.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <Code>{this.state.error.message}</Code>
          )}
          <RetryBtn onClick={this.handleRetry}>Try again</RetryBtn>
        </Wrapper>
      );
    }
    return this.props.children;
  }
}
