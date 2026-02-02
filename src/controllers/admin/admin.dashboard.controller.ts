import {
    Route,
    Tags,
    Controller,
    Get,
    Query,
    Security,
    Response,
    Middlewares,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../../utils/SuccessResponse';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { OrderModel } from '../../models/order.model';
import { UserModel } from '../../models/UserModel';
import { ProductModel } from '../../models/product.model';
import cloudinaryImageService from '../../services/cloudinary-image.service';

interface DashboardStats {
    totalRevenue: {
        current: number;
        previous: number;
        percentageChange: number;
        label: string;
    };
    totalOrders: {
        current: number;
        previous: number;
        percentageChange: number;
        label: string;
    };
    totalProducts: {
        current: number;
        activeProducts: number;
        percentageChange: number;
        label: string;
    };
    newCustomers: {
        current: number;
        percentageChange: number;
        label: string;
    };
}

interface SalesOverview {
    labels: string[];
    revenue: number[];
    orders: number[];
    totalRevenue: number;
    totalOrders: number;
}

interface RecentOrder {
    orderId: string;
    orderNumber: string;
    customerName: string;
    amount: number;
    status: string;
    createdAt: Date;
}

interface TopProduct {
    productId: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
    orderCount: number;
}

interface CustomerInsights {
    totalCustomers: number;
    activeCustomers: number;
    newThisMonth: number;
    topCustomers: Array<{
        customerId: string;
        name: string;
        totalOrders: number;
        totalSpent: number;
    }>;
}

interface CloudinaryUsage {
    transformations: number;
    transformationsLimit: number;
    storage: number;
    storageLimit: number;
    bandwidth: number;
    bandwidthLimit: number;
    derivedResources: number;
}

import { BaseController } from '../base.controller';

@Route('admin/dashboard')
@Tags('ADMIN: Dashboard')
@Security('jwt')
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class AdminDashboardController extends BaseController {

    /**
     * Get dashboard overview statistics
     * @summary Get main dashboard stats (revenue, orders, products, customers)
     */
    @Get('stats')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.OK, 'Success')
    public async getDashboardStats(): Promise<SuccessResponse<DashboardStats>> {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Get current month stats
        const [currentMonthOrders, lastMonthOrders, totalProducts, activeProducts,
            currentMonthCustomers, lastMonthCustomers] = await Promise.all([
                OrderModel.aggregate([
                    { $match: { createdAt: { $gte: startOfThisMonth }, orderStatus: 'delivered' } },
                    { $group: { _id: null, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
                ]),
                OrderModel.aggregate([
                    { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, orderStatus: 'delivered' } },
                    { $group: { _id: null, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
                ]),
                ProductModel.countDocuments(),
                ProductModel.countDocuments({ isActive: true }),
                UserModel.countDocuments({ createdAt: { $gte: startOfThisMonth }, roles: 'customer' }),
                UserModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, roles: 'customer' })
            ]);

        const currentRevenue = currentMonthOrders[0]?.revenue || 0;
        const lastRevenue = lastMonthOrders[0]?.revenue || 0;
        const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;

        const currentOrders = currentMonthOrders[0]?.count || 0;
        const lastOrders = lastMonthOrders[0]?.count || 0;
        const ordersChange = lastOrders > 0 ? ((currentOrders - lastOrders) / lastOrders) * 100 : 0;

        const customersChange = lastMonthCustomers > 0 ?
            ((currentMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100 : 0;

        const stats: DashboardStats = {
            totalRevenue: {
                current: currentRevenue,
                previous: lastRevenue,
                percentageChange: Number(revenueChange.toFixed(1)),
                label: 'vs last month'
            },
            totalOrders: {
                current: currentOrders,
                previous: lastOrders,
                percentageChange: Number(ordersChange.toFixed(1)),
                label: 'vs last month'
            },
            totalProducts: {
                current: totalProducts,
                activeProducts: activeProducts,
                percentageChange: 0, // Can calculate based on previous month if needed
                label: `${activeProducts} active`
            },
            newCustomers: {
                current: currentMonthCustomers,
                percentageChange: Number(customersChange.toFixed(1)),
                label: 'this month'
            }
        };

        return this.sendSuccess(stats, 'Dashboard statistics retrieved successfully');
    }

    /**
     * Get sales overview for graphs
     * @summary Get revenue and order trends over time
     * @param period Time period for the data (7days, 30days, 90days, 1year)
     */
    @Get('sales-overview')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.OK, 'Success')
    public async getSalesOverview(
        @Query() period: '7days' | '30days' | '90days' | '1year' = '30days'
    ): Promise<SuccessResponse<SalesOverview>> {
        const now = new Date();
        let startDate: Date;
        let groupBy: any;
        let dateFormat: string;

        // Determine date range and grouping
        switch (period) {
            case '7days':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                dateFormat = 'day';
                break;
            case '90days':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                dateFormat = 'day';
                break;
            case '1year':
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
                groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                dateFormat = 'month';
                break;
            case '30days':
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                dateFormat = 'day';
        }

        const salesData = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    orderStatus: { $in: ['delivered', 'confirmed', 'shipped'] }
                }
            },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const labels = salesData.map(d => d._id);
        const revenue = salesData.map(d => d.revenue);
        const orders = salesData.map(d => d.orders);
        const totalRevenue = revenue.reduce((sum, val) => sum + val, 0);
        const totalOrders = orders.reduce((sum, val) => sum + val, 0);

        const overview: SalesOverview = {
            labels,
            revenue,
            orders,
            totalRevenue,
            totalOrders
        };

        return this.sendSuccess(overview, 'Sales overview retrieved successfully');
    }

    /**
     * Get recent orders
     * @summary Get latest customer orders for dashboard
     * @param limit Number of orders to retrieve (default: 10)
     */
    @Get('recent-orders')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.OK, 'Success')
    public async getRecentOrders(
        @Query() limit: number = 10
    ): Promise<SuccessResponse<RecentOrder[]>> {
        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('user', 'name email phone')
            .lean();

        const recentOrders: RecentOrder[] = orders.map(order => ({
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            customerName: (order.user as any)?.name || 'Unknown',
            amount: order.totalAmount,
            status: order.orderStatus,
            createdAt: order.createdAt || new Date()
        }));

        return this.sendSuccess(recentOrders, 'Recent orders retrieved successfully');
    }

    /**
     * Get top selling products
     * @summary Get products with highest sales
     * @param limit Number of products to retrieve (default: 10)
     */
    @Get('top-products')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.OK, 'Success')
    public async getTopProducts(
        @Query() limit: number = 10
    ): Promise<SuccessResponse<TopProduct[]>> {
        const topProducts = await OrderModel.aggregate([
            { $match: { orderStatus: 'delivered' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.productName' },
                    totalSales: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: limit }
        ]);

        const products: TopProduct[] = topProducts.map(p => ({
            productId: p._id?.toString() || '',
            name: p.name || 'Unknown Product',
            totalSales: p.totalSales,
            totalRevenue: p.totalRevenue,
            orderCount: p.orderCount
        }));

        return this.sendSuccess(products, 'Top products retrieved successfully');
    }

    /**
     * Get customer insights
     * @summary Get customer statistics and top customers
     */
    @Get('customer-insights')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.OK, 'Success')
    public async getCustomerInsights(): Promise<SuccessResponse<CustomerInsights>> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalCustomers, activeCustomers, newThisMonth] = await Promise.all([
            UserModel.countDocuments({ roles: 'customer' }),
            UserModel.countDocuments({ roles: 'customer', isActive: true }),
            UserModel.countDocuments({ roles: 'customer', createdAt: { $gte: startOfMonth } })
        ]);

        // Get top customers by total spending
        const topCustomersData = await OrderModel.aggregate([
            { $match: { orderStatus: 'delivered' } },
            {
                $group: {
                    _id: '$user',
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' }
        ]);

        const topCustomers = topCustomersData.map(c => ({
            customerId: c._id.toString(),
            name: c.userInfo.name || 'Unknown',
            totalOrders: c.totalOrders,
            totalSpent: c.totalSpent
        }));

        const insights: CustomerInsights = {
            totalCustomers,
            activeCustomers,
            newThisMonth,
            topCustomers
        };

        return this.sendSuccess(insights, 'Customer insights retrieved successfully');
    }

    /**
     * Get order status distribution
     * @summary Get breakdown of orders by status
     */
    @Get('order-status-distribution')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.OK, 'Success')
    public async getOrderStatusDistribution(): Promise<SuccessResponse<any>> {
        const distribution = await OrderModel.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const statusData = distribution.reduce((acc, item) => {
            acc[item._id] = {
                count: item.count,
                totalAmount: item.totalAmount
            };
            return acc;
        }, {} as any);

        return this.sendSuccess(statusData, 'Order status distribution retrieved successfully');
    }

    /**
     * Get revenue by payment method
     * @summary Get breakdown of revenue by payment method
     */
    @Get('revenue-by-payment-method')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.OK, 'Success')
    public async getRevenueByPaymentMethod(): Promise<SuccessResponse<any>> {
        const paymentData = await OrderModel.aggregate([
            { $match: { orderStatus: 'delivered' } },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        const methodData = paymentData.reduce((acc, item) => {
            acc[item._id] = {
                orderCount: item.count,
                revenue: item.totalRevenue
            };
            return acc;
        }, {} as any);

        return this.sendSuccess(methodData, 'Revenue by payment method retrieved successfully');
    }

    /**
     * Get Cloudinary usage statistics
     * @summary Get dynamic Cloudinary usage stats
     */
    @Get('cloudinary-usage')
    @Middlewares([jwtAuthMiddleware])
    @Response(StatusCodes.OK, 'Success')
    public async getCloudinaryUsageStats(): Promise<SuccessResponse<CloudinaryUsage>> {
        const usageData = await cloudinaryImageService.getUsageStats();

        // Map Cloudinary response to required format
        // Checking for different possible response structures from Cloudinary API
        const stats: CloudinaryUsage = {
            transformations: usageData.transformations?.usage || 0,
            transformationsLimit: usageData.transformations?.limit || 0,
            storage: usageData.storage?.usage || 0,
            storageLimit: usageData.storage?.limit || 0,
            bandwidth: usageData.bandwidth?.usage || 0,
            bandwidthLimit: usageData.bandwidth?.limit || 0,
            derivedResources: usageData.derived_resources || usageData.objects?.usage || 0
        };

        return this.sendSuccess(stats, 'Cloudinary usage statistics retrieved successfully');
    }
}
