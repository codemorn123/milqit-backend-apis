
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
