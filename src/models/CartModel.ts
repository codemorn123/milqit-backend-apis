// // import mongoose, { Schema, Document, PaginateModel, Types } from 'mongoose';
// // import mongoosePaginate from 'mongoose-paginate-v2';
// // import { ValidUnit } from './product.model';
// // import { IcommonImage } from './../types/common.types';

// // export type CartStatus = 'active' | 'checkout' | 'completed' | 'abandoned';
// // export type DeliveryType = 'standard' | 'express' | 'scheduled' | 'pickup';

// // /**
// //  * Cart Item interface for individual products in cart
// //  * @author MarotiKathoke
// //  * @created 2025-09-13 15:46:39
// //  */
// // export interface ICartItem {
// //   productId: Types.ObjectId;
// //   name: string;
// //   slug: string;
// //   price: number;
// //   compareAtPrice?: number;
// //   quantity: number;
// //   unit: ValidUnit;
// //   images: IcommonImage[];
// //   brand?: string;
// //   categoryId: Types.ObjectId;
// //   sku: string;
// //   isAvailable: boolean;
// //   maxQuantity: number;
// //   subtotal: number;
// //   discount: number;
// //   finalPrice: number;
// // }

// // /**
// //  * Device Info interface for mobile tracking
// //  * @author MarotiKathoke
// //  * @created 2025-09-13 15:46:39
// //  */
// // export interface IDeviceInfo {
// //   platform: 'ios' | 'android';
// //   version: string;
// //   deviceId: string;
// // }


// // export interface ILocation {
// //   latitude: number;
// //   longitude: number;
// //   address: string;
// // }

// // /**
// //  * Base Cart interface without Document methods
// //  * @author MarotiKathoke
// //  * @created 2025-09-13 15:46:39
// //  */
// // export interface ICart {
// //   userId: Types.ObjectId;
// //   sessionId?: string;
// //   items: ICartItem[];
// //   totalItems: number;
// //   subtotal: number;
// //   discount: number;
// //   deliveryCharges: number;
// //   taxes: number;
// //   totalAmount: number;
// //   savings: number;
// //   status: CartStatus;
// //   deliveryType: DeliveryType;
// //   deliveryAddress?: Types.ObjectId;
// //   scheduledDelivery?: Date;
// //   estimatedDelivery?: Date;
// //   appliedCoupons: string[];
// //   notes?: string;
// //   deviceInfo?: IDeviceInfo;
// //   location?: ILocation;
// //   isActive: boolean;
// //   expiresAt: Date;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // /**
// //  * Cart Document interface extending Mongoose Document
// //  * @author MarotiKathoke
// //  * @created 2025-09-13 15:46:39
// //  */
// // export interface CartDocument extends ICart ,Document {
// //   // Additional instance methods can be added here
// //   _id: mongoose.Types.ObjectId;
// //   createdAt: Date;
// //   updatedAt: Date;
// //   calculateTotals(): void;
// // }





// // export interface CartModel extends PaginateModel<CartDocument> {
// //       findActiveCart(userId: string): Promise<CartDocument | null>;
// //   cleanupExpiredCarts(): Promise<number>;
// // }
// // /**
// //  * Enhanced Cart Schema with proper TypeScript support
// //  * @author MarotiKathoke
// //  * @created 2025-09-13 15:46:39
// //  */
// // const CartSchema = new Schema<CartDocument>(
// //   {
// //     userId: { 
// //       type: Schema.Types.ObjectId, 
// //       ref: 'User', 
// //       required: [true, 'User ID is required'],
// //       index: true 
// //     },
    
// //     sessionId: { 
// //       type: String, 
// //       index: true,
// //       sparse: true,
// //       maxlength: [255, 'Session ID cannot exceed 255 characters']
// //     },
    
