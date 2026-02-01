import mongoose, { Schema, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import slugify from 'slugify';
import { ICategoryDocument } from '../types/category.types';
import { CommonEnums } from '../enums/common.enums';
import { createSchemaOptions } from '../utils/schema.helpers';

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: [CommonEnums.status.ACTIVE, CommonEnums.status.INACTIVE, CommonEnums.status.DEACTIVE],
      default: CommonEnums.status.ACTIVE,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    icon: {
      type: String,
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF',
    },
    textColor: {
      type: String,
      default: '#000000',
    },
    deepLink: {
      type: String,
    },
    categoryImage: {
      url: { type: String },
      key: { type: String },
    },
    bannerImage: {
      url: { type: String },
      key: { type: String },
    },
  },
  createSchemaOptions()
);

// Pre-save hook to handle slug generation and status synchronization
CategorySchema.pre('save', function (next) {
  // Slug generation
  if (this.isModified('name') || this.isNew) {
    if (!this.slug || this.isModified('name')) { // Only regenerate if slug is missing or name changed
      this.slug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }
  }

  // Sync isActive with status if status is modified
  if (this.isModified('status')) {
    this.isActive = this.status === CommonEnums.status.ACTIVE;
  }
  // Sync status with isActive if isActive is modified (and status wasn't)
  else if (this.isModified('isActive')) {
    this.status = this.isActive ? CommonEnums.status.ACTIVE : CommonEnums.status.INACTIVE;
  }

  next();
});

CategorySchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 } }
);

CategorySchema.plugin(mongoosePaginate);

export const CategoryModel = mongoose.model<ICategoryDocument, PaginateModel<ICategoryDocument>>(
  'Category',
  CategorySchema
);

export default CategoryModel;