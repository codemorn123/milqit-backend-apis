import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { createSchemaOptions } from '../utils/schema.helpers';

export type RefundStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'failed';

export interface IRefund {
  _id: string | mongoose.Types.ObjectId;
  orderId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  amount: number;
  reason: string;
  description?: string;
  status: RefundStatus;
  images?: string[];

  // Payment Gateway Details
  paymentGateway?: string; // e.g., 'razorpay'
  gatewayTransactionId?: string; // Original Payment ID
  gatewayRefundId?: string; // Refund ID from Gateway

  // Admin/System fields
  adminNotes?: string;
  processedBy?: string | mongoose.Types.ObjectId;
  processedAt?: Date;
  failureReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface RefundDocument extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  reason: string;
  description?: string;
  status: RefundStatus;
  images?: string[];

  paymentGateway?: string;
  gatewayTransactionId?: string;
  gatewayRefundId?: string;

  adminNotes?: string;
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  failureReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema<RefundDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'rejected', 'failed'],
      default: 'pending',
      index: true
    },
    images: [{
      type: String
    }],

    paymentGateway: {
      type: String
    },
    gatewayTransactionId: {
      type: String
    },
    gatewayRefundId: {
      type: String
    },

    adminNotes: {
      type: String
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    processedAt: {
      type: Date
    },
    failureReason: {
      type: String
    }
  },
  createSchemaOptions()
);

RefundSchema.plugin(mongoosePaginate);

export const RefundModel = mongoose.model<RefundDocument, PaginateModel<RefundDocument>>('Refund', RefundSchema);
export default RefundModel;