import mongoose, { Schema, PaginateModel, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBase } from './base';
import ProductModel from './product.model';


export interface IReview {
  rating: number;
  comment?: string;
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

// Interface for the Review document returned by Mongoose
export interface IReviewDocument extends IBase, IReview {}

// Interface for the Review model with statics
export interface IReviewModel extends PaginateModel<IReviewDocument> {
  calculateAverageRating(productId: mongoose.Types.ObjectId): Promise<void>;
}

// Create review schema
const ReviewSchema = new Schema<IReviewDocument>(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'A review must have a rating.'],
    },
    comment: {
      type: String,
      trim: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'A review must belong to a product.'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: [true, 'A review must belong to a user.'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// --- Static Method to Calculate and Update Ratings on Product ---

ReviewSchema.statics.calculateAverageRating = async function (productId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    // If there are reviews, update the product
    await ProductModel.findByIdAndUpdate(productId, {
      reviewCount: stats[0].reviewCount,
      averageRating: stats[0].averageRating,
    });
  } else {
    // If there are no reviews, reset to default
    await ProductModel.findByIdAndUpdate(productId, {
      reviewCount: 0,
      averageRating: 0,
    });
  }
};

// --- Middleware Hooks ---

// Call the calculator after a new review is saved
ReviewSchema.post('save', function (this: IReviewDocument) {
  (this.constructor as IReviewModel).calculateAverageRating(this.product);
});

// Also call it after a review is removed (findByIdAndDelete, etc.)
// Note: We use a pre-hook here to access the document before it's deleted
ReviewSchema.pre(/^findOneAnd/, async function (this: any, next) {
  // Store the doc on the query object to access it in the post-hook
  this.doc = await this.findOne().clone();
  next();
});

ReviewSchema.post(/^findOneAnd/, async function (this: any) {
  if (this.doc) {
    (this.doc.constructor as IReviewModel).calculateAverageRating(this.doc.product);
  }
});


ReviewSchema.plugin(mongoosePaginate);

export const ReviewModel = mongoose.model<IReviewDocument, IReviewModel>('Review', ReviewSchema);