// //     items: [{
// //       productId: { 
// //         type: Schema.Types.ObjectId, 
// //         ref: 'Product', 
// //         required: [true, 'Product ID is required']
// //       },
// //       name: { 
// //         type: String, 
// //         required: [true, 'Product name is required'],
// //         trim: true,
// //         maxlength: [200, 'Product name cannot exceed 200 characters']
// //       },
// //       slug: { 
// //         type: String, 
// //         required: [true, 'Product slug is required'],
// //         maxlength: [250, 'Product slug cannot exceed 250 characters']
// //       },
// //       price: { 
// //         type: Number, 
// //         required: [true, 'Product price is required'],
// //         min: [0, 'Price cannot be negative']
// //       },
// //       compareAtPrice: { 
// //         type: Number, 
// //         min: [0, 'Compare at price cannot be negative']
// //       },
// //       quantity: { 
// //         type: Number, 
// //         required: [true, 'Quantity is required'],
// //         min: [1, 'Quantity must be at least 1'], 
// //         max: [50, 'Maximum 50 items allowed per product'],
// //         validate: {
// //           validator: Number.isInteger,
// //           message: 'Quantity must be an integer'
// //         }
// //       },
// //       unit: { 
// //         type: String, 
// //         required: [true, 'Unit is required'],
// //         enum: {
// //           values: ['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen', 'bundle'],
// //           message: 'Unit must be one of: piece, kg, gm, litre, ml, pack, dozen, bundle'
// //         }
// //       },
// //       images: [{ 
// //         type: String,
// //         validate: {
// //           validator: function(v: string) {
// //             return /^https?:\/\/.+/.test(v);
// //           },
// //           message: 'Image must be a valid URL'
// //         }
// //       }],
// //       brand: { 
// //         type: String, 
// //         trim: true,
// //         maxlength: [100, 'Brand name cannot exceed 100 characters']
// //       },
// //       categoryId: { 
// //         type: Schema.Types.ObjectId, 
// //         ref: 'Category', 
// //         required: [true, 'Category ID is required']
// //       },
// //       sku: { 
// //         type: String, 
// //         required: [true, 'SKU is required'],
// //         maxlength: [50, 'SKU cannot exceed 50 characters']
// //       },
// //       isAvailable: { 
// //         type: Boolean, 
// //         default: true 
// //       },
// //       maxQuantity: { 
// //         type: Number, 
// //         default: 10, 
// //         min: [1, 'Max quantity must be at least 1']
// //       },
// //       subtotal: { 
// //         type: Number, 
// //         required: [true, 'Subtotal is required'],
// //         min: [0, 'Subtotal cannot be negative']
// //       },
// //       discount: { 
// //         type: Number, 
// //         default: 0, 
// //         min: [0, 'Discount cannot be negative']
// //       },
// //       finalPrice: { 
// //         type: Number, 
// //         required: [true, 'Final price is required'],
// //         min: [0, 'Final price cannot be negative']
// //       }
// //     }],
    
// //     totalItems: { 
// //       type: Number, 
// //       default: 0, 
// //       min: [0, 'Total items cannot be negative'],
// //       validate: {
// //         validator: Number.isInteger,
// //         message: 'Total items must be an integer'
// //       }
// //     },
    
// //     subtotal: { 
// //       type: Number, 
// //       default: 0, 
// //       min: [0, 'Subtotal cannot be negative']
// //     },
    
// //     discount: { 
// //       type: Number, 
// //       default: 0, 
// //       min: [0, 'Discount cannot be negative']
// //     },
    
// //     deliveryCharges: { 
// //       type: Number, 
// //       default: 0, 
// //       min: [0, 'Delivery charges cannot be negative']
// //     },
    
// //     taxes: { 
// //       type: Number, 
// //       default: 0, 
// //       min: [0, 'Taxes cannot be negative']
// //     },
    
// //     totalAmount: { 
// //       type: Number, 
// //       default: 0, 
// //       min: [0, 'Total amount cannot be negative']
// //     },
    
// //     savings: { 
// //       type: Number, 
// //       default: 0, 
// //       min: [0, 'Savings cannot be negative']
// //     },
    
// //     status: { 
// //       type: String, 
// //       enum: {
// //         values: ['active', 'checkout', 'completed', 'abandoned'],
// //         message: 'Status must be one of: active, checkout, completed, abandoned'
// //       },
// //       default: 'active',
// //       index: true 
// //     },
    
// //     deliveryType: { 
// //       type: String, 
// //       enum: {
// //         values: ['standard', 'express', 'scheduled', 'pickup'],
// //         message: 'Delivery type must be one of: standard, express, scheduled, pickup'
// //       },
// //       default: 'standard' 
// //     },
    
// //     deliveryAddress: { 
// //       type: Schema.Types.ObjectId, 
// //       ref: 'Address',
// //       index: true 
// //     },
    
// //     scheduledDelivery: { 
// //       type: Date,
// //       validate: {
// //         validator: function(this: CartDocument, v: Date) {
// //           return !v || v > new Date();
// //         },
// //         message: 'Scheduled delivery must be in the future'
// //       }
// //     },
    
// //     estimatedDelivery: { 
// //       type: Date 
// //     },
    
// //     appliedCoupons: [{ 
// //       type: String, 
// //       trim: true,
// //       uppercase: true,
// //       maxlength: [50, 'Coupon code cannot exceed 50 characters']
// //     }],
    
