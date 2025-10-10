// import Razorpay from 'razorpay';
// import RefundModel from '../models/refund.model';
// // import OrderModel from '../models/order.model'; // You must have an Order model
// import { IRefund } from '../types/refund.types';
// import APIError from '../error/api-error';
// import { logger } from '../config/logger';
// import { config } from '../config'; // Assuming config holds your Razorpay keys

// class RefundService {
//   private razorpay: Razorpay | undefined;

//   constructor() {
//     // Initialize Razorpay SDK instance
//     // IMPORTANT: Store your keys securely in environment variables
//     // this.razorpay = new Razorpay({
//     //   key_id: config.razorpay.keyId,
//     //   key_secret: config.razorpay.keySecret,
//     // });
//   }

//   /**
//    * Admin-initiated refund process.
//    */
//   public async initiateRefund(data: { orderId: string; amount: number; reason: string; adminNotes?: string }, adminId: string): Promise<IRefund> {
//     const { orderId, amount, reason, adminNotes } = data;

//     // 1. Validate the Order
//     const order = await OrderModel.findById(orderId);
//     if (!order) throw new APIError('Order not found.', 404);
//     if (order.paymentStatus !== 'paid') throw new APIError('Cannot refund an order that has not been paid for.', 400);
//     if (amount > order.totalAmount) throw new APIError(`Refund amount (₹${amount}) cannot exceed order total (₹${order.totalAmount}).`, 400);

//     const existingRefund = await RefundModel.findOne({ orderId, status: { $in: ['processing', 'completed'] } });
//     if (existingRefund) throw new APIError('A refund for this order is already processed or in progress.', 409);

//     // 2. Create a 'pending' refund log
//     let refundLog = await RefundModel.create({
//       orderId,
//       userId: order.userId,
//       refundAmount: amount,
//       reason,
//       adminNotes,
//       gatewayTransactionId: order.gatewayTransactionId, // This must be stored on your Order model
//       status: 'pending',
//     });

//     // 3. Process refund via Razorpay
//     try {
//       logger.info(`Initiating Razorpay refund for order ${orderId}...`);
//       refundLog.status = 'processing';
//       await refundLog.save();
      
//       const refundResponse = await this.razorpay.payments.refund(order.gatewayTransactionId, {
//         amount: amount * 100, // Razorpay requires amount in paise
//         speed: 'normal',
//         notes: {
//           reason: reason,
//           admin_id: adminId,
//         },
//       });

//       // 4. Update log on success
//       refundLog.status = 'completed';
//       refundLog.gatewayRefundId = refundResponse.id;
//       await refundLog.save();
      
//       logger.info(`Razorpay refund successful for order ${orderId}. Refund ID: ${refundResponse.id}`);
//       return refundLog;

//     } catch (error: any) {
//       // 5. Update log on failure
//       logger.error(`Razorpay refund failed for order ${orderId}:`, error);
//       refundLog.status = 'failed';
//       refundLog.failureReason = error.description || error.message || 'Unknown error from payment gateway.';
//       await refundLog.save();
//       throw new APIError(`Refund processing failed: ${refundLog.failureReason}`, 500);
//     }
//   }

//   // Add methods for admins to get all refunds and users to get their refunds
//   public async getRefundsForUser(userId: string): Promise<IRefund[]> {
//     return RefundModel.find({ userId }).sort({ createdAt: -1 }).lean<IRefund[]>();
//   }
// }

// export default new RefundService();