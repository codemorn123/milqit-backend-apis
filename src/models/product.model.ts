// import { IcommonImage } from './../types/common.types';
// import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
// import mongoosePaginate from 'mongoose-paginate-v2';
// import { IBase } from './base';
// import slugify from 'slugify';

// export type ValidUnit = 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen';


// export interface IProduct {
//   name: string;
//   slug: string;
//   description?: string;
//   price: number;
//   compareAtPrice?: number;
//   category: mongoose.Types.ObjectId;
//   sku: string;
//   images: IcommonImage[];
//   quantity: number;
//   isActive: boolean;
//   isFeatured: boolean;
//   inStock: boolean;
//   brand?: string;
//   unit: ValidUnit;

//   productType: 'Food' | 'Electronics' | 'Apparel' | 'General';
//   productDetails: object; // This will hold the dynamic data
//   averageRating: number;
//   reviewCount: number;
//   createdAt?: Date;
//   updatedAt?: Date;
// }



// export interface ProductDocument extends IBase {
//   name: string;
//   slug: string;
//   description?: string;
//   price: number;
//   compareAtPrice?: number;
//   category: mongoose.Types.ObjectId;
//   images?: IcommonImage[];
//   sku: string;
//   mrp: number; // Maximum Retail Price
//   sellingPrice: number;

//   stock: number;
//   quantity: number;
//   isActive: boolean;
//   isFeatured: boolean;
//   inStock: boolean;
//   brand?: string;
//   unit: ValidUnit;
//   productType: 'Food' | 'Electronics' | 'Apparel' | 'General';
//   productDetails: object; // This will hold the dynamic data

//   averageRating: number;
//   reviewCount: number;
//   createdAt: Date;
//   updatedAt: Date;
// }


// const FoodProductDetailsSchema = new Schema({
//   fssaiLicenceNumber: { type: String, trim: true },
//   isVegetarian: { type: Boolean, default: true },
//   shelfLife: { type: String, trim: true }, // e.g., "3 Days", "6 Months"
//   keyFeatures: [{ type: String }],
// }, { _id: false });

// // Schema for Electronics-specific details
// const ElectronicsProductDetailsSchema = new Schema({
//   modelNumber: { type: String, trim: true },
//   warranty: { type: String, trim: true }, // e.g., "1 Year Manufacturer Warranty"
//   specifications: [{
//     key: String,
//     value: String,
//   }],
// }, { _id: false });




// const ProductSchema = new Schema<ProductDocument>(
//   {
//     name: { type: String, required: true, trim: true, index: true },
//     slug: { 
//       type: String, 
//       required: true, 
//       unique: true,
//       trim: true,
//       lowercase: true,
//       index: true
//     },
//     description: { type: String, trim: true },
//     price: { type: Number, required: true, min: 0, index: true },
//     compareAtPrice: { type: Number, min: 0 },
//     category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
//     sku: { type: String, required: false },
//     quantity: { type: Number, required: true, default: 0, min: 0 },
//     isActive: { type: Boolean, default: true, index: true },


//     isFeatured: {
//       type: Boolean,
//       default: false,
//       index: true
//     },
//     inStock: { type: Boolean, default: true, index: true },
//     brand: { type: String, trim: true, index: true },

//     images: [{
//       url: { type: String, required: true },
//       key: { type: String, required: true },
//     }],

//     // --- Pricing ---
//     mrp: {
//       type: Number,
//       required: true,
//       min: 0
//     },


//     // --- Inventory ---
//     stock: {
//       type: Number,
//       required: true,
//       default: 0,
//       min: 0
//     },

//     averageRating: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5
//     },
//     reviewCount: {
//       type: Number,
//       default: 0,
//       min: 0
//     },

//     productType: {
//       type: String,
//       required: true,
//       enum: ['Food', 'Electronics', 'Apparel', 'General'],
//     },

//      productDetails: {
//       type: Object,
//       required: true,
//     },

//     unit: { type: String, required: true, enum: ['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen'] },

