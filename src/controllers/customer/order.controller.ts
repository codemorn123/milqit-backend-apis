import {
    Body, Controller, Post, Get, Put, Delete, Path, Route, Tags,
    Middlewares, Response, Example, Queries, SuccessResponse as TsoaSuccessResponse
  } from 'tsoa';
  import { StatusCodes } from 'http-status-codes';
  import { orderService, OrderFilterQueryParams } from '../../services/order.service';
  import { createOrderSchema, updateOrderSchema } from '../../validations/order.validation';
  import { success, SuccessResponse, NullSuccessResponse } from '../../utils/SuccessResponse';
  import { ErrorResponse, PaginatedResponse } from '../../types/common.types';
  import { IOrder, ICreateOrderRequest, IUpdateOrderRequest } from '../../models/order.model';
  import { validateSchemaMiddleware } from '../../middleware/common-validate';
  import { idParamSchema } from '../../constants/common.validator';
  import APIError from '../../error/api-error';
  
  @Tags('ADMIN: Orders')
  @Route('admin/orders')
  // @Security('jwt', ['admin'])
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(401, "Unauthorized")
  @Response<ErrorResponse>(403, "Forbidden")
  @Response<ErrorResponse>(404, "Not Found")
  @Response<ErrorResponse>(409, "Conflict")
  @Response<ErrorResponse>(422, "Validation Error")
  @Response<ErrorResponse>(500, "Server Error")
  export class AdminOrderController extends Controller {
    /**
     * Get all orders with pagination and filters
     * @summary Get list of all orders
     */
    @Get('/')
    @Example<OrderFilterQueryParams>({
      page: 1,
      limit: 10,
      orderStatus: 'pending',
      paymentStatus: 'paid',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    public async getAllOrders(
      @Queries() filter: OrderFilterQueryParams
    ): Promise<SuccessResponse<PaginatedResponse<IOrder>>> {
      const paginatedResult = await orderService.listOrders(filter);
      return success(paginatedResult, 'Orders fetched successfully.');
    }
  
    /**
     * Get a single order by its ID
     * @summary Get order details
     */
    @Get('{id}')
    @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
    public async getOrderById(@Path() id: string): Promise<SuccessResponse<IOrder>> {
      const order = await orderService.getOrderById(id);
      return success(order, 'Order fetched successfully.');
    }
  
    /**
     * Get order by order number
     * @summary Get order by order number
     */
    @Get('order-number/{orderNumber}')
    public async getOrderByOrderNumber(@Path() orderNumber: string): Promise<SuccessResponse<IOrder>> {
      const order = await orderService.getOrderByOrderNumber(orderNumber);
      return success(order, 'Order fetched successfully.');
    }
  
    /**
     * Update order status and details
     * @summary Update order
     */
    @Put('{id}')
    @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
    @Example<IUpdateOrderRequest>({
      orderStatus: 'confirmed',
      paymentStatus: 'paid',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: new Date('2025-10-05')
    })
    public async updateOrder(
      @Path() id: string,
      @Body() data: IUpdateOrderRequest
    ): Promise<SuccessResponse<IOrder>> {
      const order = await orderService.updateOrder(id, data);
      return success(order, 'Order updated successfully.');
    }
  
    /**
     * Cancel an order
     * @summary Cancel order
     */
    @Post('{id}/cancel')
    @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
    public async cancelOrder(
      @Path() id: string,
      @Body() body: { reason: string }
    ): Promise<SuccessResponse<IOrder>> {
      if (!body.reason) {
        throw new APIError('Cancellation reason is required', StatusCodes.BAD_REQUEST);
      }
      const order = await orderService.cancelOrder(id, body.reason);
      return success(order, 'Order cancelled successfully.');
    }
  
    /**
     * Delete an order
     * @summary Delete order
     */
    @Delete('{id}')
    @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
    @TsoaSuccessResponse(StatusCodes.NO_CONTENT, "No Content")
    public async deleteOrder(@Path() id: string): Promise<NullSuccessResponse> {
      await orderService.deleteOrder(id);
      this.setStatus(StatusCodes.NO_CONTENT);
      return success(null, 'Order deleted successfully.');
    }
  
    /**
     * Get order statistics
     * @summary Get order statistics
     */
    @Get('stats/overview')
    public async getOrderStats(): Promise<SuccessResponse<any>> {
      const stats = await orderService.getOrderStats();
      return success(stats, 'Order statistics fetched successfully.');
    }
  }
  
  @Tags('USER: Orders')
  @Route('user/orders')
  // @Security('jwt', ['user'])
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(401, "Unauthorized")
  @Response<ErrorResponse>(404, "Not Found")
  @Response<ErrorResponse>(500, "Server Error")
  export class UserOrderController extends Controller {
    /**
     * Create a new order
     * @summary Place a new order
     */
    @Post('/')
    @TsoaSuccessResponse(StatusCodes.CREATED, "Created")
    @Example<ICreateOrderRequest>({
      user: "60f7b3b3b3f1b40015c8e8a1",
      items: [
        {
          product: "60f7b3b3b3f1b40015c8e8a2",
          quantity: 2
        },
        {
          product: "60f7b3b3b3f1b40015c8e8a3",
          quantity: 1
        }
      ],
      shippingAddress: {
        fullName: "John Doe",
        phone: "+919876543210",
        addressLine1: "123, Main Street",
        addressLine2: "Near City Mall",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        landmark: "Opposite Bank"
      },
      paymentMethod: "upi",
      notes: "Please deliver between 10 AM to 2 PM"
    })
    public async createOrder(
      @Body() data: ICreateOrderRequest
    ): Promise<SuccessResponse<IOrder>> {
      const order = await orderService.createOrder(data);
      this.setStatus(StatusCodes.CREATED);
      return success(order, 'Order placed successfully.');
    }
  
    /**
     * Get user's orders
     * @summary Get my orders
     */
    @Get('/')
    public async getMyOrders(
      @Queries() filter: OrderFilterQueryParams
    ): Promise<SuccessResponse<PaginatedResponse<IOrder>>> {
      // In real implementation, get userId from authenticated user
      // For now, using filter.user
      const paginatedResult = await orderService.listOrders(filter);
      return success(paginatedResult, 'Orders fetched successfully.');
    }
  
    /**
     * Get specific order details
     * @summary Get order details
     */
    @Get('{id}')
    @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
    public async getOrderById(@Path() id: string): Promise<SuccessResponse<IOrder>> {
      const order = await orderService.getOrderById(id);
      return success(order, 'Order fetched successfully.');
    }
  
    /**
     * Cancel user's order
     * @summary Cancel my order
     */
    @Post('{id}/cancel')
    @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
    public async cancelOrder(
      @Path() id: string,
      @Body() body: { reason: string }
    ): Promise<SuccessResponse<IOrder>> {
      if (!body.reason) {
        throw new APIError('Cancellation reason is required', StatusCodes.BAD_REQUEST);
      }
      const order = await orderService.cancelOrder(id, body.reason);
      return success(order, 'Order cancelled successfully.');
    }
  }