import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type TransactionStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
export type TransactionMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod' | 'unknown';

// Plain interface for TSOA
export interface IPayment {
    _id: string | mongoose.Types.ObjectId;
    user: string | mongoose.Types.ObjectId | any;
    order?: string | mongoose.Types.ObjectId | any;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount: number;
    currency: string;
    status: TransactionStatus;
    method: TransactionMethod;
    notes?: Record<string, any>;
    errorReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Mongoose Document Interface
export interface PaymentDocument extends Document {
    user: mongoose.Types.ObjectId;
    order?: mongoose.Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount: number;
    currency: string;
    status: TransactionStatus;
    method: TransactionMethod;
    notes?: Record<string, any>;
    errorReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<PaymentDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            index: true
        },
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        razorpayPaymentId: {
            type: String,
            index: true
        },
        razorpaySignature: {
            type: String
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR'
        },
        status: {
            type: String,
            enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
            default: 'created',
            index: true
        },
        method: {
            type: String,
            default: 'unknown'
        },
        notes: {
            type: Schema.Types.Mixed
        },
        errorReason: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

PaymentSchema.plugin(mongoosePaginate);

export const PaymentModel = mongoose.model<PaymentDocument, PaginateModel<PaymentDocument>>('Payment', PaymentSchema);
export default PaymentModel;
