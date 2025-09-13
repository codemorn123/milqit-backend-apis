import mongoose, { Schema, Document, PaginateModel, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
export type CouponType = 'percentage' | 'fixed' | 'buy_x_get_y' | 'free_delivery' | 'cashback';
export type CouponStatus = 'active' | 'inactive' | 'expired' | 'draft' | 'scheduled';
export type CouponTarget = 'all' | 'category' | 'product' | 'user' | 'first_time' | 'premium' | 'location';
export type DiscountOn = 'subtotal' | 'delivery' | 'total' | 'category' | 'product';
export type CouponTrigger = 'manual' | 'auto' | 'cart_value' | 'first_order' | 'location_based';

/**
 * Usage Restrictions interface - Blinkit style
 * @author MarotiKathoke
 * @created 2025-09-13 17:01:51
 */
export interface UsageRestrictions {
  minOrderAmount: number;
  maxOrderAmount?: number;
  maxUsagePerUser: number;
  maxTotalUsage: number;
  currentUsage: number;
  applicableProducts?: Types.ObjectId[];
  applicableCategories?: Types.ObjectId[];
  excludedProducts?: Types.ObjectId[];
  excludedCategories?: Types.ObjectId[];
  applicableUserTypes?: ('new' | 'regular' | 'premium' | 'vip')[];
  firstTimeUsersOnly: boolean;
  premiumUsersOnly: boolean;
  applicableLocations?: string[]; // Pincode based
  dayOfWeekRestrictions?: number[]; // 0-6 (Sun-Sat)
  timeRestrictions?: {
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
  };
}

/**
 * Device Info interface for mobile tracking
 * @author MarotiKathoke
 * @created 2025-09-13 17:01:51
 */
export interface DeviceInfo {
  platform: 'ios' | 'android';
  version: string;
  deviceId: string;
  appVersion?: string;
  fcmToken?: string;
}

/**
 * Location interface - Enhanced for delivery zones
 * @author MarotiKathoke
 * @created 2025-09-13 17:01:51
 */
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  area?: string;
}

/**
 * Coupon Usage Log interface - Detailed tracking
 * @author MarotiKathoke
 * @created 2025-09-13 17:01:51
 */
export interface CouponUsage {
  userId: Types.ObjectId;
  orderId?: Types.ObjectId;
  cartId?: Types.ObjectId;
  discountAmount: number;
  orderAmount: number;
  originalOrderAmount: number;
  savings: number;
  usedAt: Date;
  deviceInfo?: DeviceInfo;
  location?: Location;
  paymentMethod?: string;
  deliveryType?: string;
}

/**
 * Base Coupon interface - Blinkit optimized
 * @author MarotiKathoke
 * @created 2025-09-13 17:01:51
 */
export interface CouponData {
  code: string;
  name: string;
  description: string;
  shortDescription?: string; // For mobile cards
  type: CouponType;
  discountValue: number;
  maxDiscountAmount?: number;
  discountOn: DiscountOn;
  status: CouponStatus;
  target: CouponTarget;
  trigger: CouponTrigger;
  startDate: Date;
  endDate: Date;
  usageRestrictions: UsageRestrictions;
  usageHistory: CouponUsage[];
  isStackable: boolean;
  autoApply: boolean;
  requiresCode: boolean;
  promotionalText?: string;
  bannerImage?: string;
  iconImage?: string;
  backgroundColor?: string;
  textColor?: string;
  termsAndConditions: string;
  priority: number; // For sorting in app
  campaignId?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Coupon Document interface - Clean & optimized
 * @author MarotiKathoke
 * @created 2025-09-13 17:01:51
 */
export interface CouponDocument extends CouponData, Document {
  _id: mongoose.Types.ObjectId;
  
  // Virtual properties
  isExpired: boolean;
  daysRemaining: number;
  usagePercentage: string;
  isEligibleNow: boolean;
  
