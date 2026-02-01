import mongoose, { Schema, Model } from 'mongoose';
import { IBaseDocument } from '../types/model.types';
import { BannerPlacement, BannerPurpose } from '../types/banner.enums';
import { BannerPlatform, IBanner } from '../types/banner.types';
import { createSchemaOptions, StringField, BooleanField, EnumField, URLField } from '../utils/schema.helpers';

/**
 * Banner Document Interface
 */
export interface BannerDocument extends IBanner, IBaseDocument { }

/**
 * Banner Model Interface
 */
export interface BannerModel extends Model<BannerDocument> {
  findActiveBanners(placement?: BannerPlacement, platform?: BannerPlatform): Promise<BannerDocument[]>;
}

/**
 * Banner Schema
 */
const bannerSchema = new Schema<BannerDocument>(
  {
    title: StringField.required(true, 200),
    placement: EnumField.required(Object.values(BannerPlacement)),
    purpose: EnumField.optional(Object.values(BannerPurpose)),
    platform: EnumField.required(Object.values(BannerPlatform)),
    imageUrl: URLField.required(),
    redirectLink: StringField.optional(true, 500),
    isActive: BooleanField.optional(true),
  },
  createSchemaOptions()
);

/**
 * Indexes for performance
 */
bannerSchema.index({ isActive: 1, placement: 1 });
bannerSchema.index({ platform: 1, isActive: 1 });

/**
 * Static Methods
 */
bannerSchema.statics.findActiveBanners = function (
  placement?: BannerPlacement,
  platform?: BannerPlatform
): Promise<BannerDocument[]> {
  const query: any = { isActive: true };
  if (placement) query.placement = placement;
  if (platform) query.platform = platform;
  return this.find(query).sort({ createdAt: -1 });
};

/**
 * Export Banner Model
 */
export const BannerModelClass = mongoose.model<BannerDocument, BannerModel>('Banner', bannerSchema);

// Backwards compatibility - use BannerModelClass in new code
export const Banner = BannerModelClass;

export default BannerModelClass;


