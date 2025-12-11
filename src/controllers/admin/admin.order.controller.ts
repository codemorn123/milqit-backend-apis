import {
    Body, Controller, Post, Get, Put, Delete, Path, Route, Tags,
    Middlewares, Response, Example, Queries, SuccessResponse as TsoaSuccessResponse, Security, Request
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { orderService, OrderFilterQueryParams } from '../../services/order.service';
import { success, SuccessResponse, NullSuccessResponse, PaginatedList } from '../../utils/SuccessResponse';
import { ErrorResponse, PaginatedResponse } from '../../types/common.types';
import { IOrder, IUpdateOrderRequest, OrderStatus } from '../../models/order.model';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';
import APIError from '../../error/api-error';
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';

/**
 * Admin Order Management Controller
 * Handles all order operations including dispatch, tracking, and status management
 */
@Tags('ADMIN: Orders')
@Route('admin/orders')
@Security('jwt')
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ErrorResponse>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class AdminOrderController extends Controller {

    /**
     * Get all orders with pagination and filters
     * @summary Get list of all orders with advanced filtering
     */
    @Get('/')
    @Middlewares([jwtAuthMiddleware])
    @TsoaSuccessResponse(StatusCodes.OK, "Success")
    @Example<OrderFilterQueryParams>({
        page: 1,
        limit: 20,
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
     * Get a single order by its ID with full details
     * @summary Get order details
     */
    @Get('{id}')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @Response(StatusCodes.NOT_FOUND, 'Order Not Found')
    public async getOrderById(@Path() id: string): Promise<SuccessResponse<IOrder>> {
        const order = await orderService.getOrderById(id);
        return success(order, 'Order fetched successfully.');
    }

    /**
     * Get order by order number
     * @summary Get order by order number
     */
    @Get('order-number/{orderNumber}')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.NOT_FOUND, 'Order Not Found')
    public async getOrderByOrderNumber(@Path() orderNumber: string): Promise<SuccessResponse<IOrder>> {
        const order = await orderService.getOrderByOrderNumber(orderNumber);
        return success(order, 'Order fetched successfully.');
    }

    /**
     * Update order status and details
     * @summary Update order (for status changes, tracking, etc.)
     */
    @Put('{id}')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @Example<IUpdateOrderRequest>({
        orderStatus: 'confirmed',
        paymentStatus: 'paid',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: new Date('2025-12-15')
    })
    public async updateOrder(
        @Path() id: string,
        @Body() data: IUpdateOrderRequest
    ): Promise<SuccessResponse<IOrder>> {
        const order = await orderService.updateOrder(id, data);
        return success(order, 'Order updated successfully.');
    }

    /**
     * Confirm an order (move from pending to confirmed)
     * @summary Confirm order
     */
    @Post('{id}/confirm')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @Response(StatusCodes.BAD_REQUEST, 'Invalid Order State')
    public async confirmOrder(
        @Path() id: string,
        @Body() body: { estimatedDelivery?: Date }
    ): Promise<SuccessResponse<IOrder>> {
        const order = await orderService.updateOrder(id, {
            orderStatus: 'confirmed',
            estimatedDelivery: body.estimatedDelivery
        });
        return success(order, 'Order confirmed successfully.');
    }

    /**
     * Dispatch an order (assign for delivery)
     * @summary Dispatch order for delivery
     */
    @Post('{id}/dispatch')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @Response(StatusCodes.BAD_REQUEST, 'Invalid Order State')
    public async dispatchOrder(
        @Path() id: string,
        @Body() body: {
            trackingNumber?: string;
            estimatedDelivery?: Date;
            deliveryPartner?: string;
        }
    ): Promise<SuccessResponse<IOrder>> {
        const order = await orderService.updateOrder(id, {
            orderStatus: 'shipped',
            trackingNumber: body.trackingNumber || `TRK${Date.now()}`,
            estimatedDelivery: body.estimatedDelivery
        });
        return success(order, 'Order dispatched successfully.');
    }

    /**
     * Mark order as out for delivery
     * @summary Mark order as out for delivery
     */
    @Post('{id}/out-for-delivery')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    public async outForDelivery(@Path() id: string): Promise<SuccessResponse<IOrder>> {
        const order = await orderService.updateOrder(id, {
            orderStatus: 'processing'
        });
        return success(order, 'Order is now out for delivery.');
    }

    /**
     * Mark order as delivered
     * @summary Mark order as delivered
     */
    @Post('{id}/deliver')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @Response(StatusCodes.BAD_REQUEST, 'Invalid Order State')
    public async deliverOrder(
        @Path() id: string,
        @Body() body: { deliveryNotes?: string }
    ): Promise<SuccessResponse<IOrder>> {
        const order = await orderService.updateOrder(id, {
            orderStatus: 'delivered'
        });
        return success(order, 'Order marked as delivered successfully.');
    }

    /**
     * Cancel an order
     * @summary Cancel order
     */
    @Post('{id}/cancel')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
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
     * Process refund for an order
     * @summary Process refund
     */
    @Post('{id}/refund')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    public async refundOrder(
        @Path() id: string,
        @Body() body: { reason: string; refundAmount?: number }
    ): Promise<SuccessResponse<IOrder>> {
        const order = await orderService.updateOrder(id, {
            orderStatus: 'refunded',
            paymentStatus: 'refunded',
            cancellationReason: body.reason
        });
        return success(order, 'Order refund processed successfully.');
    }

    /**
     * Delete an order (soft delete)
     * @summary Delete order
     */
    @Delete('{id}')
    @Middlewares([jwtAuthMiddleware, validateSchemaMiddleware(idParamSchema, "params")])
    @TsoaSuccessResponse(StatusCodes.OK, "Deleted")
    public async deleteOrder(@Path() id: string): Promise<SuccessResponse<{}>> {
        await orderService.deleteOrder(id);
        return success({}, 'Order deleted successfully.');
    }

    /**
     * Get order statistics
     * @summary Get order statistics and analytics
     */
    @Get('analytics/stats')
    @Middlewares([jwtAuthMiddleware])
    public async getOrderStats(): Promise<SuccessResponse<any>> {
        const stats = await orderService.getOrderStats();
        return success(stats, 'Order statistics fetched successfully.');
    }

    /**
     * Get orders pending dispatch
     * @summary Get orders that need to be dispatched
     */
    @Get('pending-dispatch')
    @Middlewares([jwtAuthMiddleware])
    public async getPendingDispatchOrders(
        @Queries() filter: { page?: number; limit?: number }
    ): Promise<SuccessResponse<PaginatedResponse<IOrder>>> {
        const paginatedResult = await orderService.listOrders({
            ...filter,
            orderStatus: 'confirmed',
            paymentStatus: 'paid',
            sortBy: 'createdAt',
            sortOrder: 'asc'
        });
        return success(paginatedResult, 'Pending dispatch orders fetched successfully.');
    }

    /**
     * Get active deliveries (orders currently being delivered)
     * @summary Get orders currently out for delivery
     */
    @Get('active-deliveries')
    @Middlewares([jwtAuthMiddleware])
    public async getActiveDeliveries(
        @Queries() filter: { page?: number; limit?: number }
    ): Promise<SuccessResponse<PaginatedResponse<IOrder>>> {
        const paginatedResult = await orderService.listOrders({
            ...filter,
            orderStatus: 'shipped',
            sortBy: 'estimatedDelivery',
            sortOrder: 'asc'
        });
        return success(paginatedResult, 'Active deliveries fetched successfully.');
    }

    /**
     * Bulk update order status
     * @summary Bulk update multiple orders
     */
    @Put('bulk/update-status')
    @Middlewares([jwtAuthMiddleware])
    public async bulkUpdateStatus(
        @Body() body: { orderIds: string[]; orderStatus: OrderStatus }
    ): Promise<SuccessResponse<{ updated: number }>> {
        if (!body.orderIds || body.orderIds.length === 0) {
            throw new APIError('Order IDs are required', StatusCodes.BAD_REQUEST);
        }

        const updatePromises = body.orderIds.map(id =>
            orderService.updateOrder(id, { orderStatus: body.orderStatus })
        );

        await Promise.all(updatePromises);

        return success(
            { updated: body.orderIds.length },
            `${body.orderIds.length} orders updated successfully.`
        );
    }
}
