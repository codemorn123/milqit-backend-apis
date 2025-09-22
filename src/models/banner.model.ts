import { BannerPlacement, BannerPurpose } from './../types/banner.enums';
import { BannerPlatform, IBanner } from './../types/banner.types';
import mongoose, { Schema } from 'mongoose';


type BannerDocument = IBanner & Document;

const bannerSchema = new Schema<BannerDocument>(
  {
    title: { type: String, required: true, trim: true },
    placement: { // REPLACED 'type'
      type: String,
      enum: Object.values(BannerPlacement),
      required: true,
    },
    purpose: { // ADDED
      type: String,
      enum: Object.values(BannerPurpose),
      required: false, // Purpose can be optional
    },
    platform: {
      type: String,
      enum: Object.values(BannerPlatform),
      required: true,
    },
    imageUrl: { type: String, required: true },
    redirectLink: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    // ... other fields and timestamps
  },
  { timestamps: true }
);

const Banner = mongoose.model<BannerDocument>('Banner', bannerSchema);

export default Banner;
