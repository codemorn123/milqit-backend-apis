import { OrderModel, IOrder, ICreateOrderRequest, IUpdateOrderRequest, OrderStatus, PaymentStatus } from '../models/order.model';
import { ProductModel } from '../models/product.model';
import APIError from '../error/api-error';
import { StatusCodes } from 'http-status-codes';
import { PaginatedResponse } from '../types/common.types';
import mongoose from 'mongoose';

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

class OrderService {
  /**
   * Create a new order
   */
  async createOrder(data: ICreateOrderRequest): Promise<IOrder> {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        // Validate and fetch product details
        const orderItems: Array<{
          product: mongoose.Types.ObjectId;
          productName: string;
          productImage?: string;
          quantity: number;
          unit: string; // Adjust this type if ValidUnit is a specific type
          mrp: number;
          sellingPrice: number;
          totalPrice: number;
          discount: number;
        }> = [];;
      let subtotal = 0;
      let totalDiscount = 0;

      for (const item of data.items) {
        const product = await ProductModel.findById(item.product).session(session);
        
        if (!product) {
          throw new APIError(`Product not found: ${item.product}`, StatusCodes.NOT_FOUND);
        }

        if (!product.isActive || !product.inStock) {
          throw new APIError(`Product is not available: ${product.name}`, StatusCodes.BAD_REQUEST);
        }

        if (product.quantity < item.quantity) {
          throw new APIError(
            `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
            StatusCodes.BAD_REQUEST
          );
        }

        const itemTotal = product.sellingPrice * item.quantity;
        const itemDiscount = (product.mrp - product.sellingPrice) * item.quantity;

        orderItems.push({
          product: product._id,
          productName: product.name,
          productImage: product.images?.[0]?.url,
          quantity: item.quantity,
          unit: product.unit,
          mrp: product.mrp,
          sellingPrice: product.sellingPrice,
          totalPrice: itemTotal,
          discount: itemDiscount,
        });

        subtotal += itemTotal;
        totalDiscount += itemDiscount;

        // Update product stock
        product.quantity -= item.quantity;
        product.inStock = product.quantity > 0;
        await product.save({ session });
      }

      // Calculate delivery charge (example logic)
      const deliveryCharge = subtotal >= 500 ? 0 : 40;
      const totalAmount = subtotal + deliveryCharge;

      // Create order
      const order = new OrderModel({
        user: data.user,
        items: orderItems,
        shippingAddress: data.shippingAddress,
        subtotal,
        discount: totalDiscount,
        deliveryCharge,
        totalAmount,
        paymentMethod: data.paymentMethod,
        orderStatus: 'pending',
        paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'pending',
        notes: data.notes,
      });

      await order.save({ session });
      await session.commitTransaction();

      return order.toJSON() as IOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<IOrder> {
    const order = await OrderModel.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images');

    if (!order) {
      throw new APIError('Order not found', StatusCodes.NOT_FOUND);
    }

    return order.toJSON() as IOrder;
  }

  /**
   * Get order by order number
   */
  async getOrderByOrderNumber(orderNumber: string): Promise<IOrder> {
    const order = await OrderModel.findOne({ orderNumber })
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images');

    if (!order) {
      throw new APIError('Order not found', StatusCodes.NOT_FOUND);
    }

    return order.toJSON() as IOrder;
  }

  /**
   * List orders with pagination and filters
   */
  async listOrders(filter: OrderFilterQueryParams): Promise<PaginatedResponse<IOrder>> {
    const {
      page = 1,
      limit = 10,
      orderStatus,
      paymentStatus,
      user,
      orderNumber,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filter || {};

    const query: any = {};

    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (user) {
      query.user = user;
    }

    if (orderNumber) {
      query.orderNumber = { $regex: orderNumber, $options: 'i' };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const options = {
      page: parseInt(page?.toString() || '1'), // Provide a default value of 1 if page is undefined
      limit: parseInt(limit.toString()),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
      populate: [
        { path: 'user', select: 'name email phone' },
        { path: 'items.product', select: 'name slug images' }
      ],
    };

    const result = await OrderModel.paginate(query, options);

    return {
        docs: result.docs.map(doc => doc.toJSON()) as IOrder[],
        totalDocs: result.totalDocs,
        limit: result.limit,
        page: result.page || 1,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.hasNextPage ? (result.page ?? 1) + 1 : null,
        prevPage: result.hasPrevPage ? (result.page ?? 1) - 1 : null



    
    };
  }

  /**
   * Update order
   */
  async updateOrder(id: string, data: IUpdateOrderRequest): Promise<IOrder> {
    const order = await OrderModel.findById(id);

    if (!order) {
      throw new APIError('Order not found', StatusCodes.NOT_FOUND);
    }

    // Validate status transitions
    if (data.orderStatus) {
      if (order.orderStatus === 'cancelled' || order.orderStatus === 'delivered') {
        throw new APIError(
          `Cannot update order in ${order.orderStatus} status`,
          StatusCodes.BAD_REQUEST
        );
      }
      order.orderStatus = data.orderStatus;
    }

    if (data.paymentStatus) {
      order.paymentStatus = data.paymentStatus;
    }

    if (data.trackingNumber) {
      order.trackingNumber = data.trackingNumber;
    }

    if (data.estimatedDelivery) {
      order.estimatedDelivery = data.estimatedDelivery;
    }

    if (data.cancellationReason) {
      order.cancellationReason = data.cancellationReason;
      order.orderStatus = 'cancelled';
    }

    await order.save();

    return order.toJSON() as IOrder;
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string, reason: string): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await OrderModel.findById(id).session(session);

      if (!order) {
        throw new APIError('Order not found', StatusCodes.NOT_FOUND);
      }

      if (order.orderStatus === 'cancelled') {
        throw new APIError('Order is already cancelled', StatusCodes.BAD_REQUEST);
      }

      if (order.orderStatus === 'delivered') {
        throw new APIError('Cannot cancel delivered order', StatusCodes.BAD_REQUEST);
      }

      // Restore product stock
      for (const item of order.items) {
        const product = await ProductModel.findById(item.product).session(session);
        if (product) {
          product.quantity += item.quantity;
          product.inStock = product.quantity > 0;
          await product.save({ session });
        }
      }

      order.orderStatus = 'cancelled';
      order.cancellationReason = reason;
      order.cancelledAt = new Date();

      await order.save({ session });
      await session.commitTransaction();

      return order.toJSON() as IOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Delete order (soft delete or hard delete based on requirements)
   */
  async deleteOrder(id: string): Promise<void> {
    const order = await OrderModel.findById(id);

    if (!order) {
      throw new APIError('Order not found', StatusCodes.NOT_FOUND);
    }

    await OrderModel.findByIdAndDelete(id);
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string, filter: OrderFilterQueryParams): Promise<PaginatedResponse<IOrder>> {
    return this.listOrders({ ...filter, user: userId });
  }

  /**
   * Get order statistics
   */
  async getOrderStats(userId?: string): Promise<any> {
    const matchStage: any = {};
    if (userId) {
      matchStage.user = new mongoose.Types.ObjectId(userId);
    }

    const stats = await OrderModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'pending'] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'confirmed'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
          },
        }
      }
    ]);

    return stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
    };
  }
}

export const orderService = new OrderService();