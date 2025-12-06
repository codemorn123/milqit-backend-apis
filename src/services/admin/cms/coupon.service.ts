
// import APIError from "@/error/api-error";
// import CouponModel from "@/models/cms/coupon.model";
// import logger from "@/services/logger";
// import { IFilter, IPaginated } from "@/types/common.types";
// import { ICoupon } from "@/types/coupon.types";
import APIError from "./../../../error/api-error";
import CouponModel from "./../../../models/cms/coupon.model";
import logger from "./../../../services/logger";
import { ICoupon } from "./../../../types/coupon.types";
import { BaseService } from "../../base.service";

class CouponService extends BaseService<ICoupon> {
  constructor() {
    super(CouponModel as any, ['code']);
  }

  // ADMIN METHODS
  public async create(data: Partial<ICoupon>): Promise<ICoupon> {
    const existingCoupon = await CouponModel.findOne({ code: data.code });
    if (existingCoupon) {
      throw new APIError(`Coupon code '${data.code}' already exists.`, 409);
    }
    return super.create(data);
  }

  // getAll handled by BaseService

  // update handled by BaseService

  // delete handled by BaseService

  // CUSTOMER METHODS
  public async getAvailableCoupons(userId?: string): Promise<ICoupon[]> {
    const now = new Date();
    const coupons = await CouponModel.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    }).lean<ICoupon[]>();

    if (!userId) {
      return coupons;
    }

    // Filter out coupons where the user has reached their usage limit
    return coupons.filter(coupon => {
      const userUseCount = coupon.usedBy ? coupon.usedBy.filter(id => id.toString() === userId).length : 0;
      return userUseCount < coupon.usageLimitPerUser;
    });
  }

  public async applyCoupon(code: string, orderTotal: number, userId: string) {
    const coupon = await CouponModel.findOne({ code });
    if (!coupon) throw new APIError('Invalid coupon code.', 404);

    // --- All Validations ---
    const now = new Date();
    if (!coupon.isActive) throw new APIError('This coupon is currently inactive.', 400);
    if (now < coupon.validFrom) throw new APIError('This coupon is not yet valid.', 400);
    if (now > coupon.validUntil) throw new APIError('This coupon has expired.', 400);
    if (coupon.timesUsed >= coupon.totalUsageLimit) throw new APIError('This coupon has reached its maximum usage limit.', 400);
    if (orderTotal < coupon.minOrderValue) throw new APIError(`A minimum order of ₹${coupon.minOrderValue} is required to use this coupon.`, 400);

    // Check usage per user
    const userUseCount = coupon.usedBy.filter(id => id.toString() === userId).length;
    if (userUseCount >= coupon.usageLimitPerUser) {
      throw new APIError('You have already used this coupon the maximum number of times.', 400);
    }

    // --- Calculate Discount ---
    let discountAmount = 0;
    if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'percentage') {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    }

    discountAmount = Math.min(discountAmount, orderTotal); // Discount cannot be more than the order total

    // In a real application, you would save the coupon usage to the user's order
    // and increment the coupon's `timesUsed` count only *after* successful payment.
    // For this validation endpoint, we just return the calculated values.
    logger.info(`User ${userId} successfully validated coupon ${code}`);

    return {
      message: 'Coupon applied successfully!',
      code: coupon.code,
      originalTotal: orderTotal,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      finalTotal: parseFloat((orderTotal - discountAmount).toFixed(2)),
    };
  }
}

export default new CouponService();