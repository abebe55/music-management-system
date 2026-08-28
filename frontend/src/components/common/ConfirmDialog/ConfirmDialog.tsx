import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 8px 0;
`;

const IconWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${theme.colors.dangerLight};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textPrimary};
`;

const Message = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  max-width: 320px;
`;

const Note = styled.p`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textMuted};
`;

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  itemName?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Song',
  message,
  confirmLabel = 'Delete',
  isLoading = false,
  itemName,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title=""
    maxWidth="400px"
    footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <Body>
      <IconWrap>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={theme.colors.danger} strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </IconWrap>
      <Title>{title}</Title>
      <Message>
        {message ?? (
          <>
            Are you sure you want to delete{' '}
            {itemName ? <strong>"{itemName}"</strong> : 'this item'}?
          </>
        )}
      </Message>
      <Note>This action cannot be undone.</Note>
    </Body>
  </Modal>
);
