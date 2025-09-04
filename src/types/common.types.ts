export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * ErrorDetail - flexible error payload used across controllers/services.
 * - a simple string
 * - or a structured object { code, message, details? }
 *
 * Exported here so TSOA only sees one model definition.
 */
export type ErrorDetail =
  | string
  | {
      code?: string;
      message: string;
      details?: unknown;
    };


export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
  timestamp?: string;
  developer?: string;
}

export interface ApiResponseDTO<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ErrorDetail;
  timestamp?: string;
  developer?: string;
}