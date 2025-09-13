import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type ValidUnit = 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen';

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  categoryId: mongoose.Types.ObjectId;
  sku: string;
  images: string[];
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  inStock: boolean;
  brand?: string;
  unit: ValidUnit;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface IProduct {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  categoryId: mongoose.Types.ObjectId;
  sku: string;
  images: string[];
  quantity: number;
  isActive: boolean;
  isFeatured: boolean;
  inStock: boolean;
  brand?: string;
  unit: ValidUnit;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: {    type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true,
      index: true,sparse: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0, index: true },
    compareAtPrice: { type: Number, min: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    sku: { type: String, required: false  },
    images: { type: [String], default: [] },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    inStock: { type: Boolean, default: true, index: true },
    brand: { type: String, trim: true, index: true },
    unit: { type: String, required: true, enum: ['piece', 'kg', 'gm', 'litre', 'ml', 'pack', 'dozen'] },
    user: { type: String, required: true, default: 'MarotiKathoke' },
  },
  { timestamps: true, versionKey: false }
);

// ProductSchema.index({ name: 'text', sku: 'text', brand: 'text' });
// ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });
ProductSchema.pre('save', function (next) {
  this.inStock = this.quantity > 0;
  next();
});



// Apply the pagination plugin
ProductSchema.plugin(mongoosePaginate);

// Cast the model to the PaginateModel interface
const ProductModel = mongoose.model<ProductDocument, PaginateModel<ProductDocument>>('Product', ProductSchema);
ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });
export default ProductModel;