import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '../../../styles/theme';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); }`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.modal};
  padding: 16px;
  animation: ${fadeIn} ${theme.transitions.base};
`;

export const ModalContainer = styled.div<{ maxWidth?: string }>`
  background: ${theme.colors.surface};
  border-radius: ${theme.radii.xl};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth ?? '480px'};
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} ${theme.transitions.base};
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${theme.colors.border};
`;

export const ModalTitle = styled.h2`
  font-size: ${theme.fontSizes.xl};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${theme.radii.md};
  border: none;
  background: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  &:hover { background: ${theme.colors.surfaceHover}; color: ${theme.colors.textPrimary}; }
  &:focus-visible { outline: 2px solid ${theme.colors.primary}; }
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 20px;
  border-top: 1px solid ${theme.colors.border};
`;
