



import mongoose, { Schema, Document, PaginateModel, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ValidUnit } from './ProductModel';

export type CartStatus = 'active' | 'checkout' | 'completed' | 'abandoned';
export type DeliveryType = 'standard' | 'express' | 'scheduled' | 'pickup';

/**
 * Cart Item interface for individual products in cart
 * @author MarotiKathoke
 * @created 2025-09-13 15:46:39
 */
export interface ICartItem {
  productId: Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  unit: ValidUnit;
  images: string[];
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
 * Device Info interface for mobile tracking
 * @author MarotiKathoke
 * @created 2025-09-13 15:46:39
 */
export interface IDeviceInfo {
  platform: 'ios' | 'android';
  version: string;
  deviceId: string;
}


export interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
}

/**
 * Base Cart interface without Document methods
 * @author MarotiKathoke
 * @created 2025-09-13 15:46:39
 */
export interface ICart {
  userId: Types.ObjectId;
  sessionId?: string;
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
  deviceInfo?: IDeviceInfo;
  location?: ILocation;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Cart Document interface extending Mongoose Document
 * @author MarotiKathoke
 * @created 2025-09-13 15:46:39
 */
export interface CartDocument extends ICart ,Document {
  // Additional instance methods can be added here
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  calculateTotals(): void;
}




/**
 * Cart Model interface with static methods
 * @author MarotiKathoke
 * @created 2025-09-13 15:46:39
 */
// export interface CartModel extends PaginateModel<CartDocument> {
//   findActiveCart(userId: string): Promise<CartDocument | null>;
//   cleanupExpiredCarts(): Promise<number>;
// }

export interface CartModel extends PaginateModel<CartDocument> {
      findActiveCart(userId: string): Promise<CartDocument | null>;
  cleanupExpiredCarts(): Promise<number>;
}
/**
 * Enhanced Cart Schema with proper TypeScript support
 * @author MarotiKathoke
 * @created 2025-09-13 15:46:39
 */
const CartSchema = new Schema<CartDocument>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'User ID is required'],
      index: true 
    },
    
    sessionId: { 
      type: String, 
      index: true,
      sparse: true,
      maxlength: [255, 'Session ID cannot exceed 255 characters']
    },
    
    items: [{
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
      price: { 
        type: Number, 
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
      },
      compareAtPrice: { 
        type: Number, 
        min: [0, 'Compare at price cannot be negative']
      },
      quantity: { 
        type: Number, 
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'], 
        max: [50, 'Maximum 50 items allowed per product'],
        validate: {
          validator: Number.isInteger,
          message: 'Quantity must be an integer'
        }
      },
      unit: { 
        type: String, 
        required: [true, 'Unit is required'],
        enum: {
          values: ['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen', 'bundle'],
          message: 'Unit must be one of: piece, kg, gm, litre, ml, pack, dozen, bundle'
        }
      },
      images: [{ 
        type: String,
        validate: {
          validator: function(v: string) {
            return /^https?:\/\/.+/.test(v);
          },
          message: 'Image must be a valid URL'
        }
      }],
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
      maxQuantity: { 
        type: Number, 
        default: 10, 
        min: [1, 'Max quantity must be at least 1']
      },
      subtotal: { 
        type: Number, 
        required: [true, 'Subtotal is required'],
        min: [0, 'Subtotal cannot be negative']
      },
      discount: { 
        type: Number, 
        default: 0, 
        min: [0, 'Discount cannot be negative']
      },
      finalPrice: { 
        type: Number, 
        required: [true, 'Final price is required'],
        min: [0, 'Final price cannot be negative']
      }
    }],
    
    totalItems: { 
      type: Number, 
      default: 0, 
      min: [0, 'Total items cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Total items must be an integer'
      }
    },
    
    subtotal: { 
      type: Number, 
      default: 0, 
      min: [0, 'Subtotal cannot be negative']
    },
    
    discount: { 
      type: Number, 
      default: 0, 
      min: [0, 'Discount cannot be negative']
    },
    
    deliveryCharges: { 
      type: Number, 
      default: 0, 
      min: [0, 'Delivery charges cannot be negative']
    },
    
    taxes: { 
      type: Number, 
      default: 0, 
      min: [0, 'Taxes cannot be negative']
    },
    
    totalAmount: { 
      type: Number, 
      default: 0, 
      min: [0, 'Total amount cannot be negative']
    },
    
    savings: { 
      type: Number, 
      default: 0, 
      min: [0, 'Savings cannot be negative']
    },
    
    status: { 
      type: String, 
      enum: {
        values: ['active', 'checkout', 'completed', 'abandoned'],
        message: 'Status must be one of: active, checkout, completed, abandoned'
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
      ref: 'Address',
      index: true 
    },
    
    scheduledDelivery: { 
      type: Date,
      validate: {
        validator: function(this: CartDocument, v: Date) {
          return !v || v > new Date();
        },
        message: 'Scheduled delivery must be in the future'
      }
    },
    
    estimatedDelivery: { 
      type: Date 
    },
    
    appliedCoupons: [{ 
      type: String, 
      trim: true,
      uppercase: true,
      maxlength: [50, 'Coupon code cannot exceed 50 characters']
    }],
    
    notes: { 
      type: String, 
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    
    deviceInfo: {
      platform: { 
        type: String, 
        enum: {
          values: ['ios', 'android'],
          message: 'Platform must be either ios or android'
        }
      },
      version: { 
        type: String, 
        maxlength: [20, 'Version cannot exceed 20 characters']
      },
      deviceId: { 
        type: String, 
        maxlength: [255, 'Device ID cannot exceed 255 characters']
      }
    },
    
    location: {
      latitude: { 
        type: Number, 
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: { 
        type: Number, 
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      },
      address: { 
        type: String, 
        maxlength: [500, 'Address cannot exceed 500 characters']
      }
    },
    
    isActive: { 
      type: Boolean, 
      default: true, 
      index: true 
    },
    
    expiresAt: { 
      type: Date, 
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      index: { expireAfterSeconds: 0 }
    }
  },
  { 
    timestamps: true, 
    versionKey: false,
    toJSON: { 
      virtuals: true,
      transform: function(doc: CartDocument, ret: any) {
        delete ret._id;
        delete ret.__v;
        ret.id = doc._id?.toString();
        return ret;
      }
    },
    toObject: { 
      virtuals: true 
    }
  }
);

// ===== INDEXES FOR MOBILE PERFORMANCE =====
CartSchema.index({ userId: 1, status: 1 });
CartSchema.index({ sessionId: 1, status: 1 });
CartSchema.index({ createdAt: -1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
CartSchema.index({ 'deviceInfo.deviceId': 1 });

// ===== VIRTUAL FIELDS =====
CartSchema.virtual('itemCount').get(function(this: CartDocument) {
  return this.items?.length || 0;
});

CartSchema.virtual('hasItems').get(function(this: CartDocument) {
  return this.items && this.items.length > 0;
});

// ===== PRE-SAVE MIDDLEWARE =====
CartSchema.pre('save', function(this: CartDocument, next) {
  console.log(`📦 Processing cart for user: ${this.userId} by MarotiKathoke`);
  
  // Calculate totals
  this.calculateTotals();
  
  // Reset expiry for active carts with items
  if (this.status === 'active' && this.items.length > 0) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  
  console.log(`✅ Cart processed: ${this.totalItems} items, ₹${this.totalAmount}`);
  next();
});

CartSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  this.set({ updatedAt: new Date() });
  console.log(`🔄 Updating cart at ${new Date().toISOString()}`);
  next();
});

// ===== INSTANCE METHODS =====
CartSchema.methods.toMobileJSON = function(this: CartDocument) {
  return {
    id: this._id?.toString(),
    userId: this.userId,
    totalItems: this.totalItems,
    subtotal: this.subtotal,
    discount: this.discount,
    deliveryCharges: this.deliveryCharges,
    taxes: this.taxes,
    totalAmount: this.totalAmount,
    savings: this.savings,
    status: this.status,
    deliveryType: this.deliveryType,
    estimatedDelivery: this.estimatedDelivery,
    appliedCoupons: this.appliedCoupons,
    items: this.items.map(item => ({
      productId: item.productId.toString(),
      name: item.name,
      slug: item.slug,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      quantity: item.quantity,
      unit: item.unit,
      images: item.images,
      brand: item.brand,
      sku: item.sku,
      isAvailable: item.isAvailable,
      maxQuantity: item.maxQuantity,
      subtotal: item.subtotal,
      discount: item.discount,
      finalPrice: item.finalPrice
    })),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

CartSchema.methods.calculateTotals = function(this: CartDocument) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.savings = this.items.reduce((sum, item) => sum + item.discount, 0);
  this.totalAmount = this.subtotal - this.discount + this.deliveryCharges + this.taxes;
};

// ===== STATIC METHODS =====
CartSchema.statics.findActiveCart = function(userId: string) {
  return this.findOne({ userId, status: 'active' });
};

CartSchema.statics.cleanupExpiredCarts = async function() {
  const result = await this.deleteMany({
    status: 'abandoned',
    expiresAt: { $lt: new Date() }
  });
  console.log(`🧹 Cleaned up ${result.deletedCount} expired carts`);
  return result.deletedCount;
};

// Apply pagination plugin
CartSchema.plugin(mongoosePaginate);

// Create and export the model
// const CartModelClass = mongoose.model<CartDocument, CartModel>('Cart', CartSchema);

// console.log(`✅ CartModel initialized with TypeScript support by MarotiKathoke at ${new Date().toISOString()}`);

// export { CartModelClass as CartModel };
// export default CartModelClass;

export const CartModelClass = mongoose.model<CartDocument, CartModel>('Cart', CartSchema);