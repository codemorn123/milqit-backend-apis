import { Document } from 'mongoose';

export interface ICoupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue: number;
  validFrom: Date;
  validUntil: Date;
  totalUsageLimit: number;
  timesUsed: number;
  usageLimitPerUser: number;
  usedBy: string[]; // Array of user IDs
  isActive: boolean;
}

export type ICouponCreateRequest = Omit<ICoupon, 'timesUsed' | 'usedBy'>;