  // Instance methods
  isValid(): boolean;
  canBeUsedBy(userId: string, orderAmount: number, location?: Location): Promise<{ valid: boolean; message?: string }>;
  calculateDiscount(orderAmount: number, cartItems?: any[], deliveryCharges?: number): number;
  incrementUsage(userId: string, orderId?: string, usageData?: Partial<CouponUsage>): Promise<void>;
  toMobileJSON(): any;
  toBannerJSON(): any; // For promotional banners
}

/**
 * Coupon Model interface - Blinkit style methods
 * @author MarotiKathoke
 * @created 2025-09-13 17:01:51
 */
export interface CouponModelInterface extends PaginateModel<CouponDocument> {
  findValidCoupons(userId?: string, orderAmount?: number, location?: Location): Promise<CouponDocument[]>;
  findByCode(code: string): Promise<CouponDocument | null>;
  getActiveCoupons(target?: CouponTarget): Promise<CouponDocument[]>;
  getAutoApplyCoupons(userId: string, orderAmount: number, location?: Location): Promise<CouponDocument[]>;
  getBestCoupon(userId: string, orderAmount: number, location?: Location): Promise<CouponDocument | null>;
  getPromotionalCoupons(limit?: number): Promise<CouponDocument[]>;
  cleanupExpiredCoupons(): Promise<number>;
  getCouponAnalytics(startDate?: Date, endDate?: Date): Promise<any>;
  getCouponsByLocation(pincode: string): Promise<CouponDocument[]>;
}

/**
 * Enhanced Coupon Schema - Blinkit optimized for grocery delivery
 * Optimized for React Native apps (RFS, SmartFlow, home_fresh_app, core_mobile_app, shree-react-naive-app)
 * @author MarotiKathoke
 * @created 2025-09-13 17:01:51
 */
const CouponSchema = new Schema<CouponDocument>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, 'Coupon code must be at least 3 characters'],
      maxlength: [20, 'Coupon code cannot exceed 20 characters'],
      match: [/^[A-Z0-9]+$/, 'Coupon code must contain only uppercase letters and numbers'],
      index: true
    },
    
    name: {
      type: String,
      required: [true, 'Coupon name is required'],
      trim: true,
      maxlength: [100, 'Coupon name cannot exceed 100 characters'],
      index: 'text'
    },
    
    description: {
      type: String,
      required: [true, 'Coupon description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [100, 'Short description cannot exceed 100 characters']
    },
    
    type: {
      type: String,
      enum: {
        values: ['percentage', 'fixed', 'buy_x_get_y', 'free_delivery', 'cashback'],
        message: 'Type must be one of: percentage, fixed, buy_x_get_y, free_delivery, cashback'
      },
      required: [true, 'Coupon type is required'],
      index: true
    },
    
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
      validate: {
        validator: function(this: CouponDocument, value: number) {
          if (this.type === 'percentage') {
            return value >= 0 && value <= 100;
          }
          return value >= 0;
        },
        message: 'Invalid discount value for coupon type'
      }
    },
    
    maxDiscountAmount: {
      type: Number,
      min: [0, 'Max discount amount cannot be negative']
    },
    
    discountOn: {
      type: String,
      enum: {
        values: ['subtotal', 'delivery', 'total', 'category', 'product'],
        message: 'Discount on must be one of: subtotal, delivery, total, category, product'
      },
      default: 'subtotal'
    },
    
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'expired', 'draft', 'scheduled'],
        message: 'Status must be one of: active, inactive, expired, draft, scheduled'
      },
      default: 'draft',
      index: true
    },
    
    target: {
      type: String,
      enum: {
        values: ['all', 'category', 'product', 'user', 'first_time', 'premium', 'location'],
        message: 'Target must be one of: all, category, product, user, first_time, premium, location'
      },
      default: 'all',
      index: true
    },
    
    trigger: {
      type: String,
      enum: {
        values: ['manual', 'auto', 'cart_value', 'first_order', 'location_based'],
        message: 'Trigger must be one of: manual, auto, cart_value, first_order, location_based'
      },
      default: 'manual',
      index: true
    },
    
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      index: true
    },
    
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(this: CouponDocument, value: Date) {
          return value > this.startDate;
        },
        message: 'End date must be after start date'
      },
      index: true
    },
    
    usageRestrictions: {
      minOrderAmount: {
        type: Number,
        required: [true, 'Minimum order amount is required'],
        min: [0, 'Minimum order amount cannot be negative'],
        default: 0
      },
      maxOrderAmount: {
        type: Number,
        min: [0, 'Maximum order amount cannot be negative']
      },
      maxUsagePerUser: {
        type: Number,
        required: [true, 'Max usage per user is required'],
        min: [1, 'Max usage per user must be at least 1'],
        default: 1
      },
      maxTotalUsage: {
        type: Number,
        required: [true, 'Max total usage is required'],
        min: [1, 'Max total usage must be at least 1'],
        default: 10000
      },
      currentUsage: {
        type: Number,
        default: 0,
        min: [0, 'Current usage cannot be negative']
      },
      applicableProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }],
      applicableCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
      }],
      excludedProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }],
      excludedCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
      }],
      applicableUserTypes: [{
        type: String,
        enum: ['new', 'regular', 'premium', 'vip']
      }],
      firstTimeUsersOnly: {
        type: Boolean,
        default: false
      },
      premiumUsersOnly: {
        type: Boolean,
        default: false
      },
      applicableLocations: [{
        type: String,
        match: /^\d{6}$/ // Pincode format
      }],
      dayOfWeekRestrictions: [{
        type: Number,
        min: 0,
        max: 6
      }],
      timeRestrictions: {
        startTime: {
          type: String,
          match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        },
        endTime: {
          type: String,
          match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        }
      }
    },
    
    usageHistory: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
      },
      cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
      },
      discountAmount: {
        type: Number,
        required: true,
        min: 0
      },
      orderAmount: {
        type: Number,
        required: true,
        min: 0
      },
      originalOrderAmount: {
        type: Number,
        required: true,
        min: 0
      },
      savings: {
        type: Number,
        required: true,
        min: 0
      },
      usedAt: {
        type: Date,
        default: Date.now
      },
      deviceInfo: {
        platform: {
          type: String,
          enum: ['ios', 'android']
        },
        version: {
          type: String,
          maxlength: 20
        },
        deviceId: {
          type: String,
          maxlength: 255
        },
        appVersion: {
          type: String,
          maxlength: 20
        },
        fcmToken: {
          type: String,
          maxlength: 500
        }
      },
      location: {
        latitude: {
          type: Number,
          min: -90,
          max: 90
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180
        },
        address: {
          type: String,
          maxlength: 500
        },
        city: {
          type: String,
          maxlength: 100
        },
        state: {
          type: String,
          maxlength: 100
        },
        pincode: {
          type: String,
          match: /^\d{6}$/
        },
        landmark: {
          type: String,
          maxlength: 200
        },
        area: {
          type: String,
          maxlength: 100
        }
      },
      paymentMethod: {
        type: String,
        maxlength: 50
      },
      deliveryType: {
        type: String,
        enum: ['standard', 'express', 'scheduled', 'pickup']
      }
    }],
    
    isStackable: {
      type: Boolean,
      default: false
    },
    
    autoApply: {
      type: Boolean,
      default: false,
      index: true
    },
    
    requiresCode: {
      type: Boolean,
      default: true
    },
    
    promotionalText: {
      type: String,
      trim: true,
      maxlength: [200, 'Promotional text cannot exceed 200 characters']
    },
    
    bannerImage: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Banner image must be a valid URL'
      }
    },
    
    iconImage: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Icon image must be a valid URL'
      }
    },
    
    backgroundColor: {
      type: String,
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      default: '#FF6B6B'
    },
    
    textColor: {
      type: String,
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      default: '#FFFFFF'
    },
    
    termsAndConditions: {
      type: String,
      required: [true, 'Terms and conditions are required'],
      trim: true,
      maxlength: [2000, 'Terms and conditions cannot exceed 2000 characters']
    },
    
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true
    },
    
    campaignId: {
      type: String,
      trim: true,
      maxlength: 100,
      index: true
    },
    
    createdBy: {
      type: String,
      required: [true, 'Created by is required'],
      default: 'MarotiKathoke',
      maxlength: [100, 'Created by cannot exceed 100 characters']
    },
    
    updatedBy: {
      type: String,
      required: [true, 'Updated by is required'],
      default: 'MarotiKathoke',
      maxlength: [100, 'Updated by cannot exceed 100 characters']
    },
    
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function(doc: CouponDocument, ret: any) {
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

// ===== INDEXES FOR BLINKIT-STYLE PERFORMANCE =====
CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ status: 1, isActive: 1 });
CouponSchema.index({ startDate: 1, endDate: 1 });
CouponSchema.index({ type: 1, target: 1, trigger: 1 });
CouponSchema.index({ autoApply: 1, status: 1 });
CouponSchema.index({ priority: -1, createdAt: -1 });
CouponSchema.index({ 'usageRestrictions.currentUsage': 1 });
CouponSchema.index({ 'usageRestrictions.applicableLocations': 1 });
CouponSchema.index({ campaignId: 1 });
CouponSchema.index({ name: 'text', description: 'text' });

