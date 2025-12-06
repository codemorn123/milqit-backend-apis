import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config';
import PaymentModel, { IPayment, TransactionStatus } from '../models/payment.model';
import OrderModel from '../models/order.model';
import APIError from '../error/api-error';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../config/logger';

export class PaymentService {
    private razorpay: Razorpay | undefined;

    constructor() {
        if (config.razorpay.keyId && config.razorpay.keySecret) {
            this.razorpay = new Razorpay({
                key_id: config.razorpay.keyId,
                key_secret: config.razorpay.keySecret,
            });
        } else {
            logger.warn('Razorpay keys not found in config. Payment service will not work.');
        }
    }

    /**
     * Create a Razorpay order
     * Helper to create a Razorpay order directly.
     * Includes a check for Razorpay configuration.
     */
    private async createOrder(amount: number, currency: string = 'INR', receipt: string): Promise<any> {
        if (!this.razorpay) {
            throw new Error('Payment service is not configured (missing Razorpay keys)');
        }
        try {
            const options = {
                amount: Math.round(amount * 100), // Razorpay expects amount in paise
                currency,
                receipt,
            };
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            logger.error({ error }, 'Error creating Razorpay order via helper');
            throw new APIError('Failed to create payment order with Razorpay', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create a Razorpay order and record it in the database
     */
    async createRazorpayOrder(
        userId: string,
        amount: number,
        currency: string = 'INR',
        receipt: string,
        notes: Record<string, any> = {}
    ): Promise<any> {
        try {
            const order = await this.createOrder(amount, currency, receipt);

            // Create a payment record in our DB
            await PaymentModel.create({
                user: userId,
                razorpayOrderId: order.id,
                amount: amount,
                currency: order.currency,
                status: 'created',
                notes: notes
            });

            return order;
        } catch (error) {
            logger.error({ error }, 'Error creating Razorpay order');
            throw new APIError('Failed to create payment order', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Verify payment signature
     */
    async verifyPayment(
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string
    ): Promise<boolean> {
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', config.razorpay.keySecret)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpaySignature;

        if (isAuthentic) {
            // Update payment status
            await PaymentModel.findOneAndUpdate(
                { razorpayOrderId },
                {
                    razorpayPaymentId,
                    razorpaySignature,
                    status: 'captured', // Assuming success means captured for now
                    method: 'unknown' // We might get this from webhook or another API call
                }
            );

            return true;
        } else {
            await PaymentModel.findOneAndUpdate(
                { razorpayOrderId },
                {
                    status: 'failed',
                    errorReason: 'Signature verification failed'
                }
            );
            return false;
        }
    }

    /**
     * Handle Razorpay Webhook
     */
    async handleWebhook(signature: string, payload: any): Promise<void> {
        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', config.razorpay.webhookSecret)
            .update(JSON.stringify(payload))
            .digest('hex');

        if (signature !== expectedSignature) {
            logger.error('Invalid webhook signature');
            throw new APIError('Invalid signature', StatusCodes.BAD_REQUEST);
        }

        const event = payload.event;
        const paymentEntity = payload.payload.payment.entity;
        const orderId = paymentEntity.order_id;

        logger.info({ event, orderId }, 'Processing Razorpay webhook');

        if (event === 'payment.captured') {
            await PaymentModel.findOneAndUpdate(
                { razorpayOrderId: orderId },
                {
                    razorpayPaymentId: paymentEntity.id,
                    status: 'captured',
                    method: paymentEntity.method,
                    notes: paymentEntity.notes
                }
            );

            // Update Order status if linked
            // We need to find the order that has this payment or linked via notes/receipt
            // For now, let's assume we can find the order via the payment record if we linked it earlier
            // Or we can search Order by some metadata if we stored it.
            // Ideally, when creating Razorpay order, we should link it to our Order.
        } else if (event === 'payment.failed') {
            await PaymentModel.findOneAndUpdate(
                { razorpayOrderId: orderId },
                {
                    status: 'failed',
                    errorReason: paymentEntity.error_description
                }
            );
        }
    }

    /**
     * Get payment history for a user
     */
    async getPaymentHistory(userId: string, page: number = 1, limit: number = 10): Promise<any> {
        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
            populate: 'order'
        };

        return await PaymentModel.paginate({ user: userId }, options);
    }
}

export const paymentService = new PaymentService();
