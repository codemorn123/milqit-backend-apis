import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Category base interface (without the MongoDB document stuff)
export interface ICategory {
  name: string;
  description?: string;
  image: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  parentId?: mongoose.Types.ObjectId | null;
  metaTitle?: string;
  metaDescription?: string;
  icon?: string;
  bannerImage?: string;
  backgroundColor?: string;
  textColor?: string;
  deepLink?: string;
  createdBy?: string;
  updatedBy?: string;
}

// Document interface with MongoDB fields
export interface ICategoryDocument extends ICategory, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the paginate model type
export interface CategoryModel extends PaginateModel<ICategoryDocument> {}

// Create category schema
const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true,
      index: true
    },
    description: { 
      type: String, 
      trim: true
    },
    image: { 
      type: String, 
      required: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true
    },
    metaTitle: {
      type: String,
      trim: true
    },
    metaDescription: {
      type: String,
      trim: true
    },
    icon: {
      type: String
    },
    bannerImage: {
      type: String
    },
    backgroundColor: {
      type: String,
      default: "#FFFFFF"
    },
    textColor: {
      type: String,
      default: "#000000"
    },
    deepLink: {
      type: String
    },
    createdBy: {
      type: String
    },
    updatedBy: {
      type: String
    }
  },
  { 
    timestamps: true 
  }
);

// Add text search index
CategorySchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 } }
);

// Add plugin for pagination
CategorySchema.plugin(mongoosePaginate);

// Create and export model
export const CategoryModel = mongoose.model<ICategoryDocument, CategoryModel>('Category', CategorySchema);