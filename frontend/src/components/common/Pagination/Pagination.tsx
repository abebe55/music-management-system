import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

// ── Styles ──────────────────────────────────────────────────────

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  user-select: none;
`;

const RowsPerPage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`;

const RowsSelect = styled.select`
  padding: 5px 28px 5px 10px;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textPrimary};
  background: ${theme.colors.white};
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 6px center;
  background-size: 16px;
  cursor: pointer;
  outline: none;
  transition: border-color ${theme.transitions.fast};
  &:focus { border-color: ${theme.colors.primary}; }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RangeLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
  margin-right: 4px;
`;

const NavBtn = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${theme.radii.md};
  border: 1.5px solid ${({ disabled }) => (disabled ? theme.colors.borderLight : theme.colors.border)};
  background: ${theme.colors.white};
  color: ${({ disabled }) => (disabled ? theme.colors.textMuted : theme.colors.textPrimary)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all ${theme.transitions.fast};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
    background: ${theme.colors.primaryLight};
  }
`;

const PageBtn = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: ${theme.radii.md};
  border: 1.5px solid ${({ active }) => (active ? theme.colors.primary : theme.colors.border)};
  background: ${({ active }) => (active ? theme.colors.primary : theme.colors.white)};
  color: ${({ active }) => (active ? theme.colors.white : theme.colors.textPrimary)};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ active }) => (active ? theme.fontWeights.semibold : theme.fontWeights.normal)};
  cursor: ${({ active }) => (active ? 'default' : 'pointer')};
  pointer-events: ${({ active }) => (active ? 'none' : 'auto')};
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary};
    color: ${({ active }) => (active ? theme.colors.white : theme.colors.primary)};
  }
`;

const Dots = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textMuted};
`;

// ── Page range builder ───────────────────────────────────────────
function buildPageRange(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | '...')[] = [1];
  if (page > 3) pages.push('...');
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push('...');
  pages.push(totalPages);
  return pages;
}

// ── Row size options (YouTube Studio style) ──────────────────────
const ROW_OPTIONS = [8, 10, 20, 30, 50] as const;

// ── Component ────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page, totalPages, total, limit, onPageChange, onLimitChange,
}) => {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const pages = buildPageRange(page, totalPages);

  return (
    <Bar>
      {/* Left — Rows per page selector (YouTube Studio style) */}
      <RowsPerPage>
        <span>Rows per page</span>
        <RowsSelect
          value={limit}
          onChange={(e) => {
            onLimitChange(Number(e.target.value));
          }}
          aria-label="Rows per page"
        >
          {ROW_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </RowsSelect>
      </RowsPerPage>

      {/* Right — range label + first/prev/pages/next/last */}
      <RightGroup>
        <RangeLabel>
          {start}–{end} of {total}
        </RangeLabel>

        {/* First page */}
        <NavBtn
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
          title="First page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
          </svg>
        </NavBtn>

        {/* Previous page */}
        <NavBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          title="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </NavBtn>

        {/* Page numbers */}
        {totalPages > 1 && pages.map((p, i) =>
          p === '...' ? (
            <Dots key={`dot-${i}`}>…</Dots>
          ) : (
            <PageBtn
              key={p}
              active={p === page}
              onClick={() => p !== page && onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </PageBtn>
          ),
        )}

        {/* Next page */}
        <NavBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          aria-label="Next page"
          title="Next page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </NavBtn>

        {/* Last page */}
        <NavBtn
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages || totalPages === 0}
          aria-label="Last page"
          title="Last page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
          </svg>
        </NavBtn>
      </RightGroup>
    </Bar>
  );
};