// TTL index for auto-cleanup of expired coupons
CouponSchema.index({ endDate: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 }); // 7 days after expiry

// ===== VIRTUAL FIELDS - BLINKIT STYLE =====
CouponSchema.virtual('isExpired').get(function(this: CouponDocument) {
  return new Date() > this.endDate;
});

CouponSchema.virtual('daysRemaining').get(function(this: CouponDocument) {
  const now = new Date();
  const diff = this.endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

CouponSchema.virtual('usagePercentage').get(function(this: CouponDocument) {
  return ((this.usageRestrictions.currentUsage / this.usageRestrictions.maxTotalUsage) * 100).toFixed(2);
});

CouponSchema.virtual('isEligibleNow').get(function(this: CouponDocument) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay();
  

  
  // Check time restrictions
  if (this.usageRestrictions.timeRestrictions?.startTime && this.usageRestrictions.timeRestrictions?.endTime) {
    const [startHour, startMin] = this.usageRestrictions.timeRestrictions.startTime.split(':').map(Number);
    const [endHour, endMin] = this.usageRestrictions.timeRestrictions.endTime.split(':').map(Number);
    
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    const startTimeMinutes = startHour * 60 + startMin;
    const endTimeMinutes = endHour * 60 + endMin;
    
    if (currentTimeMinutes < startTimeMinutes || currentTimeMinutes > endTimeMinutes) {
      return false;
    }
  }
  
  return this.isValid();
});

// ===== PRE-SAVE MIDDLEWARE - OPTIMIZED =====
CouponSchema.pre('save', function(this: CouponDocument, next) {
  console.log(`🎫 Processing coupon: ${this.code} by MarotiKathoke`);
  
  // Auto-update status based on dates
  const now = new Date();
  if (now > this.endDate) {
    this.status = 'expired';
  } else if (now >= this.startDate && this.status === 'draft') {
    this.status = 'active';
  } else if (now < this.startDate && this.status === 'active') {
    this.status = 'scheduled';
  }
  
  // Update current usage from history
  this.usageRestrictions.currentUsage = this.usageHistory.length;
  
  // Auto-expire if usage limit reached
  if (this.usageRestrictions.currentUsage >= this.usageRestrictions.maxTotalUsage) {
    this.status = 'expired';
  }
  
  console.log(`✅ Coupon processed: ${this.code}, Status: ${this.status}, Usage: ${this.usageRestrictions.currentUsage}/${this.usageRestrictions.maxTotalUsage}`);
  next();
});

CouponSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  this.set({ updatedAt: new Date(), updatedBy: 'MarotiKathoke' });
  console.log(`🔄 Updating coupon at ${new Date().toISOString()}`);
  next();
});

