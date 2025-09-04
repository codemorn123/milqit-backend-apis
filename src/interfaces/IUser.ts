import { ErrorDetail } from '../types/common.types';

// Response DTOs
export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  roles: string[];
  isActive: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponseDTO {
  users: UserResponseDTO[];
  pagination: {
    totalDocs: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage?: number;
    prevPage?: number;
  };
  filters: Record<string, any>;
  timestamp: string;
  developer: string;
}

export interface UserStatsDTO {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersByRole: Record<string, number>;
  recentSignups: number;
  timestamp: string;
  developer: string;
}

// Request DTOs (used by TSOA endpoints)
export interface CreateUserRequestDTO {
  email: string;
  name: string;
  phone?: string;
  password: string;
  roles?: string[];
  isActive?: boolean;
}

export interface UpdateUserRequestDTO {
  name?: string;
  phone?: string;
  roles?: string[];
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export interface BulkUpdateRequestDTO {
  userIds: string[];
  updates: {
    isActive?: boolean;
    roles?: string[];
    name?: string;
    phone?: string;
  };
}

// Reuse ErrorDetail from common.types for controller-level ApiResponse typing if needed
export interface ApiResponseDTO<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ErrorDetail;
  timestamp?: string;
  developer?: string;
}