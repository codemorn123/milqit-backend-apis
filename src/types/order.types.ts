import { OrderStatus, PaymentStatus, PaymentMethod } from '../models/order.model';

export interface CreateOrderRequest {
  user: string;
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentMethod: PaymentMethod;
  notes?: string;
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