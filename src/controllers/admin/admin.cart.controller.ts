import { Controller, Route, Tags, Get, Delete, Query, Path, Security, Response, Middlewares } from 'tsoa';
import APIError from './../../error/api-error';
import { CartModelClass, ICart } from './../../models/CartModel';
import { CartAnalyticsResponse, CartCleanupResponse, CartDetailResponse, CartFunnelResponse, CartListResponse, toCartDTO } from './../../types/cart.types';
import { success, SuccessResponse } from './../../utils/SuccessResponse';
import { PaginatedResponse } from './../../types/common.types';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';
import { StatusCodes } from 'http-status-codes';

/**
 * Admin Cart Controller - Clean and Simple
 * Mobile optimized for grocery delivery apps
 * @author MarotiKathoke
 * @created 2025-09-13 16:44:44
 */
@Route('admin/carts')
@Tags('Admin Cart Management')
@Security('jwt', ['admin'])
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class AdminCartController extends Controller {

  /**
   * Get all carts with filters
   * @summary Retrieve carts with filtering and pagination
   */
  @Get('/')
  @Response(StatusCodes.BAD_REQUEST, 'Bad Request')
  public async getCarts(
    @Query() page: number = 1,
    @Query() limit: number = 20,
    @Query() status?: 'active' | 'checkout' | 'completed' | 'abandoned' | '',
    @Query() userId?: string,
    @Query() startDate?: string,
    @Query() endDate?: string,
    @Query() sortBy: 'createdAt' | 'totalAmount' | 'totalItems' = 'createdAt',
    @Query() sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<SuccessResponse<PaginatedResponse<ICart>>> {
    try {
      console.log(`📋 Admin fetching carts - Status: ${status}, Page: ${page} by MarotiKathoke`);

      const query: any = {};

      // Apply filters
      if (status) query.status = status;
      if (userId) query.userId = userId;

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Pagination options
      const options = {
        page: Math.max(1, page),
        limit: Math.min(100, Math.max(1, limit)),
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        populate: [
          { path: 'userId', select: 'name phone email' },
          { path: 'items.productId', select: 'name slug price images sku' },
          { path: 'deliveryAddress', select: 'address city state pincode' }
        ],
        lean: true
      };

      //   const result = await CartModelClass.paginate(query, options);
      const [docs, totalDocs] = await Promise.all([
        CartModelClass.find(query)
          //   .sort(sort)
          //   .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        CartModelClass.countDocuments(query).exec()
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalDocs / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const prevPage = hasPrevPage ? page - 1 : null;

      //   console.log(`✅ Retrieved ${carts.length} carts for admin dashboard`);

      return success({
        docs,
        totalDocs,
        limit,
        page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage
      }, 'Carts fetched successfully');

    } catch (error: any) {
      console.error('❌ Error in admin getCarts:', error);
      this.setStatus(error.statusCode || 500);
      throw new APIError(error.message || 'Failed to fetch carts', error.statusCode || 500);
    }
  }

  /**
   * Get specific cart by ID
   * @summary Retrieve detailed cart information
   */
  @Get('/{cartId}')
  @Response(StatusCodes.NOT_FOUND, 'Cart Not Found')
  @Response(StatusCodes.BAD_REQUEST, 'Invalid ID')
  @Middlewares(validateSchemaMiddleware(idParamSchema, 'params'))
  public async getCartById(@Path() cartId: string): Promise<CartDetailResponse> {
    try {
      console.log(`🔍 Admin fetching cart: ${cartId} by MarotiKathoke`);

      const cart = await CartModelClass.findById(cartId)
        .populate('userId', 'name phone email')
        .populate('items.productId', 'name slug price images sku')
        .populate('items.categoryId', 'name slug')
        .populate('deliveryAddress', 'address city state pincode')
        .lean();

      if (!cart) {
        throw new APIError('Cart not found', 404);
      }

      const cartDTO = toCartDTO(cart);

      console.log(`✅ Cart details retrieved: ${cartId}`);

      return {
        success: true,
        message: 'Cart retrieved successfully',
        data: { cart: cartDTO },
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };

    } catch (error: any) {
      console.error('❌ Error in getCartById:', error);
      this.setStatus(error.statusCode || 500);

      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to fetch cart details', 500);
    }
  }

  /**
   * Get cart analytics
   * @summary Retrieve cart analytics and statistics
   */
  @Get('/analytics/stats')
  public async getCartAnalytics(): Promise<CartAnalyticsResponse> {
    try {
      console.log(`📊 Admin fetching cart analytics by MarotiKathoke`);

      const [
        totalCarts,
        activeCarts,
        abandonedCarts,
        avgCartValue,
        topProducts
      ] = await Promise.all([
        CartModelClass.countDocuments(),
        CartModelClass.countDocuments({ status: 'active' }),
        CartModelClass.countDocuments({ status: 'abandoned' }),
        CartModelClass.aggregate([
          { $match: { totalAmount: { $gt: 0 } } },
          { $group: { _id: null, avgAmount: { $avg: '$totalAmount' } } }
        ]),
        CartModelClass.aggregate([
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.productId',
              totalQuantity: { $sum: '$items.quantity' },
              name: { $first: '$items.name' }
            }
          },
          { $sort: { totalQuantity: -1 } },
          { $limit: 10 }
        ])
      ]);

      const analytics = {
        totalCarts,
        activeCarts,
        abandonedCarts,
        completedCarts: totalCarts - activeCarts - abandonedCarts,
        abandonmentRate: totalCarts > 0 ? ((abandonedCarts / totalCarts) * 100).toFixed(2) : '0',
        averageCartValue: Number((avgCartValue[0]?.avgAmount || 0).toFixed(2)),
        topProducts: topProducts.map(p => ({
          productId: p._id?.toString() || '',
          name: p.name || 'Unknown Product',
          totalQuantity: p.totalQuantity || 0
        }))
      };

      console.log(`✅ Analytics generated - Total: ${totalCarts}, Active: ${activeCarts}`);

      return {
        success: true,
        message: 'Cart analytics retrieved successfully',
        data: { analytics },
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };

    } catch (error: any) {
      console.error('❌ Error in getCartAnalytics:', error);
      this.setStatus(500);
      throw new APIError('Failed to fetch cart analytics', 500);
    }
  }

  /**
   * Delete abandoned carts
   * @summary Clean up abandoned carts
   */
  @Delete('/cleanup/abandoned')
  public async cleanupAbandonedCarts(@Query() days: number = 7): Promise<CartCleanupResponse> {
    try {
      console.log(`🧹 Admin cleaning abandoned carts (${days} days) by MarotiKathoke`);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const result = await CartModelClass.deleteMany({
        status: 'abandoned',
        updatedAt: { $lt: cutoffDate }
      });

      const cleanupResult = {
        deletedCount: result.deletedCount || 0,
        message: `Deleted ${result.deletedCount || 0} abandoned carts older than ${days} days`
      };

      console.log(`✅ Cleanup completed - Deleted ${result.deletedCount} carts`);

      return {
        success: true,
        message: 'Abandoned carts cleaned up successfully',
        data: { result: cleanupResult },
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };

    } catch (error: any) {
      console.error('❌ Error in cleanupAbandonedCarts:', error);
      this.setStatus(500);
      throw new APIError('Failed to cleanup abandoned carts', 500);
    }
  }

  /**
   * Get cart conversion funnel
   * @summary Get conversion statistics
   */
  @Get('/analytics/funnel')
  public async getCartFunnel(): Promise<CartFunnelResponse> {
    try {
      console.log(`📈 Admin fetching conversion funnel by MarotiKathoke`);

      const funnel = await CartModelClass.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const funnelData = funnel.reduce((acc, stage) => {
        acc[stage._id] = {
          count: stage.count || 0,
          totalValue: Number((stage.totalValue || 0).toFixed(2))
        };
        return acc;
      }, {} as any);

      const totalCarts = funnel.reduce((sum, stage) => sum + (stage.count || 0), 0);

      const conversionRates = {
        activeToCheckout: funnelData.checkout ?
          ((funnelData.checkout.count / (funnelData.active?.count || 1)) * 100).toFixed(2) : '0',
        checkoutToCompleted: funnelData.completed ?
          ((funnelData.completed.count / (funnelData.checkout?.count || 1)) * 100).toFixed(2) : '0',
        overallConversion: funnelData.completed ?
          ((funnelData.completed.count / totalCarts) * 100).toFixed(2) : '0'
      };

      const funnelDTO = {
        funnelData,
        conversionRates,
        totalCarts
      };

      console.log(`✅ Funnel generated - Conversion: ${conversionRates.overallConversion}%`);

      return {
        success: true,
        message: 'Cart funnel retrieved successfully',
        data: { funnel: funnelDTO },
        timestamp: new Date().toISOString(),
        user: 'MarotiKathoke'
      };

    } catch (error: any) {
      console.error('❌ Error in getCartFunnel:', error);
      this.setStatus(500);
      throw new APIError('Failed to fetch cart funnel', 500);
    }
  }
}