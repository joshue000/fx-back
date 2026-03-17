export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const;

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetadata;
}
