import { OrderModel, OrderDocument, IOrder, ICreateOrderRequest, IUpdateOrderRequest, OrderStatus, PaymentStatus, OrderStatuses, PaymentStatuses, OrderFilterQueryParams } from '../models/order.model';
import { ProductModel } from '../models/product.model';
import APIError from '../error/api-error';
import { StatusCodes } from 'http-status-codes';
import { PaginatedResponse } from '../types/pagination.types';
import { BaseService } from './base.service';
import mongoose, { FilterQuery } from 'mongoose';

class OrderService extends BaseService<OrderDocument, ICreateOrderRequest, IUpdateOrderRequest> {
  constructor() {
    super(OrderModel, ['orderNumber', 'notes']);
  }

  /**
   * Create a new order
   */
  async createOrder(data: ICreateOrderRequest): Promise<OrderDocument> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Validate and fetch product details
      const orderItems: any[] = [];
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
      const orderData = {
        user: new mongoose.Types.ObjectId(data.user),
        items: orderItems,
        shippingAddress: data.shippingAddress,
        subtotal,
        discount: totalDiscount,
        deliveryCharge,
        totalAmount,
        paymentMethod: data.paymentMethod,
        orderStatus: OrderStatuses.PENDING,
        paymentStatus: PaymentStatuses.PENDING,
        notes: data.notes,
      };

      const order = await this.model.create([orderData], { session });
      await session.commitTransaction();

      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get order by ID with population
   */
  async getOrderById(id: string): Promise<OrderDocument> {
    const order = await this.model.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images')
      .lean<OrderDocument>();

    if (!order) {
      throw new APIError('Order not found', StatusCodes.NOT_FOUND);
    }

    return order;
  }

  /**
   * Get order by order number
   */
  async getOrderByOrderNumber(orderNumber: string): Promise<OrderDocument> {
    const order = await this.model.findOne({ orderNumber })
      .populate('user', 'name email phone')
      .populate('items.product', 'name slug images')
      .lean<OrderDocument>();

    if (!order) {
      throw new APIError('Order not found', StatusCodes.NOT_FOUND);
    }

    return order;
  }

  /**
   * List orders with pagination and filters
   */
  async listOrders(query: OrderFilterQueryParams): Promise<PaginatedResponse<OrderDocument>> {
    const filter: FilterQuery<OrderDocument> = {};

    if (query.orderStatus) filter.orderStatus = query.orderStatus;
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if (query.user) filter.user = new mongoose.Types.ObjectId(query.user);
    if (query.orderNumber) filter.orderNumber = { $regex: query.orderNumber, $options: 'i' };

    if (query.startDate || query.endDate) {
      filter.createdAt = {};
      if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
      if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
    }

    const options = {
      populate: [
        { path: 'user', select: 'name email phone' },
        { path: 'items.product', select: 'name slug images' }
      ]
    };

    return this.getAll(query as any, filter, options as any);
  }

  /**
   * Update order
   */
  async updateOrder(id: string, data: IUpdateOrderRequest): Promise<OrderDocument> {
    const order = await this.model.findById(id);

    if (!order) {
      throw new APIError('Order not found', StatusCodes.NOT_FOUND);
    }

    // Validate status transitions
    if (data.orderStatus) {
      if (order.orderStatus === OrderStatuses.CANCELLED || order.orderStatus === OrderStatuses.DELIVERED) {
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
      order.orderStatus = OrderStatuses.CANCELLED;
    }

    await order.save();

    return order;
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string, reason: string): Promise<OrderDocument> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await this.model.findById(id).session(session);

      if (!order) {
        throw new APIError('Order not found', StatusCodes.NOT_FOUND);
      }

      if (order.orderStatus === OrderStatuses.CANCELLED) {
        throw new APIError('Order is already cancelled', StatusCodes.BAD_REQUEST);
      }

      if (order.orderStatus === OrderStatuses.DELIVERED) {
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

      order.orderStatus = OrderStatuses.CANCELLED;
      order.cancellationReason = reason;
      order.cancelledAt = new Date();

      await order.save({ session });
      await session.commitTransaction();

      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Delete order
   */
  async deleteOrder(id: string): Promise<{ message: string; status: number }> {
    return super.delete(id);
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string, filter: OrderFilterQueryParams): Promise<PaginatedResponse<OrderDocument>> {
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

    const stats = await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', OrderStatuses.PENDING] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', OrderStatuses.CONFIRMED] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', OrderStatuses.DELIVERED] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', OrderStatuses.CANCELLED] }, 1, 0] }
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