import { Document } from 'mongoose';

export interface IRefund  {
  orderId: string;
  userId: string;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  adminNotes?: string;
  paymentGateway: string;
  gatewayTransactionId: string; // Original Payment ID
  gatewayRefundId?: string; // Refund ID from Razorpay
  failureReason?: string;
}