// //     notes: { 
// //       type: String, 
// //       trim: true,
// //       maxlength: [500, 'Notes cannot exceed 500 characters']
// //     },
    
// //     deviceInfo: {
// //       platform: { 
// //         type: String, 
// //         enum: {
// //           values: ['ios', 'android'],
// //           message: 'Platform must be either ios or android'
// //         }
// //       },
// //       version: { 
// //         type: String, 
// //         maxlength: [20, 'Version cannot exceed 20 characters']
// //       },
// //       deviceId: { 
// //         type: String, 
// //         maxlength: [255, 'Device ID cannot exceed 255 characters']
// //       }
// //     },
    
// //     location: {
// //       latitude: { 
// //         type: Number, 
// //         min: [-90, 'Latitude must be between -90 and 90'],
// //         max: [90, 'Latitude must be between -90 and 90']
// //       },
// //       longitude: { 
// //         type: Number, 
// //         min: [-180, 'Longitude must be between -180 and 180'],
// //         max: [180, 'Longitude must be between -180 and 180']
// //       },
// //       address: { 
// //         type: String, 
// //         maxlength: [500, 'Address cannot exceed 500 characters']
// //       }
// //     },
    
// //     isActive: { 
// //       type: Boolean, 
// //       default: true, 
// //       index: true 
// //     },
    
// //     expiresAt: { 
// //       type: Date, 
// //       default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
// //       index: { expireAfterSeconds: 0 }
// //     }
// //   },
// //   { 
// //     timestamps: true, 
// //     versionKey: false,
// //     toJSON: { 
// //       virtuals: true,
// //       transform: function(doc: CartDocument, ret: any) {
// //         delete ret._id;
// //         delete ret.__v;
// //         ret.id = doc._id?.toString();
// //         return ret;
// //       }
// //     },
// //     toObject: { 
// //       virtuals: true 
// //     }
// //   }
// // );

// // // ===== INDEXES FOR MOBILE PERFORMANCE =====
// // CartSchema.index({ userId: 1, status: 1 });
// // CartSchema.index({ sessionId: 1, status: 1 });
// // CartSchema.index({ createdAt: -1 });
// // CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// // CartSchema.index({ 'deviceInfo.deviceId': 1 });

// // // ===== VIRTUAL FIELDS =====
// // CartSchema.virtual('itemCount').get(function(this: CartDocument) {
// //   return this.items?.length || 0;
// // });

// // CartSchema.virtual('hasItems').get(function(this: CartDocument) {
// //   return this.items && this.items.length > 0;
// // });

// // // ===== PRE-SAVE MIDDLEWARE =====
// // CartSchema.pre('save', function(this: CartDocument, next) {
// //   console.log(`📦 Processing cart for user: ${this.userId} by MarotiKathoke`);
  
// //   // Calculate totals
// //   this.calculateTotals();
  
// //   // Reset expiry for active carts with items
// //   if (this.status === 'active' && this.items.length > 0) {
// //     this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
// //   }
  
// //   console.log(`✅ Cart processed: ${this.totalItems} items, ₹${this.totalAmount}`);
// //   next();
// // });

// // CartSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
// //   this.set({ updatedAt: new Date() });
// //   console.log(`🔄 Updating cart at ${new Date().toISOString()}`);
// //   next();
// // });

// // // ===== INSTANCE METHODS =====
// // CartSchema.methods.toMobileJSON = function(this: CartDocument) {
// //   return {
// //     id: this._id?.toString(),
// //     userId: this.userId,
// //     totalItems: this.totalItems,
// //     subtotal: this.subtotal,
// //     discount: this.discount,
// //     deliveryCharges: this.deliveryCharges,
// //     taxes: this.taxes,
// //     totalAmount: this.totalAmount,
// //     savings: this.savings,
// //     status: this.status,
// //     deliveryType: this.deliveryType,
// //     estimatedDelivery: this.estimatedDelivery,
// //     appliedCoupons: this.appliedCoupons,
// //     items: this.items.map(item => ({
// //       productId: item.productId.toString(),
// //       name: item.name,
// //       slug: item.slug,
// //       price: item.price,
// //       compareAtPrice: item.compareAtPrice,
// //       quantity: item.quantity,
// //       unit: item.unit,
// //       images: item.images,
// //       brand: item.brand,
// //       sku: item.sku,
// //       isAvailable: item.isAvailable,
// //       maxQuantity: item.maxQuantity,
// //       subtotal: item.subtotal,
// //       discount: item.discount,
// //       finalPrice: item.finalPrice
// //     })),
// //     createdAt: this.createdAt,
// //     updatedAt: this.updatedAt
// //   };
// // };