//   },
//   {
//     timestamps: true, versionKey: false, toJSON: {
//       virtuals: true,
//       transform: (_, ret: any) => {
//         delete ret._id;
//         delete ret.__v;
//       },
//     },
//   }
// );

// // ProductSchema.index({ name: 'text', sku: 'text', brand: 'text' });
// // ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });
// // ProductSchema.pre('save', function (next) {
// //   this.inStock = this.quantity > 0;
// //   next();
// // });

// ProductSchema.pre('save', function(next) {
//   this.inStock = this.quantity > 0;
//   if (this.isModified('name') || this.isNew) {
//     this.slug = slugify(this.name, {
//       lower: true,    // convert to lower case
//       strict: true,   // remove special characters
//       trim: true      // trim leading/trailing spaces
//     });
//   }
//   next();
// });


// ProductSchema.index(
//   { name: 'text', description: 'text', brand: 'text', tags: 'text', category: 'text' },
//   { weights: { name: 10, brand: 8, tags: 5, description: 2 } }
// );
// ProductSchema.index({ sku: 1 }, { unique: true, sparse: true })


// // Apply the pagination plugin
// ProductSchema.plugin(mongoosePaginate);

// // Cast the model to the PaginateModel interface
// export const ProductModel = mongoose.model<ProductDocument, PaginateModel<ProductDocument>>('Product', ProductSchema);


// ProductModel.discriminator('Food', new Schema({ productDetails: FoodProductDetailsSchema }));
// ProductModel.discriminator('Electronics', new Schema({ productDetails: ElectronicsProductDetailsSchema }));
// // export default ProductModel;



import { IcommonImage } from './../types/common.types';
import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBase } from './base';
import slugify from 'slugify';

export type ValidUnit = 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen';
export type ProductType = 'Food' | 'Electronics' | 'Apparel' | 'General';

// Define specific interfaces for product details
export interface IFoodProductDetails {
  fssaiLicenceNumber?: string;
  isVegetarian?: boolean;
  shelfLife?: string; // e.g., "3 Days", "6 Months"
  keyFeatures?: string[];
}

export interface IElectronicsProductDetails {
  modelNumber?: string;
  warranty?: string; // e.g., "1 Year Manufacturer Warranty"
  specifications?: Array<{
    key: string;
    value: string;
  }>;
}

export interface IApparelProductDetails {
  size?: string[];
  color?: string[];
  material?: string;
  careInstructions?: string[];
}

export interface IGeneralProductDetails {
  [key: string]: any;
}

