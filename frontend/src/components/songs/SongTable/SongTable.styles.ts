import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: ${theme.radii.lg};
  border: 1px solid ${theme.colors.border};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.fontSizes.sm};
`;

export const THead = styled.thead`
  background: ${theme.colors.borderLight};
`;

export const TBody = styled.tbody`
  tr:last-child td { border-bottom: none; }
`;

export const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: ${theme.fontWeights.semibold};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.textPrimary};
  vertical-align: middle;
`;

export const Tr = styled.tr`
  transition: background ${theme.transitions.fast};
  &:hover { background: ${theme.colors.borderLight}; }
`;

export const NumberCell = styled(Td)`
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSizes.xs};
  width: 40px;
`;

export const ActionCell = styled(Td)`
  white-space: nowrap;
  width: 100px;
`;

export const ActionButton = styled.button<{ danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: ${theme.radii.md};
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ danger }) => (danger ? theme.colors.danger : theme.colors.textMuted)};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${({ danger }) =>
      danger ? theme.colors.dangerLight : theme.colors.primaryLight};
    color: ${({ danger }) =>
      danger ? theme.colors.danger : theme.colors.primary};
  }

  &:focus-visible { outline: 2px solid ${theme.colors.primary}; outline-offset: 1px; }
`;

export const GenreBadge = styled.span<{ bg?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: ${theme.radii.full};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.medium};
  background: ${({ bg }) => bg ?? theme.colors.primaryLight};
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
`;

export const DateText = styled.span`
  color: ${theme.colors.textMuted};
  font-size: ${theme.fontSizes.xs};
`;
