import {
  Body, Controller, Post, Get, Put, Path, Route, Tags,
  Middlewares, Response, Queries, SuccessResponse as TsoaSuccessResponse, Security, Request
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { orderService, OrderFilterQueryParams } from '../../services/order.service';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { PaginatedResponse, ErrorResponse } from '../../types/common.types';
import { IOrder, ICreateOrderRequest } from '../../models/order.model';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';
import APIError from '../../error/api-error';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';

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
export class CustomerOrderController extends Controller {

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
    // Get user ID from authenticated request
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }

    // Override user from request body with authenticated user
    const orderData = {
      ...data,
      user: userId
    };

    const order = await orderService.createOrder(orderData);
    this.setStatus(StatusCodes.CREATED);
    return success(order, 'Order placed successfully. You will receive updates via notifications.');
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
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }

    // Add user filter to only fetch authenticated user's orders
    const userFilter: any = {
      ...filter,
      user: userId
    };

    const paginatedResult = await orderService.listOrders(userFilter);
    return success(paginatedResult, 'Your orders fetched successfully.');
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
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }

    const order = await orderService.getOrderById(id);

    // Verify the order belongs to the authenticated user
    if (order.user.toString() !== userId) {
      throw new APIError('You do not have permission to view this order', StatusCodes.FORBIDDEN);
    }

    return success(order, 'Order details fetched successfully.');
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
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }

    const order = await orderService.getOrderByOrderNumber(orderNumber);

    // Verify the order belongs to the authenticated user
    if (order.user.toString() !== userId) {
      throw new APIError('You do not have permission to track this order', StatusCodes.FORBIDDEN);
    }

    return success(order, 'Order tracking information retrieved.');
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
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }

    if (!body.reason) {
      throw new APIError('Cancellation reason is required', StatusCodes.BAD_REQUEST);
    }

    const order = await orderService.getOrderById(id);

    // Verify the order belongs to the authenticated user
    if (order.user.toString() !== userId) {
      throw new APIError('You do not have permission to cancel this order', StatusCodes.FORBIDDEN);
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.orderStatus)) {
      throw new APIError(
        `Cannot cancel order that is already ${order.orderStatus}`,
        StatusCodes.BAD_REQUEST
      );
    }

    const cancelledOrder = await orderService.cancelOrder(id, body.reason);
    return success(cancelledOrder, 'Order cancelled successfully. Refund will be processed if applicable.');
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
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }

    const paginatedResult = await orderService.listOrders({
      ...filter,
      user: userId,
      orderStatus: 'pending' // You might want to filter for multiple statuses
    });

    return success(paginatedResult, 'Active orders fetched successfully.');
  }

  /**
   * Get order history (delivered orders)
   * @summary Get my order history
   */
  @Get('history')
  @Middlewares([jwtAuthMiddleware])
  public async getOrderHistory(
    @Request() req: any,
    @Queries() filter: { page?: number; limit?: number }
  ): Promise<SuccessResponse<PaginatedResponse<IOrder>>> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }

    const paginatedResult = await orderService.listOrders({
      ...filter,
      user: userId,
      orderStatus: 'delivered',
      sortBy: 'deliveredAt',
      sortOrder: 'desc'
    });

    return success(paginatedResult, 'Order history fetched successfully.');
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
    const userId = req.user?.userId;
    if (!userId) {
      throw new APIError('User not authenticated', StatusCodes.UNAUTHORIZED);
    }

    const previousOrder = await orderService.getOrderById(id);

    // Verify the order belongs to the authenticated user
    if (previousOrder.user.toString() !== userId) {
      throw new APIError('You do not have permission to reorder this order', StatusCodes.FORBIDDEN);
    }

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
    this.setStatus(StatusCodes.CREATED);
    return success(newOrder, 'Order recreated successfully.');
  }
}