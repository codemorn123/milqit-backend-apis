// import { Document } from 'mongoose';

// // Enum to define the allowed categories for banners
// export enum BannerType {
//   HOME = 'HOME',
//   PROMOTIONAL = 'PROMOTIONAL',
//   PRODUCT = 'PRODUCT',
//   COMMON = 'COMMON',
// }

// // NEW: Enum to define the target platform for the banner
// export enum BannerPlatform {
//   WEB = 'WEB',
//   MOBILE = 'MOBILE',
// }

// // Interface for the banner document in MongoDB
// export interface IBanner extends Document {
//   title: string;
//   type: BannerType;
//   platform: BannerPlatform; // ADDED
//   imageUrl: string;
//   redirectLink?: string;
//   isActive: boolean;
//   startDate?: Date;
//   endDate?: Date;
//   placement?: string;
// }

// // Interface for creating a new banner
// export interface IBannerCreatePayload {
//   title: string;
//   type: BannerType;
//   platform: BannerPlatform; // ADDED
//   redirectLink?: string;
//   isActive?: boolean;
// }

// // Interface for filtering banners in GET requests
// export interface IBannerFilter {
//   page?: number;
//   limit?: number;
//   type?: BannerType;
//   platform?: BannerPlatform; // ADDED
//   isActive?: 'true' | 'false';
// }


import { Document } from 'mongoose';
import { BannerPlacement, BannerPurpose } from './banner.enums';

/**
 * Defines the target platform for the banner.
 */
export enum BannerPlatform {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
}

/**
 * Represents the structure of a banner document in MongoDB.
 */
export interface IBanner {
  title: string;
  placement: BannerPlacement;
  platform: BannerPlatform;
  purpose?: BannerPurpose;
  imageUrl: string;
  redirectLink?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Defines the shape of the data required to create a new banner.
 * This is the payload the service layer expects.
 */
export interface IBannerCreatePayload {
  title: string;
  placement: BannerPlacement;
  platform: BannerPlatform;
  purpose?: BannerPurpose;
  redirectLink?: string;
  isActive?: boolean;
}

/**
 * Defines the available query parameters for filtering banners.
 */
import { IFilter } from './common.types';

/**
 * Defines the available query parameters for filtering banners.
 */
export interface IBannerFilter extends IFilter {
  placement?: BannerPlacement;
  purpose?: BannerPurpose;
  platform?: BannerPlatform;
  isActive?: boolean; // Override to match IFilter
}
