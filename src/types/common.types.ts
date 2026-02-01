export * from './pagination.types';
import { PaginationQuery } from './pagination.types';

export interface ErrorDetail {
  code?: string;
  message: string;
  details?: unknown;
}

export type ErrorDetailType = string | ErrorDetail;


export interface ErrorResponse {
  success: boolean;
  error: string;
  code?: string;
  details?: Record<string, any>;
}

// Consolidate generic filter interface
// Omit 'populate' and 'select' to avoid TSOA union type errors and prevent security risks 
// (clients shouldn't control population/selection directly in most cases)
export interface IFilter extends Omit<PaginationQuery, 'populate' | 'select'> {
  isActive?: boolean;
}

export interface IRefundFilter extends IFilter {
  status?: 'pending' | 'processing' | 'completed' | 'rejected' | 'failed';
  orderId?: string;
  userId?: string;
}

export interface IProductFilter extends IFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  unit?: 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen';
}



export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web' | 'other';
  version: string;
  deviceId: string;
  appVersion?: string;
  fcmToken?: string;
}





export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}


export interface IcommonImage {
  url: string;
  key: string;
}