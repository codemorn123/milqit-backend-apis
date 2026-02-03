import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ICouponDocument } from './../../types/coupon.types';
import { createSchemaOptions } from '../../utils/schema.helpers';

const couponSchema: Schema = new Schema<ICouponDocument>({
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
    required: function () {
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
}, createSchemaOptions());

couponSchema.plugin(mongoosePaginate);

const CouponModel = mongoose.model<ICouponDocument, mongoose.PaginateModel<ICouponDocument>>('Coupon', couponSchema);

export default CouponModel;