// // CartSchema.methods.calculateTotals = function(this: CartDocument) {
// //   this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
// //   this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
// //   this.savings = this.items.reduce((sum, item) => sum + item.discount, 0);
// //   this.totalAmount = this.subtotal - this.discount + this.deliveryCharges + this.taxes;
// // };

// // // ===== STATIC METHODS =====
// // CartSchema.statics.findActiveCart = function(userId: string) {
// //   return this.findOne({ userId, status: 'active' });
// // };

// // CartSchema.statics.cleanupExpiredCarts = async function() {
// //   const result = await this.deleteMany({
// //     status: 'abandoned',
// //     expiresAt: { $lt: new Date() }
// //   });
// //   console.log(`🧹 Cleaned up ${result.deletedCount} expired carts`);
// //   return result.deletedCount;
// // };

// // // Apply pagination plugin
// // CartSchema.plugin(mongoosePaginate);


// // export const CartModelClass = mongoose.model<CartDocument, CartModel>('Cart', CartSchema);








// import mongoose, { Schema, Document, PaginateModel, Types } from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2';
// import { ValidUnit } from './product.model';
// import { IcommonImage } from './../types/common.types';

// export type OrderStatus = 
//   | 'pending' 
//   | 'confirmed' 
//   | 'processing' 
//   | 'packed' 
//   | 'shipped' 
//   | 'out_for_delivery' 
//   | 'delivered' 
//   | 'cancelled' 
//   | 'refunded' 
//   | 'failed';

// export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
// export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking' | 'wallet';
// export type DeliveryType = 'standard' | 'express' | 'scheduled' | 'pickup';