// Union type for all product details
export type ProductDetails = 
  | IFoodProductDetails 
  | IElectronicsProductDetails 
  | IApparelProductDetails 
  | IGeneralProductDetails;

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  mrp: number; // Maximum Retail Price (original price)
  sellingPrice: number; // Current selling price (discounted price)
  category: mongoose.Types.ObjectId;
  sku: string;
  images?: IcommonImage[];
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  inStock: boolean;
  brand?: string;
  unit: ValidUnit;
  productType: ProductType;
  productDetails: ProductDetails; // Now properly typed
  averageRating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductDocument extends IBase {
  name: string;
  slug: string;
  description?: string;
  mrp: number; // Maximum Retail Price
  sellingPrice: number; // Current selling price
  category: mongoose.Types.ObjectId;
  images?: IcommonImage[];
  sku: string;
  stock: number;
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  inStock: boolean;
  brand?: string;
  unit: ValidUnit;
  productType: ProductType;
  productDetails: ProductDetails; // Now properly typed
  averageRating: number;
  reviewCount: number;
  
  // Virtual fields
  discountPercentage: number;
  savings: number;
  hasDiscount: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// Create Product Request Interface for TSOA
export interface ICreateProductRequest {
  name: string;
  description?: string;
  mrp: number;
  sellingPrice: number;
  unit: ValidUnit;
  category: string;
  quantity: number;
  brand?: string;
  productType: ProductType;
  productDetails: ProductDetails;
  sku?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

const FoodProductDetailsSchema = new Schema({
  fssaiLicenceNumber: { type: String, trim: true },
  isVegetarian: { type: Boolean, default: true },
  shelfLife: { type: String, trim: true },
  keyFeatures: [{ type: String }],
}, { _id: false });

const ElectronicsProductDetailsSchema = new Schema({
  modelNumber: { type: String, trim: true },
  warranty: { type: String, trim: true },
  specifications: [{
    key: String,
    value: String,
  }],
}, { _id: false });

const ApparelProductDetailsSchema = new Schema({
  size: [{ type: String }],
  color: [{ type: String }],
  material: { type: String, trim: true },
  careInstructions: [{ type: String }],
}, { _id: false });

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    description: { type: String, trim: true },
    
    // --- Pricing (Blinkit Style) ---
    mrp: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
      index: true,
      validate: {
        validator: function(this: ProductDocument, value: number) {
          return value <= this.mrp;
        },
        message: 'Selling price cannot be greater than MRP'
      }
    },
    
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    sku: { type: String, required: false },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    inStock: { type: Boolean, default: true, index: true },
    brand: { type: String, trim: true, index: true },

    images: [{
      url: { type: String, required: true },
      key: { type: String, required: true },
    }],

    // --- Inventory ---
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    },

    productType: {
      type: String,
      required: true,
      enum: ['Food', 'Electronics', 'Apparel', 'General'],
    },

    // Changed from Object to Schema.Types.Mixed with proper typing
    productDetails: {
      type: Schema.Types.Mixed,
      required: true,
    },
    
    unit: { 
      type: String, 
      required: true, 
      enum: ['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen'] 
    },
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

// Virtual fields for discount calculations (Blinkit style)
ProductSchema.virtual('discountPercentage').get(function(this: ProductDocument) {
  if (this.mrp <= 0) return 0;
  return Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100);
});

ProductSchema.virtual('savings').get(function(this: ProductDocument) {
  return this.mrp - this.sellingPrice;
});

ProductSchema.virtual('hasDiscount').get(function(this: ProductDocument) {
  return this.sellingPrice < this.mrp;
});

// Pre-save middleware
ProductSchema.pre('save', function(next) {
  this.inStock = this.quantity > 0;
  
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true
    });
  }
  
  next();
});

// Indexes
ProductSchema.index(
  { name: 'text', description: 'text', brand: 'text', category: 'text' },
  { weights: { name: 10, brand: 8, description: 2 } }
);
ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });
ProductSchema.index({ sellingPrice: 1 });
ProductSchema.index({ mrp: 1 });

// Apply the pagination plugin
ProductSchema.plugin(mongoosePaginate);

// Cast the model to the PaginateModel interface
export const ProductModel = mongoose.model<ProductDocument, PaginateModel<ProductDocument>>('Product', ProductSchema);

// Discriminators
ProductModel.discriminator('Food', new Schema({ productDetails: FoodProductDetailsSchema }));
ProductModel.discriminator('Electronics', new Schema({ productDetails: ElectronicsProductDetailsSchema }));
ProductModel.discriminator('Apparel', new Schema({ productDetails: ApparelProductDetailsSchema }));

// Static methods for common queries (Blinkit style)
ProductSchema.statics.findDiscountedProducts = function(minDiscount: number = 10) {
  return this.aggregate([
    {
      $addFields: {
        discountPercentage: {
          $multiply: [
            { $divide: [{ $subtract: ["$mrp", "$sellingPrice"] }, "$mrp"] },
            100
          ]
        }
      }
    },
    {
      $match: {
        discountPercentage: { $gte: minDiscount },
        isActive: true,
        inStock: true
      }
    }
  ]);
};

ProductSchema.statics.findByPriceRange = function(minPrice: number, maxPrice: number) {
  return this.find({
    sellingPrice: { $gte: minPrice, $lte: maxPrice },
    isActive: true,
    inStock: true
  });
};

export default ProductModel;