import {
  Body, Controller, Post, Get, Put, Path, Route, Tags,
  Middlewares, Response, Queries, SuccessResponse as TsoaSuccessResponse, Security, Request
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { orderService } from '../../services/order.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { PaginatedResponse, ErrorResponse } from '../../types/common.types';
import { IOrder, ICreateOrderRequest, OrderStatuses, OrderFilterQueryParams } from '../../models/order.model';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';
import APIError from '../../error/api-error';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';

import { BaseController } from '../base.controller';

/**
 * Customer Order Controller
 * Handles order placement, tracking, and cancellation for customers
 */
@Tags('Customer: Orders')
@Route('customer/orders')
@Security('jwt')
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ErrorResponse>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class CustomerOrderController extends BaseController {

  /**
   * Create a new order (Place an order)
   * @summary Place a new grocery/vegetable order
   */
  @Post('/')
  @Middlewares([jwtAuthMiddleware])
  @TsoaSuccessResponse(StatusCodes.CREATED, "Created")
  public async createOrder(
    @Request() req: any,
    @Body() data: ICreateOrderRequest
  ): Promise<SuccessResponse<IOrder>> {
    const userId = this.getUserId(req);

    // Override user from request body with authenticated user
    const orderData = {
      ...data,
      user: userId
    };

    const order = await orderService.createOrder(orderData);
    return this.sendCreated(order, 'Order placed successfully.');
  }

  /**
   * Get user's orders with pagination
   * @summary Get my orders
   */
  @Get('/')
  @Middlewares([jwtAuthMiddleware])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  public async getMyOrders(
    @Request() req: any,
    @Queries() filter: { page?: number; limit?: number; orderStatus?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Promise<SuccessResponse<PaginatedResponse<IOrder>>> {
    const userId = this.getUserId(req);

    const userFilter: any = {
      ...filter,
      user: userId
    };

    const paginatedResult = await orderService.listOrders(userFilter);
    return this.sendPaginated(paginatedResult, 'Your orders fetched successfully.');
  }

  /**
   * Get active orders (pending, confirmed, shipped)
   * @summary Get my active orders
   */
  @Get('active')
  @Middlewares([jwtAuthMiddleware])
  public async getActiveOrders(
    @Request() req: any,
    @Queries() filter: { page?: number; limit?: number }
  ): Promise<SuccessResponse<PaginatedResponse<IOrder>>> {
    const userId = this.getUserId(req);

    // Logical fix: Active orders should include all in-progress statuses
    const activeStatuses = [
      OrderStatuses.PENDING,
      OrderStatuses.CONFIRMED,
      OrderStatuses.PROCESSING,
      OrderStatuses.SHIPPED
    ];

    const paginatedResult = await orderService.listOrders({
      ...filter,
      user: userId,
      orderStatus: { $in: activeStatuses } as any // Use stricter typing if available, casting for now to match filter type compatibility
    });

    return this.sendPaginated(paginatedResult, 'Active orders fetched successfully.');
  }

  /**
   * Get order history (delivered/cancelled orders)
   * @summary Get my order history
   */
  @Get('history')
  @Middlewares([jwtAuthMiddleware])
  public async getOrderHistory(
    @Request() req: any,
    @Queries() filter: { page?: number; limit?: number }
  ): Promise<SuccessResponse<PaginatedResponse<IOrder>>> {
    const userId = this.getUserId(req);

    const historyStatuses = [
      OrderStatuses.DELIVERED,
      OrderStatuses.CANCELLED,
      OrderStatuses.REFUNDED
    ];

    const paginatedResult = await orderService.listOrders({
      ...filter,
      user: userId,
      orderStatus: { $in: historyStatuses } as any,
      sortBy: 'updatedAt', // sorting by last update makes more sense for history
      sortOrder: 'desc'
    });

    return this.sendPaginated(paginatedResult, 'Order history fetched successfully.');
  }

  /**
   * Track order status
   * @summary Track order by order number
   */
  @Get('track/{orderNumber}')
  @Middlewares([jwtAuthMiddleware])
  @Response(StatusCodes.NOT_FOUND, 'Order Not Found')
  public async trackOrder(
    @Request() req: any,
    @Path() orderNumber: string
  ): Promise<SuccessResponse<IOrder>> {
    const userId = this.getUserId(req);

    const order = await orderService.getOrderByOrderNumber(orderNumber);

    if (order.user.toString() !== userId) {
      throw new APIError('You do not have permission to track this order', StatusCodes.FORBIDDEN);
    }

    return this.sendSuccess(order, 'Order tracking information retrieved.');
  }

  /**
   * Get specific order details
   * @summary Get order details by ID
   */
  @Get('{id}')
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
  @Response(StatusCodes.NOT_FOUND, 'Order Not Found')
  @Response(StatusCodes.FORBIDDEN, 'Access Denied')
  public async getOrderById(
    @Request() req: any,
    @Path() id: string
  ): Promise<SuccessResponse<IOrder>> {
    const userId = this.getUserId(req);
    const order = await this.validateOrderOwnership(id, userId);
    return this.sendSuccess(order, 'Order details fetched successfully.');
  }

  /**
   * Cancel user's order
   * @summary Cancel my order
   */
  @Post('{id}/cancel')
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
  @Response(StatusCodes.BAD_REQUEST, 'Cannot cancel order in current state')
  public async cancelOrder(
    @Request() req: any,
    @Path() id: string,
    @Body() body: { reason: string }
  ): Promise<SuccessResponse<IOrder>> {
    const userId = this.getUserId(req);

    if (!body.reason) {
      throw new APIError('Cancellation reason is required', StatusCodes.BAD_REQUEST);
    }

    // Verify ownership before attempting cancel
    const order = await this.validateOrderOwnership(id, userId);

    // Check if order can be cancelled
    const nonCancellableStatuses = [
      OrderStatuses.DELIVERED,
      OrderStatuses.CANCELLED,
      OrderStatuses.REFUNDED,
      OrderStatuses.SHIPPED // Assuming shipped orders cannot be cancelled by user
    ];

    if (nonCancellableStatuses.includes(order.orderStatus)) {
      throw new APIError(
        `Cannot cancel order that is already ${order.orderStatus}`,
        StatusCodes.BAD_REQUEST
      );
    }

    const cancelledOrder = await orderService.cancelOrder(id, body.reason);
    return this.sendSuccess(cancelledOrder, 'Order cancelled successfully.');
  }

  /**
   * Reorder - Create a new order from a previous order
   * @summary Reorder from previous order
   */
  @Post('{id}/reorder')
  @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
  public async reorder(
    @Request() req: any,
    @Path() id: string
  ): Promise<SuccessResponse<IOrder>> {
    const userId = this.getUserId(req);
    const previousOrder = await this.validateOrderOwnership(id, userId);

    // Create new order from previous order
    const newOrderData: ICreateOrderRequest = {
      user: userId,
      items: previousOrder.items.map(item => ({
        product: item.product.toString(),
        quantity: item.quantity
      })),
      shippingAddress: previousOrder.shippingAddress,
      paymentMethod: previousOrder.paymentMethod,
      notes: 'Reordered from previous order'
    };

    const newOrder = await orderService.createOrder(newOrderData);
    return this.sendCreated(newOrder, 'Order recreated successfully.');
  }

  // --- Private Helpers ---

  /**
   * Extract authenticated user ID from request
   */
  private getUserId(req: any): string {
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }
    return userId;
  }

  /**
   * Fetch order and validate it belongs to the user
   */
  private async validateOrderOwnership(orderId: string, userId: string): Promise<IOrder> {
    const order = await orderService.getOrderById(orderId);
    if (order.user.toString() !== userId) {
      throw new APIError('You do not have permission to access this order', StatusCodes.FORBIDDEN);
    }
    return order;
  }
}