// /**
//  * Order Item interface for individual products in order
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface IOrderItem {
//   productId: Types.ObjectId;
//   name: string;
//   slug: string;
//   price: number;
//   compareAtPrice?: number;
//   quantity: number;
//   unit: ValidUnit;
//   images: IcommonImage[];
//   brand?: string;
//   categoryId: Types.ObjectId;
//   sku: string;
//   subtotal: number;
//   discount: number;
//   finalPrice: number;
//   tax: number;
// }

// /**
//  * Delivery Address interface
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface IDeliveryAddress {
//   fullName: string;
//   phone: string;
//   email?: string;
//   addressLine1: string;
//   addressLine2?: string;
//   landmark?: string;
//   city: string;
//   state: string;
//   pincode: string;
//   country: string;
//   addressType: 'home' | 'work' | 'other';
//   isDefault: boolean;
// }

// /**
//  * Payment Details interface
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface IPaymentDetails {
//   method: PaymentMethod;
//   status: PaymentStatus;
//   transactionId?: string;
//   paymentGateway?: string;
//   paidAmount: number;
//   paymentDate?: Date;
//   refundAmount?: number;
//   refundDate?: Date;
//   refundReason?: string;
// }

// /**
//  * Order Status History interface
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface IOrderStatusHistory {
//   status: OrderStatus;
//   timestamp: Date;
//   comment?: string;
//   updatedBy?: Types.ObjectId;
// }

// /**
//  * Device Info interface for mobile tracking
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface IDeviceInfo {
//   platform: 'ios' | 'android';
//   version: string;
//   deviceId: string;
// }

// /**
//  * Location interface
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface ILocation {
//   latitude: number;
//   longitude: number;
//   address: string;
// }

// /**
//  * Base Order interface without Document methods
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface IOrder {
//   userId: Types.ObjectId;
//   orderNumber: string;
//   items: IOrderItem[];
//   totalItems: number;
//   subtotal: number;
//   discount: number;
//   deliveryCharges: number;
//   taxes: number;
//   totalAmount: number;
//   savings: number;
//   status: OrderStatus;
//   paymentDetails: IPaymentDetails;
//   deliveryAddress: IDeliveryAddress;
//   deliveryType: DeliveryType;
//   scheduledDelivery?: Date;
//   estimatedDelivery?: Date;
//   actualDelivery?: Date;
//   appliedCoupons: string[];
//   couponDiscount: number;
//   notes?: string;
//   cancellationReason?: string;
//   statusHistory: IOrderStatusHistory[];
//   deviceInfo?: IDeviceInfo;
//   location?: ILocation;
//   trackingNumber?: string;
//   invoiceUrl?: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// /**
//  * Order Document interface extending Mongoose Document
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface OrderDocument extends IOrder, Document {
//   _id: mongoose.Types.ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
//   calculateTotals(): void;
//   updateStatus(status: OrderStatus, comment?: string, updatedBy?: Types.ObjectId): Promise<void>;
//   canBeCancelled(): boolean;
//   canBeReturned(): boolean;
// }

// /**
//  * Order Model interface with static methods
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// export interface OrderModel extends PaginateModel<OrderDocument> {
//   findByOrderNumber(orderNumber: string): Promise<OrderDocument | null>;
//   findUserOrders(userId: string, status?: OrderStatus): Promise<OrderDocument[]>;
//   generateOrderNumber(): Promise<string>;
//   getOrderStats(userId: string): Promise<any>;
// }

// /**
//  * Enhanced Order Schema with proper TypeScript support
//  * @author MarotiKathoke
//  * @created 2025-10-16 11:58:03
//  */
// const OrderSchema = new Schema<OrderDocument>(
//   {
//     userId: { 
//       type: Schema.Types.ObjectId, 
//       ref: 'User', 
//       required: [true, 'User ID is required'],
//       index: true 
//     },
    
//     orderNumber: { 
//       type: String, 
//       required: [true, 'Order number is required'],
//       unique: true,
//       index: true,
//       uppercase: true,
//       trim: true
//     },
    
//     items: [{
//       productId: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'Product', 
//         required: [true, 'Product ID is required']
//       },
//       name: { 
//         type: String, 
//         required: [true, 'Product name is required'],
//         trim: true,
//         maxlength: [200, 'Product name cannot exceed 200 characters']
//       },
//       slug: { 
//         type: String, 
//         required: [true, 'Product slug is required'],
//         maxlength: [250, 'Product slug cannot exceed 250 characters']
//       },
//       price: { 
//         type: Number, 
//         required: [true, 'Product price is required'],
//         min: [0, 'Price cannot be negative']
//       },
//       compareAtPrice: { 
//         type: Number, 
//         min: [0, 'Compare at price cannot be negative']
//       },
//       quantity: { 
//         type: Number, 
//         required: [true, 'Quantity is required'],
//         min: [1, 'Quantity must be at least 1'], 
//         validate: {
//           validator: Number.isInteger,
//           message: 'Quantity must be an integer'
//         }
//       },
//       unit: { 
//         type: String, 
//         required: [true, 'Unit is required'],
//         enum: {
//           values: ['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen'],
//           message: 'Unit must be one of: piece, kg, gm, litre, ml, pack, dozen'
//         }
//       },
//       images: [{
//         url: { type: String, required: true },
//         key: { type: String, required: true },
//       }],
//       brand: { 
//         type: String, 
//         trim: true,
//         maxlength: [100, 'Brand name cannot exceed 100 characters']
//       },
//       categoryId: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'Category', 
//         required: [true, 'Category ID is required']
//       },
//       sku: { 
//         type: String, 
//         required: [true, 'SKU is required'],
//         maxlength: [50, 'SKU cannot exceed 50 characters']
//       },
//       subtotal: { 
//         type: Number, 
//         required: [true, 'Subtotal is required'],
//         min: [0, 'Subtotal cannot be negative']
//       },
//       discount: { 
//         type: Number, 
//         default: 0, 
//         min: [0, 'Discount cannot be negative']
//       },
//       finalPrice: { 
//         type: Number, 
//         required: [true, 'Final price is required'],
//         min: [0, 'Final price cannot be negative']
//       },
//       tax: { 
//         type: Number, 
//         default: 0, 
//         min: [0, 'Tax cannot be negative']
//       }
//     }],
    
//     totalItems: { 
//       type: Number, 
//       default: 0, 
//       min: [0, 'Total items cannot be negative'],
//       validate: {
//         validator: Number.isInteger,
//         message: 'Total items must be an integer'
//       }
//     },
    
//     subtotal: { 
//       type: Number, 
//       default: 0, 
//       min: [0, 'Subtotal cannot be negative']
//     },
    
//     discount: { 
//       type: Number, 
//       default: 0, 
//       min: [0, 'Discount cannot be negative']
//     },
    
//     deliveryCharges: { 
//       type: Number, 
//       default: 0, 
//       min: [0, 'Delivery charges cannot be negative']
//     },
    
//     taxes: { 
//       type: Number, 
//       default: 0, 
//       min: [0, 'Taxes cannot be negative']
//     },
    
//     totalAmount: { 
//       type: Number, 
//       default: 0, 
//       min: [0, 'Total amount cannot be negative']
//     },
    
//     savings: { 
//       type: Number, 
//       default: 0, 
//       min: [0, 'Savings cannot be negative']
//     },
    
//     status: { 
//       type: String, 
//       enum: {
//         values: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'failed'],
//         message: 'Invalid order status'
//       },
//       default: 'pending',
//       index: true 
//     },
    
//     paymentDetails: {
//       method: { 
//         type: String, 
//         required: [true, 'Payment method is required'],
//         enum: {
//           values: ['cod', 'upi', 'card', 'netbanking', 'wallet'],
//           message: 'Invalid payment method'
//         }
//       },
//       status: { 
//         type: String, 
//         required: [true, 'Payment status is required'],
//         enum: {
//           values: ['pending', 'processing', 'completed', 'failed', 'refunded'],
//           message: 'Invalid payment status'
//         },
//         default: 'pending'
//       },
//       transactionId: { 
//         type: String, 
//         trim: true,
//         maxlength: [100, 'Transaction ID cannot exceed 100 characters']
//       },
//       paymentGateway: { 
//         type: String, 
//         trim: true,
//         maxlength: [50, 'Payment gateway cannot exceed 50 characters']
//       },
//       paidAmount: { 
//         type: Number, 
//         required: [true, 'Paid amount is required'],
//         min: [0, 'Paid amount cannot be negative']
//       },
//       paymentDate: { 
//         type: Date 
//       },
//       refundAmount: { 
//         type: Number, 
//         default: 0,
//         min: [0, 'Refund amount cannot be negative']
//       },
//       refundDate: { 
//         type: Date 
//       },
//       refundReason: { 
//         type: String, 
//         trim: true,
//         maxlength: [500, 'Refund reason cannot exceed 500 characters']
//       }
//     },
    
//     deliveryAddress: {
//       fullName: { 
//         type: String, 
//         required: [true, 'Full name is required'],
//         trim: true,
//         maxlength: [100, 'Full name cannot exceed 100 characters']
//       },
//       phone: { 
//         type: String, 
//         required: [true, 'Phone is required'],
//         trim: true,
//         match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
//       },
//       email: { 
//         type: String, 
//         trim: true,
//         lowercase: true,
//         match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
//       },
//       addressLine1: { 
//         type: String, 
//         required: [true, 'Address line 1 is required'],
//         trim: true,
//         maxlength: [200, 'Address line 1 cannot exceed 200 characters']
//       },
//       addressLine2: { 
//         type: String, 
//         trim: true,
//         maxlength: [200, 'Address line 2 cannot exceed 200 characters']
//       },
//       landmark: { 
//         type: String, 
//         trim: true,
//         maxlength: [100, 'Landmark cannot exceed 100 characters']
//       },
//       city: { 
//         type: String, 
//         required: [true, 'City is required'],
//         trim: true,
//         maxlength: [100, 'City cannot exceed 100 characters']
//       },
//       state: { 
//         type: String, 
//         required: [true, 'State is required'],
//         trim: true,
//         maxlength: [100, 'State cannot exceed 100 characters']
//       },
//       pincode: { 
//         type: String, 
//         required: [true, 'Pincode is required'],
//         trim: true,
//         match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
//       },
//       country: { 
//         type: String, 
//         required: [true, 'Country is required'],
//         trim: true,
//         default: 'India',
//         maxlength: [100, 'Country cannot exceed 100 characters']
//       },
//       addressType: { 
//         type: String, 
//         enum: {
//           values: ['home', 'work', 'other'],
//           message: 'Address type must be home, work, or other'
//         },
//         default: 'home'
//       },
//       isDefault: { 
//         type: Boolean, 
//         default: false 
//       }
//     },
    
//     deliveryType: { 
//       type: String, 
//       enum: {
//         values: ['standard', 'express', 'scheduled', 'pickup'],
//         message: 'Invalid delivery type'
//       },
//       default: 'standard' 
//     },
    
//     scheduledDelivery: { 
//       type: Date,
//       validate: {
//         validator: function(this: OrderDocument, v: Date) {
//           return !v || v > new Date();
//         },
//         message: 'Scheduled delivery must be in the future'
//       }
//     },
    
//     estimatedDelivery: { 
//       type: Date 
//     },
    
//     actualDelivery: { 
//       type: Date 
//     },
    
//     appliedCoupons: [{ 
//       type: String, 
//       trim: true,
//       uppercase: true,
//       maxlength: [50, 'Coupon code cannot exceed 50 characters']
//     }],
    
//     couponDiscount: { 
//       type: Number, 
//       default: 0, 
//       min: [0, 'Coupon discount cannot be negative']
//     },
    
//     notes: { 
//       type: String, 
//       trim: true,
//       maxlength: [500, 'Notes cannot exceed 500 characters']
//     },
    
//     cancellationReason: { 
//       type: String, 
//       trim: true,
//       maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
//     },
    
//     statusHistory: [{
//       status: { 
//         type: String, 
//         required: true,
//         enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'failed']
//       },
//       timestamp: { 
//         type: Date, 
//         required: true, 
//         default: Date.now 
//       },
//       comment: { 
//         type: String, 
//         trim: true,
//         maxlength: [500, 'Comment cannot exceed 500 characters']
//       },
//       updatedBy: { 
//         type: Schema.Types.ObjectId, 
//         ref: 'User' 
//       }
//     }],
    
//     deviceInfo: {
//       platform: { 
//         type: String, 
//         enum: {
//           values: ['ios', 'android'],
//           message: 'Platform must be either ios or android'
//         }
//       },
//       version: { 
//         type: String, 
//         maxlength: [20, 'Version cannot exceed 20 characters']
//       },
//       deviceId: { 
//         type: String, 
//         maxlength: [255, 'Device ID cannot exceed 255 characters']
//       }
//     },
    
//     location: {
//       latitude: { 
//         type: Number, 
//         min: [-90, 'Latitude must be between -90 and 90'],
//         max: [90, 'Latitude must be between -90 and 90']
//       },
//       longitude: { 
//         type: Number, 
//         min: [-180, 'Longitude must be between -180 and 180'],
//         max: [180, 'Longitude must be between -180 and 180']
//       },
//       address: { 
//         type: String, 
//         maxlength: [500, 'Address cannot exceed 500 characters']
//       }
//     },
    
//     trackingNumber: { 
//       type: String, 
//       trim: true,
//       maxlength: [100, 'Tracking number cannot exceed 100 characters']
//     },
    
//     invoiceUrl: { 
//       type: String, 
//       trim: true,
//       maxlength: [500, 'Invoice URL cannot exceed 500 characters']
//     },
    
//     isActive: { 
//       type: Boolean, 
//       default: true, 
//       index: true 
//     }
//   },
//   { 
//     timestamps: true, 
//     versionKey: false,
//     toJSON: { 
//       virtuals: true,
//       transform: function(doc: OrderDocument, ret: any) {
//         delete ret._id;
//         delete ret.__v;
//         ret.id = doc._id?.toString();
//         return ret;
//       }
//     },
//     toObject: { 
//       virtuals: true 
//     }
//   }
// );

// // ===== INDEXES FOR PERFORMANCE =====
// OrderSchema.index({ userId: 1, status: 1 });
// OrderSchema.index({ orderNumber: 1 });
// OrderSchema.index({ 'paymentDetails.status': 1 });
// OrderSchema.index({ createdAt: -1 });
// OrderSchema.index({ 'deviceInfo.deviceId': 1 });
// OrderSchema.index({ status: 1, createdAt: -1 });

// // ===== VIRTUAL FIELDS =====
// OrderSchema.virtual('itemCount').get(function(this: OrderDocument) {
//   return this.items?.length || 0;
// });

// OrderSchema.virtual('isPaid').get(function(this: OrderDocument) {
//   return this.paymentDetails.status === 'completed';
// });

// OrderSchema.virtual('isDelivered').get(function(this: OrderDocument) {
//   return this.status === 'delivered';
// });

// OrderSchema.virtual('isCancelled').get(function(this: OrderDocument) {
//   return this.status === 'cancelled';
// });

// // ===== PRE-SAVE MIDDLEWARE =====
// OrderSchema.pre('save', async function(this: OrderDocument, next) {
//   console.log(`📦 Processing order for user: ${this.userId} by MarotiKathoke`);
  
//   // Generate order number if new
//   if (this.isNew && !this.orderNumber) {
//     this.orderNumber = await (this.constructor as OrderModel).generateOrderNumber();
//   }
  
//   // Calculate totals
//   this.calculateTotals();
  
//   // Add to status history if status changed
//   if (this.isModified('status')) {
//     this.statusHistory.push({
//       status: this.status,
//       timestamp: new Date(),
//       comment: undefined,
//       updatedBy: undefined
//     });
//   }
  
//   console.log(`✅ Order processed: ${this.orderNumber}, ${this.totalItems} items, ₹${this.totalAmount}`);
//   next();
// });

// OrderSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
//   this.set({ updatedAt: new Date() });
//   console.log(`🔄 Updating order at ${new Date().toISOString()}`);
//   next();
// });

// // ===== INSTANCE METHODS =====
// OrderSchema.methods.calculateTotals = function(this: OrderDocument) {
//   this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
//   this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
//   this.savings = this.items.reduce((sum, item) => sum + item.discount, 0);
//   this.taxes = this.items.reduce((sum, item) => sum + item.tax, 0);
//   this.totalAmount = this.subtotal - this.discount - this.couponDiscount + this.deliveryCharges + this.taxes;
// };

// OrderSchema.methods.updateStatus = async function(
//   this: OrderDocument, 
//   status: OrderStatus, 
//   comment?: string, 
//   updatedBy?: Types.ObjectId
// ): Promise<void> {
//   this.status = status;
//   this.statusHistory.push({
//     status,
//     timestamp: new Date(),
//     comment,
//     updatedBy
//   });
  
//   // Update delivery date if delivered
//   if (status === 'delivered') {
//     this.actualDelivery = new Date();
//   }
  
//   await this.save();
//   console.log(`📝 Order ${this.orderNumber} status updated to ${status}`);
// };

// OrderSchema.methods.canBeCancelled = function(this: OrderDocument): boolean {
//   const cancellableStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing'];
//   return cancellableStatuses.includes(this.status);
// };

// OrderSchema.methods.canBeReturned = function(this: OrderDocument): boolean {
//   if (this.status !== 'delivered' || !this.actualDelivery) {
//     return false;
//   }
  
//   // Can be returned within 7 days of delivery
//   const daysSinceDelivery = Math.floor((Date.now() - this.actualDelivery.getTime()) / (1000 * 60 * 60 * 24));
//   return daysSinceDelivery <= 7;
// };

// // ===== STATIC METHODS =====
// OrderSchema.statics.findByOrderNumber = function(orderNumber: string) {
//   return this.findOne({ orderNumber: orderNumber.toUpperCase() });
// };

// OrderSchema.statics.findUserOrders = function(userId: string, status?: OrderStatus) {
//   const query: any = { userId };
//   if (status) {
//     query.status = status;
//   }
//   return this.find(query).sort({ createdAt: -1 });
// };

// OrderSchema.statics.generateOrderNumber = async function(): Promise<string> {
//   const prefix = 'ORD';
//   const timestamp = Date.now().toString().slice(-8);
//   const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//   const orderNumber = `${prefix}${timestamp}${random}`;
  
//   // Check if order number already exists
//   const exists = await this.findOne({ orderNumber });
//   if (exists) {
//     return this.generateOrderNumber(); // Recursively generate new number
//   }
  
//   return orderNumber;
// };

// OrderSchema.statics.getOrderStats = async function(userId: string) {
//   const stats = await this.aggregate([
//     { $match: { userId: new Types.ObjectId(userId) } },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 },
//         totalAmount: { $sum: '$totalAmount' }
//       }
//     }
//   ]);
  
//   return {
//     total: stats.reduce((sum, s) => sum + s.count, 0),
//     totalSpent: stats.reduce((sum, s) => sum + s.totalAmount, 0),
//     byStatus: stats.reduce((acc, s) => {
//       acc[s._id] = { count: s.count, amount: s.totalAmount };
//       return acc;
//     }, {} as any)
//   };
// };

// // Apply pagination plugin
// OrderSchema.plugin(mongoosePaginate);

// export const OrderModelClass = mongoose.model<OrderDocument, OrderModel>('Order', OrderSchema);








import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ValidUnit } from './product.model';
import { IcommonImage } from '../types/common.types';

/**
 * Cart Status Types
 */
export type CartStatus = 'active' | 'completed' | 'expired' | 'abandoned';
export type DeliveryType = 'standard' | 'express' | 'scheduled' | 'pickup';

/**
 * Device Information Interface
 */
export interface IDeviceInfo {
  platform: 'ios' | 'android' | 'web' | 'other';
  version: string;
  deviceId: string;
}

/**
 * Location Interface
 */
export interface ILocation {
  latitude: number;
  longitude: number;
  address: string;
}

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
  deviceInfo?: IDeviceInfo;
  location?: ILocation;
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
        maxQuantity: {
          type: Number,
          required: [true, 'Max quantity is required'],
          min: [0, 'Max quantity cannot be negative']
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
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc: ICartDocument, ret: any) {
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

console.log(`✅ CartModel initialized successfully by MarotiKathoke at ${new Date().toISOString()}`);