import mongoose from 'mongoose';
import { IBase } from '../models/base';

// Enums / Types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';

// Constants
export const OrderStatuses = {
  PENDING: 'pending' as OrderStatus,
  CONFIRMED: 'confirmed' as OrderStatus,
  PROCESSING: 'processing' as OrderStatus,
  SHIPPED: 'shipped' as OrderStatus,
  DELIVERED: 'delivered' as OrderStatus,
  CANCELLED: 'cancelled' as OrderStatus,
  REFUNDED: 'refunded' as OrderStatus,
};

export const PaymentStatuses = {
  PENDING: 'pending' as PaymentStatus,
  PAID: 'paid' as PaymentStatus,
  FAILED: 'failed' as PaymentStatus,
  REFUNDED: 'refunded' as PaymentStatus,
};

export const PaymentMethods = {
  CARD: 'card' as PaymentMethod,
  UPI: 'upi' as PaymentMethod,
  NETBANKING: 'netbanking' as PaymentMethod,
  WALLET: 'wallet' as PaymentMethod,
  COD: 'cod' as PaymentMethod,
};

// Interfaces
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage?: string;
  quantity: number;
  unit: string;
  mrp: number;
  sellingPrice: number;
  totalPrice: number;
  discount: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;

  // Pricing
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;

  // Status
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  // Tracking
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;

  // Metadata
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderDocument extends IBase {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;

  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;

  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateOrderRequest {
  user: string;
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface IUpdateOrderRequest {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cancellationReason?: string;
}

export interface OrderFilterQueryParams {
  page?: number;
  limit?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  user?: string;
  orderNumber?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}