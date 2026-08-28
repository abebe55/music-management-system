import { PaginationQuery, PaginatedResult } from '../types/pagination';
import { SongConstants } from '../constants/song.constants';

export interface NormalizedPagination {
  page: number;
  limit: number;
  skip: number;
  sort: string;
  order: 1 | -1;
}

export function normalizePagination(query: PaginationQuery): NormalizedPagination {
  const page = Math.max(1, parseInt(String(query.page ?? 1), 10));
  const limit = Math.min(
    SongConstants.MAX_PAGE_SIZE,
    Math.max(1, parseInt(String(query.limit ?? SongConstants.DEFAULT_PAGE_SIZE), 10)),
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort: query.sort ?? 'createdAt',
    order: query.order === 'asc' ? 1 : -1,
  };
}

export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
