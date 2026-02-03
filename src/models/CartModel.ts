


import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ValidUnit } from './product.model';
import { IcommonImage, DeviceInfo, Location } from '../types/common.types';
import { createSchemaOptions, DeviceInfoSchema, LocationSchema, NumberField } from '../utils/schema.helpers';

/**
 * Cart Status Types
 */
export type CartStatus = 'active' | 'completed' | 'expired' | 'abandoned';
export type DeliveryType = 'standard' | 'express' | 'scheduled' | 'pickup';

/**
 * Cart Item Interface
 */
export interface ICartItem {
  productId: Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  unit: ValidUnit;
  images: IcommonImage[];
  brand?: string;
  categoryId: Types.ObjectId;
  sku: string;
  isAvailable: boolean;
  maxQuantity: number;
  subtotal: number;
  discount: number;
  finalPrice: number;
}

/**
 * Base Cart Interface
 */
export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  deliveryCharges: number;
  taxes: number;
  totalAmount: number;
  savings: number;
  status: CartStatus;
  deliveryType: DeliveryType;
  deliveryAddress?: Types.ObjectId;
  scheduledDelivery?: Date;
  estimatedDelivery?: Date;
  appliedCoupons: string[];
  notes?: string;
  deviceInfo?: DeviceInfo;
  location?: Location;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Cart Document Interface
 */
export interface ICartDocument extends ICart, Document {
  _id: Types.ObjectId;
  calculateTotals(): void;
  updateActivity(): Promise<void>;
  isExpired(): boolean;
  hasItem(productId: string): boolean;
  getItemQuantity(productId: string): number;
}

/**
 * Cart Model Interface with Static Methods
 */
export interface ICartModel extends Model<ICartDocument> {
  findActiveCart(userId: string): Promise<ICartDocument | null>;
  clearExpiredCarts(): Promise<number>;
  getCartStats(userId: string): Promise<any>;
}

/**
 * Cart Schema
 */
const CartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product ID is required']
        },
        name: {
          type: String,
          required: [true, 'Product name is required'],
          trim: true,
          maxlength: [200, 'Product name cannot exceed 200 characters']
        },
        slug: {
          type: String,
          required: [true, 'Product slug is required'],
          maxlength: [250, 'Product slug cannot exceed 250 characters']
        },
        price: NumberField.positiveRequired(),
        compareAtPrice: NumberField.positiveOptional(),
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
          validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer'
          }
        },
        unit: {
          type: String,
          required: [true, 'Unit is required'],
          enum: {
            values: ['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen'],
            message: 'Unit must be one of: piece, kg, gm, litre, ml, pack, dozen'
          }
        },
        images: [
          {
            url: { type: String, required: true },
            key: { type: String, required: true }
          }
        ],
        brand: {
          type: String,
          trim: true,
          maxlength: [100, 'Brand name cannot exceed 100 characters']
        },
        categoryId: {
          type: Schema.Types.ObjectId,
          ref: 'Category',
          required: [true, 'Category ID is required']
        },
        sku: {
          type: String,
          required: [true, 'SKU is required'],
          maxlength: [50, 'SKU cannot exceed 50 characters']
        },
        isAvailable: {
          type: Boolean,
          default: true
        },
        maxQuantity: NumberField.positiveRequired(),
        subtotal: NumberField.positiveRequired(),
        discount: NumberField.positiveOptional(),
        finalPrice: NumberField.positiveRequired()
      }
    ],

    totalItems: {
      type: Number,
      default: 0,
      min: [0, 'Total items cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Total items must be an integer'
      }
    },

    subtotal: NumberField.positiveOptional(),
    discount: NumberField.positiveOptional(),
    deliveryCharges: NumberField.positiveOptional(),
    taxes: NumberField.positiveOptional(),
    totalAmount: NumberField.positiveOptional(),
    savings: NumberField.positiveOptional(),

    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'expired', 'abandoned'],
        message: 'Status must be one of: active, completed, expired, abandoned'
      },
      default: 'active',
      index: true
    },

    deliveryType: {
      type: String,
      enum: {
        values: ['standard', 'express', 'scheduled', 'pickup'],
        message: 'Delivery type must be one of: standard, express, scheduled, pickup'
      },
      default: 'standard'
    },

    deliveryAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address'
    },

    scheduledDelivery: {
      type: Date,
      validate: {
        validator: function (this: ICartDocument, v: Date) {
          return !v || v > new Date();
        },
        message: 'Scheduled delivery must be in the future'
      }
    },

    estimatedDelivery: {
      type: Date
    },

    appliedCoupons: [
      {
        type: String,
        trim: true,
        uppercase: true,
        maxlength: [50, 'Coupon code cannot exceed 50 characters']
      }
    ],

    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },

    deviceInfo: {
      type: DeviceInfoSchema,
      default: undefined
    },

    location: {
      type: LocationSchema,
      default: undefined
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      },
      index: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  createSchemaOptions()
);

