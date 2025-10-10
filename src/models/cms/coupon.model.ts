import mongoose, { Schema, Document } from 'mongoose';
import { ICoupon } from './../../types/coupon.types';


export interface CouponDocument extends Document {
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

const couponSchema: Schema = new Schema<CouponDocument>({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
  maxDiscountAmount: {
    type: Number,
    required: function() {
      // This field is only required if the discount is a percentage
      return (this as any).discountType === 'percentage';
    },
  },
  minOrderValue: {
    type: Number,
    default: 0,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  totalUsageLimit: {
    type: Number,
    required: true,
    comment: 'How many times this coupon can be used in total.',
  },
  timesUsed: {
    type: Number,
    default: 0,
  },
  usageLimitPerUser: {
    type: Number,
    default: 1,
    comment: 'How many times a single user can use this coupon.',
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a 'User' model
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const CouponModel = mongoose.model<CouponDocument>('Coupon', couponSchema);

export default CouponModel;