
// import APIError from "@/error/api-error";
// import CouponModel from "@/models/cms/coupon.model";
// import logger from "@/services/logger";
// import { IFilter, IPaginated } from "@/types/common.types";
// import { ICoupon } from "@/types/coupon.types";
import APIError from "./../../../error/api-error";
import CouponModel from "./../../../models/cms/coupon.model";
import logger from "./../../../services/logger";
import { IFilter, IPaginated } from "./../../../types/common.types";
import { ICoupon } from "./../../../types/coupon.types";

class CouponService {
  // ADMIN METHODS
  public async create(data: Partial<ICoupon>): Promise<ICoupon> {
    const existingCoupon = await CouponModel.findOne({ code: data.code });
    if (existingCoupon) {
      throw new APIError(`Coupon code '${data.code}' already exists.`, 409);
    }
    return CouponModel.create(data);
  }

  public async getAll(queryParams: IFilter): Promise<{ data: ICoupon[]; pagination: IPaginated }> {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const filter: any = {};
    if (queryParams.search) {
      filter.code = new RegExp(queryParams.search, 'i');
    }
    if (typeof queryParams.isActive === 'boolean') {
        filter.isActive = queryParams.isActive;
    }
    const totalRecords = await CouponModel.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);
    const data = await CouponModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit).lean<ICoupon[]>();
    return { data, pagination: { page, limit, totalRecord: totalRecords, totalPage: totalPages } };
  }

  public async update(id: string, data: Partial<ICoupon>): Promise<ICoupon> {
    const updatedCoupon = await CouponModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<ICoupon>();
    if (!updatedCoupon) throw new APIError('Coupon not found.', 404);
    return updatedCoupon;
  }

  public async delete(id: string): Promise<{ message: string }> {
    const result = await CouponModel.findByIdAndDelete(id);
    if (!result) throw new APIError('Coupon not found.', 404);
    return { message: 'Coupon deleted successfully.' };
  }

  // CUSTOMER METHODS
  public async getAvailableCoupons(): Promise<ICoupon[]> {
    const now = new Date();
    return CouponModel.find({
        isActive: true,
        validFrom: { $lte: now },
        validUntil: { $gte: now },
    }).lean<ICoupon[]>();
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