// ===== INSTANCE METHODS - BLINKIT OPTIMIZED =====
CouponSchema.methods.isValid = function(this: CouponDocument): boolean {
  const now = new Date();
  return (
    this.isActive &&
    this.status === 'active' &&
    now >= this.startDate &&
    now <= this.endDate &&
    this.usageRestrictions.currentUsage < this.usageRestrictions.maxTotalUsage
  );
};

CouponSchema.methods.canBeUsedBy = async function(
  this: CouponDocument,
  userId: string,
  orderAmount: number,
  location?: Location
): Promise<{ valid: boolean; message?: string }> {
  
  // Check if coupon is valid
  if (!this.isValid()) {
    return { valid: false, message: 'Coupon is not valid or has expired' };
  }
  
  // Check if eligible now (time/day restrictions)
  if (!this.isEligibleNow) {
    return { valid: false, message: 'Coupon is not available at this time' };
  }
  
  // Check minimum order amount
  if (orderAmount < this.usageRestrictions.minOrderAmount) {
    return { 
      valid: false, 
      message: `Minimum order of ₹${this.usageRestrictions.minOrderAmount} required` 
    };
  }
  
  // Check maximum order amount
  if (this.usageRestrictions.maxOrderAmount && orderAmount > this.usageRestrictions.maxOrderAmount) {
    return { 
      valid: false, 
      message: `Maximum order amount of ₹${this.usageRestrictions.maxOrderAmount} exceeded` 
    };
  }
  
  // Check user usage limit
  const userUsage = this.usageHistory.filter(usage => 
    usage.userId.toString() === userId
  ).length;
  
  if (userUsage >= this.usageRestrictions.maxUsagePerUser) {
    return { 
      valid: false, 
      message: `You can use this coupon only ${this.usageRestrictions.maxUsagePerUser} time(s)` 
    };
  }
  

  
  return { valid: true };
};