// ===== INDEXES FOR PERFORMANCE =====
CartSchema.index({ userId: 1, status: 1 });
CartSchema.index({ userId: 1, isActive: 1 });
CartSchema.index({ status: 1, expiresAt: 1 });
CartSchema.index({ 'deviceInfo.deviceId': 1 });
CartSchema.index({ lastActivityAt: -1 });

// ===== VIRTUAL FIELDS =====
CartSchema.virtual('itemCount').get(function (this: ICartDocument) {
  return this.items?.length || 0;
});

CartSchema.virtual('isEmpty').get(function (this: ICartDocument) {
  return !this.items || this.items.length === 0;
});

CartSchema.virtual('hasDiscount').get(function (this: ICartDocument) {
  return this.discount > 0 || this.savings > 0;
});

CartSchema.virtual('hasDeliveryCharges').get(function (this: ICartDocument) {
  return this.deliveryCharges > 0;
});

// ===== PRE-SAVE MIDDLEWARE =====
CartSchema.pre('save', function (this: ICartDocument, next) {
  console.log(`🛒 Processing cart for user: ${this.userId}`);

  // Calculate totals
  this.calculateTotals();

  // Update activity timestamp
  this.lastActivityAt = new Date();

  // Auto-expire check
  if (this.expiresAt < new Date() && this.status === 'active') {
    this.status = 'expired';
  }

  console.log(
    `✅ Cart processed: ${this.totalItems} items, ₹${this.totalAmount}, Status: ${this.status}`
  );

  next();
});

CartSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: new Date(), lastActivityAt: new Date() });
  console.log(`🔄 Updating cart at ${new Date().toISOString()}`);
  next();
});

// ===== INSTANCE METHODS =====

/**
 * Calculate all cart totals
 */
CartSchema.methods.calculateTotals = function (this: ICartDocument): void {
  if (!this.items || this.items.length === 0) {
    this.totalItems = 0;
    this.subtotal = 0;
    this.savings = 0;
    this.totalAmount = 0;
    return;
  }

  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.savings = this.items.reduce((sum, item) => sum + item.discount, 0);

  // Total = Subtotal - Discount + Delivery + Taxes
  this.totalAmount = Math.max(
    0,
    this.subtotal - this.discount + this.deliveryCharges + this.taxes
  );
};

/**
 * Update activity timestamp
 */
CartSchema.methods.updateActivity = async function (this: ICartDocument): Promise<void> {
  this.lastActivityAt = new Date();
  await this.save();
};

/**
 * Check if cart is expired
 */
CartSchema.methods.isExpired = function (this: ICartDocument): boolean {
  return this.expiresAt < new Date() || this.status === 'expired';
};

/**
 * Check if cart has specific item
 */
CartSchema.methods.hasItem = function (this: ICartDocument, productId: string): boolean {
  return this.items.some((item) => item.productId.toString() === productId);
};

/**
 * Get quantity of specific item
 */
CartSchema.methods.getItemQuantity = function (this: ICartDocument, productId: string): number {
  const item = this.items.find((item) => item.productId.toString() === productId);
  return item?.quantity || 0;
};

// ===== STATIC METHODS =====

/**
 * Find active cart for user
 */
CartSchema.statics.findActiveCart = function (userId: string): Promise<ICartDocument | null> {
  return this.findOne({
    userId: new Types.ObjectId(userId),
    status: 'active',
    isActive: true
  });
};

/**
 * Clear expired carts
 */
CartSchema.statics.clearExpiredCarts = async function (): Promise<number> {
  const result = await this.updateMany(
    {
      status: 'active',
      expiresAt: { $lt: new Date() }
    },
    {
      $set: {
        status: 'expired',
        isActive: false,
        updatedAt: new Date()
      }
    }
  );

  console.log(`🗑️ Cleared ${result.modifiedCount} expired carts`);
  return result.modifiedCount;
};

/**
 * Get cart statistics for user
 */
CartSchema.statics.getCartStats = async function (userId: string): Promise<any> {
  const stats = await this.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        totalItems: { $sum: '$totalItems' }
      }
    }
  ]);

  return {
    total: stats.reduce((sum, s) => sum + s.count, 0),
    totalValue: stats.reduce((sum, s) => sum + s.totalAmount, 0),
    totalItems: stats.reduce((sum, s) => sum + s.totalItems, 0),
    byStatus: stats.reduce((acc, s) => {
      acc[s._id] = {
        count: s.count,
        amount: s.totalAmount,
        items: s.totalItems
      };
      return acc;
    }, {} as any)
  };
};

// ===== POST-SAVE HOOKS =====
CartSchema.post('save', function (doc: ICartDocument) {
  console.log(`💾 Cart saved successfully for user: ${doc.userId}`);
});

// ===== ERROR HANDLERS =====
CartSchema.post('save', function (error: any, doc: ICartDocument, next: any) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Duplicate cart entry detected'));
  } else {
    next(error);
  }
});

// Apply pagination plugin
CartSchema.plugin(mongoosePaginate);

// ===== EXPORT MODEL =====
export const CartModelClass = mongoose.model<ICartDocument, ICartModel>('Cart', CartSchema);

export default CartModelClass;
