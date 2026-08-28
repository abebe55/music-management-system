import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

export const FiltersWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 180px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.textMuted};
    pointer-events: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 9px 14px 9px 38px;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.white};
  outline: none;
  transition: border-color ${theme.transitions.fast};

  &::placeholder { color: ${theme.colors.textMuted}; }
  &:focus { border-color: ${theme.colors.primary}; box-shadow: 0 0 0 3px rgba(108,99,255,0.12); }
`;

export const FilterSelect = styled.select`
  padding: 9px 32px 9px 12px;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.white};
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 18px;
  cursor: pointer;
  outline: none;
  min-width: 120px;
  transition: border-color ${theme.transitions.fast};

  &:focus { border-color: ${theme.colors.primary}; box-shadow: 0 0 0 3px rgba(108,99,255,0.12); }
`;

export const ClearButton = styled.button`
  padding: 9px 14px;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  background: ${theme.colors.white};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  white-space: nowrap;
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }
`;