CouponSchema.methods.calculateDiscount = function(
  this: CouponDocument,
  orderAmount: number,
  cartItems?: any[],
  deliveryCharges?: number
): number {
  
  let discountAmount = 0;
  let applicableAmount = orderAmount;
  
  // For delivery-specific discounts
  if (this.discountOn === 'delivery' && deliveryCharges) {
    applicableAmount = deliveryCharges;
  }
  
  switch (this.type) {
    case 'percentage':
      discountAmount = (applicableAmount * this.discountValue) / 100;
      if (this.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, this.maxDiscountAmount);
      }
      break;
      
    case 'fixed':
      discountAmount = Math.min(this.discountValue, applicableAmount);
      break;
      
    case 'free_delivery':
      discountAmount = deliveryCharges || 0;
      break;
      
    case 'cashback':
      // Cashback calculation (can be processed after order completion)
      discountAmount = Math.min(this.discountValue, applicableAmount * 0.1); // Max 10% cashback
      break;
      
    case 'buy_x_get_y':
      // Custom logic for buy X get Y offers (implement based on cart items)
      if (cartItems && cartItems.length > 0) {
        // Example: Buy 2 get 1 free logic
        const eligibleItems = cartItems.filter(item => 
          this.usageRestrictions.applicableProducts?.includes(item.productId) ||
          this.usageRestrictions.applicableCategories?.includes(item.categoryId)
        );
        // Implementation depends on specific offer logic
        discountAmount = 0; // Placeholder
      }
      break;
      
    default:
      discountAmount = 0;
  }
  
  return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
};

CouponSchema.methods.incrementUsage = async function(
  this: CouponDocument,
  userId: string,
  orderId?: string,
  usageData?: Partial<CouponUsage>
): Promise<void> {
  
  const usage: CouponUsage = {
    userId: new Types.ObjectId(userId),
    orderId: orderId ? new Types.ObjectId(orderId) : undefined,
    discountAmount: usageData?.discountAmount || 0,
    orderAmount: usageData?.orderAmount || 0,
    originalOrderAmount: usageData?.originalOrderAmount || usageData?.orderAmount || 0,
    savings: usageData?.savings || usageData?.discountAmount || 0,
    usedAt: new Date(),
    deviceInfo: usageData?.deviceInfo,
    location: usageData?.location,
    paymentMethod: usageData?.paymentMethod,
    deliveryType: usageData?.deliveryType
  };
  
  this.usageHistory.push(usage as any);
  await this.save();
};

CouponSchema.methods.toMobileJSON = function(this: CouponDocument) {
  return {
    id: this._id?.toString(),
    code: this.code,
    name: this.name,
    description: this.description,
    shortDescription: this.shortDescription,
    type: this.type,
    discountValue: this.discountValue,
    maxDiscountAmount: this.maxDiscountAmount,
    discountOn: this.discountOn,
    status: this.status,
    target: this.target,
    trigger: this.trigger,
    startDate: this.startDate.toISOString(),
    endDate: this.endDate.toISOString(),
    usageRestrictions: {
      minOrderAmount: this.usageRestrictions.minOrderAmount,
      maxOrderAmount: this.usageRestrictions.maxOrderAmount,
      maxUsagePerUser: this.usageRestrictions.maxUsagePerUser,
      maxTotalUsage: this.usageRestrictions.maxTotalUsage,
      currentUsage: this.usageRestrictions.currentUsage,
      firstTimeUsersOnly: this.usageRestrictions.firstTimeUsersOnly,
      premiumUsersOnly: this.usageRestrictions.premiumUsersOnly,
      applicableLocations: this.usageRestrictions.applicableLocations
    },
    isStackable: this.isStackable,
    autoApply: this.autoApply,
    requiresCode: this.requiresCode,
    promotionalText: this.promotionalText,
    bannerImage: this.bannerImage,
    iconImage: this.iconImage,
    backgroundColor: this.backgroundColor,
    textColor: this.textColor,
    termsAndConditions: this.termsAndConditions,
    priority: this.priority,
    isExpired: this.isExpired,
    daysRemaining: this.daysRemaining,
    usagePercentage: this.usagePercentage,
    isEligibleNow: this.isEligibleNow,
    createdAt: this.createdAt.toISOString(),
    updatedAt: this.updatedAt.toISOString()
  };
};

