export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

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


export interface IPaginated {
  page: number;
  limit: number;
  totalRecord: number;
  totalPage: number;
}

export interface IFilter {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}