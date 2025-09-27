import mongoose, { Schema, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBase } from './base';
import slugify from 'slugify';

export interface ICategory {
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  parentId?: mongoose.Types.ObjectId | null;
  icon?: string;

  backgroundColor?: string;
  deepLink?: string;

  bannerImage?: {
    url: string;
    key: string;
  };

  categoryImage?: {
    url: string;
    key: string;
  };
}


export interface ICategoryDocument extends  IBase  {
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  parentId?: mongoose.Types.ObjectId | null;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  deepLink?: string;
  categoryImage?: {
    url: string;
    key: string;
  };

  bannerImage?: {
    url: string;
    key: string;
  };

}


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
   
    categoryImage: {
      url: { type: String },
      key: { type: String },
  
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
  
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true
    },

    icon: {
      type: String
    },
   bannerImage: {
     url: { type: String },
     key: { type: String },
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
    
  },
  { 
    timestamps: true ,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        
      },
    },
  }
);


CategorySchema.pre('save', function(next) {
  // Only generate a new slug if the name has changed or if it's a new document
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, {
      lower: true,    // convert to lower case
      strict: true,   // remove special characters
      trim: true      // trim leading/trailing spaces
    });
  }
  next();
});

CategorySchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 } }
);

CategorySchema.plugin(mongoosePaginate);


export const CategoryModel = mongoose.model<ICategoryDocument, CategoryModel>('Category', CategorySchema);