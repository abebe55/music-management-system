import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Info = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.radii.md};
  border: 1.5px solid ${({ active }) => (active ? theme.colors.primary : theme.colors.border)};
  background: ${({ active }) => (active ? theme.colors.primary : theme.colors.white)};
  color: ${({ active }) => (active ? theme.colors.white : theme.colors.textPrimary)};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ active }) => (active ? theme.fontWeights.semibold : theme.fontWeights.normal)};
  cursor: ${({ active }) => (active ? 'default' : 'pointer')};
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not([disabled]):not([data-active]) {
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page, totalPages, total, limit, onPageChange,
}) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Build page range around current page
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <PaginationWrapper>
      <Info>Showing {start}–{end} of {total} songs</Info>
      <Controls>
        <PageButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          ‹
        </PageButton>
        {getPages().map((p, i) =>
          p === '...' ? (
            <PageButton key={`dot-${i}`} disabled style={{ border: 'none', cursor: 'default' }}>…</PageButton>
          ) : (
            <PageButton
              key={p}
              active={p === page}
              data-active={p === page || undefined}
              onClick={() => p !== page && onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </PageButton>
          ),
        )}
        <PageButton
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          ›
        </PageButton>
      </Controls>
    </PaginationWrapper>
  );
};
