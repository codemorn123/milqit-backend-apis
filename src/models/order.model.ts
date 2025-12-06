import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBase } from './base';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod';

// Order Item Interface
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage?: string;
  quantity: number;
  unit: string;
  mrp: number;
  sellingPrice: number;
  totalPrice: number;
  discount: number;
}

// Shipping Address Interface
export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

// Order Interface
export interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;

  // Pricing
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;

  // Status
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  // Tracking
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;

  // Metadata
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderDocument extends IBase {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;

  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;

  notes?: string;
  cancellationReason?: string;
  cancelledAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// Create Order Request Interface for TSOA
export interface ICreateOrderRequest {
  user: string;
  items: Array<{
    product: string;
    quantity: number;
  }>;
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// Update Order Request Interface
export interface IUpdateOrderRequest {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cancellationReason?: string;
}

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productImage: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
}, { _id: false });

const ShippingAddressSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
}, { _id: false });

const OrderSchema = new Schema<OrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (items: IOrderItem[]) {
          return items && items.length > 0;
        },
        message: 'Order must have at least one item'
      }
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true
    },

    // Pricing
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    // Status
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
      required: true,
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      required: true,
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
      required: true
    },

    // Tracking
    trackingNumber: {
      type: String,
      trim: true,
      index: true
    },
    estimatedDelivery: {
      type: Date
    },
    deliveredAt: {
      type: Date
    },

    // Metadata
    notes: {
      type: String,
      trim: true
    },
    cancellationReason: {
      type: String,
      trim: true
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
OrderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp}${random}`;
  }

  // Set deliveredAt when status changes to delivered
  if (this.isModified('orderStatus') && this.orderStatus === 'delivered' && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }

  // Set cancelledAt when status changes to cancelled
  if (this.isModified('orderStatus') && this.orderStatus === 'cancelled' && !this.cancelledAt) {
    this.cancelledAt = new Date();
  }

  next();
});

// Apply the pagination plugin
OrderSchema.plugin(mongoosePaginate);

// Static methods for common queries
OrderSchema.statics.findByUser = function (userId: string) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('items.product', 'name slug images');
};

OrderSchema.statics.findByStatus = function (status: OrderStatus) {
  return this.find({ orderStatus: status })
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone')
    .populate('items.product', 'name slug images');
};

OrderSchema.statics.findPendingOrders = function () {
  return this.find({
    orderStatus: { $in: ['pending', 'confirmed', 'processing'] },
    paymentStatus: 'paid'
  })
    .sort({ createdAt: -1 })
    .populate('user', 'name email phone');
};

// Cast the model to the PaginateModel interface
export const OrderModel = mongoose.model<OrderDocument, PaginateModel<OrderDocument>>('Order', OrderSchema);

export default OrderModel;