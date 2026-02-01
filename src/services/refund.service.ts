import mongoose from 'mongoose';
import { RefundModel, IRefund, RefundDocument } from '../models/refund.model';
import { OrderModel } from '../models/order.model';
import { PaymentModel } from '../models/payment.model';
import { PresentableError } from '../error/clientErrorHelper';
import { logger } from '../config/logger';
import { IRefundFilter, PaginatedResponse } from '../types/common.types';
import { QueryBuilder } from '../utils/query-builder';

export class RefundService {
    /**
     * Create a refund request
     */
    async createRefundRequest(
        userId: string,
        data: {
            orderId: string;
            reason: string;
            description?: string;
            amount?: number;
            images?: string[];
        }
    ): Promise<RefundDocument> {
        if (!mongoose.Types.ObjectId.isValid(data.orderId)) {
            throw new PresentableError('BAD_REQUEST', 'Invalid order ID');
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Check if order exists and belongs to user
            const order = await OrderModel.findOne({
                _id: data.orderId,
                user: userId
            }).session(session);

            if (!order) {
                throw new PresentableError('NOT_FOUND', 'Order not found');
            }

            // 2. Check if order is eligible for refund
            // Allow refund only if delivered or cancelled (if paid)
            if (!['delivered', 'cancelled'].includes(order.orderStatus)) {
                throw new PresentableError('BAD_REQUEST', 'Order is not eligible for refund yet');
            }

            // Check if payment was made
            // We require the order to be marked as 'paid' before processing a refund.
            // This applies to both online payments and COD (which should be marked paid upon delivery).
            if (order.paymentStatus !== 'paid') {
                throw new PresentableError('BAD_REQUEST', 'Payment not confirmed for this order');
            }

            // 3. Check for existing active refunds
            const existingRefund = await RefundModel.findOne({
                orderId: data.orderId,
                status: { $in: ['pending', 'processing', 'completed'] }
            }).session(session);

            if (existingRefund) {
                throw new PresentableError('CONFLICT', 'A refund request already exists for this order');
            }

            // 4. Determine refund amount
            const refundAmount = data.amount || order.totalAmount;
            if (refundAmount > order.totalAmount) {
                throw new PresentableError('BAD_REQUEST', 'Refund amount cannot exceed order total');
            }

            // 5. Get payment details for gateway info
            const payment = await PaymentModel.findOne({ order: order._id }).session(session);

            // 6. Create refund record
            const refund = new RefundModel({
                orderId: order._id,
                userId: userId,
                amount: refundAmount,
                reason: data.reason,
                description: data.description,
                images: data.images,
                status: 'pending',
                paymentGateway: payment?.method || order.paymentMethod,
                gatewayTransactionId: payment?.razorpayPaymentId || 'COD', // Fallback
            });

            await refund.save({ session });

            // 7. Update order payment status to indicate refund requested (optional, or just track in refund)
            // We might not want to change order status yet until approved.

            await session.commitTransaction();
            return refund;

        } catch (error: any) {
            await session.abortTransaction();
            if (error instanceof PresentableError) throw error;
            logger.error(`Refund request failed: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', 'Failed to create refund request');
        } finally {
            session.endSession();
        }
    }

    /**
     * Get user's refunds
     */
    async getUserRefunds(userId: string): Promise<RefundDocument[]> {
        return RefundModel.find({ userId }).sort({ createdAt: -1 }).populate('orderId', 'orderNumber items');
    }

    /**
     * Get refund details
     */
    async getRefundById(refundId: string, userId: string): Promise<RefundDocument | null> {
        return RefundModel.findOne({ _id: refundId, userId }).populate('orderId');
    }

    // --- Admin Methods ---

    /**
     * Get all refunds (Admin)
     */
    async getAllRefunds(options: IRefundFilter): Promise<PaginatedResponse<IRefund>> {
        const builder = new QueryBuilder(RefundModel, options);

        // Custom filters for Refund
        if (options.status) {
            builder.query.status = options.status;
        }
        if (options.orderId) {
            builder.query.orderId = options.orderId;
        }
        if (options.userId) {
            builder.query.userId = options.userId;
        }

        // Execute query with population
        const page = Number(options.page) || 1;
        const limit = Number(options.limit) || 20;
        const skip = (page - 1) * limit;

        const [docs, totalDocs] = await Promise.all([
            RefundModel.find(builder.query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'firstName lastName email phone')
                .populate('orderId', 'orderNumber totalAmount')
                .lean<IRefund[]>(),
            RefundModel.countDocuments(builder.query)
        ]);

        return {
            docs,
            totalDocs,
            limit,
            page,
            totalPages: Math.ceil(totalDocs / limit),
            hasNextPage: page < Math.ceil(totalDocs / limit),
            hasPrevPage: page > 1,
            nextPage: page < Math.ceil(totalDocs / limit) ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            pagingCounter: (page - 1) * limit + 1
        };
    }

    /**
     * Process refund (Admin)
     */
    async processRefund(
        refundId: string,
        data: { status: 'approved' | 'rejected'; adminNotes?: string; rejectionReason?: string },
        adminId: string
    ): Promise<RefundDocument> {
        const refund = await RefundModel.findById(refundId);
        if (!refund) {
            throw new PresentableError('NOT_FOUND', 'Refund request not found');
        }

        if (refund.status !== 'pending') {
            throw new PresentableError('BAD_REQUEST', `Refund is already ${refund.status}`);
        }

        if (data.status === 'rejected') {
            refund.status = 'rejected';
            refund.failureReason = data.rejectionReason;
            refund.adminNotes = data.adminNotes;
            refund.processedBy = new mongoose.Types.ObjectId(adminId);
            refund.processedAt = new Date();
            await refund.save();
            return refund;
        }

        // If approved
        // TODO: Integrate with Payment Gateway (Razorpay) here if needed
        // For now, we mark it as 'completed' (assuming manual refund or COD)
        // Or 'processing' if we had a background job.

        refund.status = 'completed'; // Direct completion for now
        refund.adminNotes = data.adminNotes;
        refund.processedBy = new mongoose.Types.ObjectId(adminId);
        refund.processedAt = new Date();

        await refund.save();
        return refund;
    }
}

export const refundService = new RefundService();