CouponSchema.methods.toBannerJSON = function(this: CouponDocument) {
  return {
    id: this._id?.toString(),
    code: this.code,
    name: this.name,
    shortDescription: this.shortDescription || this.description,
    type: this.type,
    discountValue: this.discountValue,
    promotionalText: this.promotionalText,
    bannerImage: this.bannerImage,
    iconImage: this.iconImage,
    backgroundColor: this.backgroundColor,
    textColor: this.textColor,
    minOrderAmount: this.usageRestrictions.minOrderAmount,
    priority: this.priority,
    daysRemaining: this.daysRemaining,
    autoApply: this.autoApply
  };
};

// ===== STATIC METHODS - BLINKIT OPTIMIZED =====
CouponSchema.statics.findValidCoupons = function(userId?: string, orderAmount?: number, location?: Location) {
  const query: any = {
    isActive: true,
    status: 'active',
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  };
  
  if (orderAmount) {
    query['usageRestrictions.minOrderAmount'] = { $lte: orderAmount };
  }
  
  if (location?.pincode) {
    query.$or = [
      { 'usageRestrictions.applicableLocations': { $size: 0 } },
      { 'usageRestrictions.applicableLocations': location.pincode }
    ];
  }
  
  return this.find(query).sort({ priority: -1, discountValue: -1 });
};

CouponSchema.statics.findByCode = function(code: string) {
  return this.findOne({ code: code.toUpperCase(), isActive: true });
};

CouponSchema.statics.getActiveCoupons = function(target?: CouponTarget) {
  const query: any = {
    isActive: true,
    status: 'active',
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  };
  
  if (target) {
    query.target = target;
  }
  
  return this.find(query).sort({ priority: -1, createdAt: -1 });
};

CouponSchema.statics.getAutoApplyCoupons = function(userId: string, orderAmount: number, location?: Location) {
  const query: any = {
    isActive: true,
    status: 'active',
    autoApply: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
    'usageRestrictions.minOrderAmount': { $lte: orderAmount }
  };
  
  if (location?.pincode) {
    query.$or = [
      { 'usageRestrictions.applicableLocations': { $size: 0 } },
      { 'usageRestrictions.applicableLocations': location.pincode }
    ];
  }
  
  return this.find(query).sort({ priority: -1, discountValue: -1 });
};


CouponSchema.statics.getPromotionalCoupons = function(limit: number = 10) {
  return this.find({
    isActive: true,
    status: 'active',
    bannerImage: { $exists: true, $ne: null },
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  })
  .sort({ priority: -1, createdAt: -1 })
  .limit(limit);
};

CouponSchema.statics.getCouponsByLocation = function(pincode: string) {
  return this.find({
    isActive: true,
    status: 'active',
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
    $or: [
      { 'usageRestrictions.applicableLocations': { $size: 0 } },
      { 'usageRestrictions.applicableLocations': pincode }
    ]
  }).sort({ priority: -1, discountValue: -1 });
};

CouponSchema.statics.cleanupExpiredCoupons = async function() {
  const result = await this.updateMany(
    {
      $or: [
        { endDate: { $lt: new Date() } },
        { 'usageRestrictions.currentUsage': { $gte: '$usageRestrictions.maxTotalUsage' } }
      ],
      status: { $ne: 'expired' }
    },
    {
      $set: { status: 'expired', updatedAt: new Date(), updatedBy: 'System' }
    }
  );
  
  console.log(`🧹 Marked ${result.modifiedCount} coupons as expired by MarotiKathoke`);
  return result.modifiedCount;
};

CouponSchema.statics.getCouponAnalytics = async function(startDate?: Date, endDate?: Date) {
  const matchStage: any = {};
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = startDate;
    if (endDate) matchStage.createdAt.$lte = endDate;
  }
  
  const analytics = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalCoupons: { $sum: 1 },
        activeCoupons: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        expiredCoupons: {
          $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] }
        },
        autoApplyCoupons: {
          $sum: { $cond: ['$autoApply', 1, 0] }
        },
        totalUsage: { $sum: '$usageRestrictions.currentUsage' },
        avgDiscountValue: { $avg: '$discountValue' },
        totalSavings: { $sum: { $sum: '$usageHistory.savings' } }
      }
    }
  ]);
  
  return analytics[0] || {
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    autoApplyCoupons: 0,
    totalUsage: 0,
    avgDiscountValue: 0,
    totalSavings: 0
  };
};

// Apply pagination plugin
CouponSchema.plugin(mongoosePaginate);


export const  CouponModel = mongoose.model<CouponDocument, CouponModelInterface>('Coupon', CouponSchema)