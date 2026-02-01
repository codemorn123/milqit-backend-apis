import bcrypt from 'bcrypt';
import { DeliveryBoyModel, IDeliveryBoy } from '../models/DeliveryBoyModel';
import { OtpModel } from '../models/OtpModel';
import { tokenService } from './token.service';
import { logger } from '../config/logger';
import { SmsService } from './sms.service';
import { PresentableError } from '../error/clientErrorHelper';
import {
    IDeliveryBoyAuthResponse,
    IDeliveryBoySendOtpInput,
    IDeliveryBoyVerifyOtpInput,
    IDeliveryBoyListQuery,
    IUpdateDeliveryBoyLocationInput,
    IUpdateDeliveryBoyProfileInput,
    IUpdateDeliveryBoyAvailabilityInput
} from '../types/deliveryBoy.types';
import { AuthTokens, RefreshTokenRequest } from '../types/auth.types';
import { QueryBuilder } from '../utils/query-builder';
import { PaginatedResponse, IFilter } from '../types/common.types';

const MAX_OTP_ATTEMPTS = 5;

/**
 * Service for handling delivery boy authentication and management
 */
export class DeliveryBoyService {
    /**
     * Send OTP for delivery boy login
     */
    static async sendLoginOtp(phone: string): Promise<{ expiresIn: number; otp: string }> {
        try {
            if (!phone || !/^\+[1-9]\d{1,14}$/.test(phone)) {
                throw new PresentableError('VALIDATION_ERROR', 'Valid phone number is required');
            }

            // Rate limiting: Check recent OTP requests
            const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const recentOtps = await OtpModel.countDocuments({
                phone,
                createdAt: { $gte: hourAgo }
            });

            if (recentOtps >= 5) {
                throw new PresentableError('TOO_MANY_REQUESTS', 'Too many OTP requests. Please try again later.');
            }

            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await this.hashOtp(otp);
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Store or update OTP
            const existingOtp = await OtpModel.findOne({ phone });

            if (existingOtp) {
                await OtpModel.updateOne(
                    { phone },
                    {
                        otp: hashedOtp,
                        expiresAt,
                        attempts: 0,
                        isVerified: false,
                        isInvalidated: false,
                        createdAt: new Date()
                    }
                );
            } else {
                await OtpModel.create({
                    phone,
                    otp: hashedOtp,
                    expiresAt,
                    attempts: 0,
                    isVerified: false,
                    isInvalidated: false
                });
            }

            // Send OTP via SMS
            await SmsService.sendOtp(phone, otp);
            logger.info(`OTP sent to delivery boy ${phone} successfully`);

            return { expiresIn: 10 * 60, otp };
        } catch (error: any) {
            if (error instanceof PresentableError) throw error;
            logger.error(`Failed to send OTP to delivery boy ${phone}: ${error.message}`);
            throw new PresentableError('SERVER_ERROR', `Failed to send OTP: ${error.message}`);
        }
    }

    /**
     * Verify OTP and login or register delivery boy
     */
    static async loginOrRegister(data: IDeliveryBoyVerifyOtpInput): Promise<IDeliveryBoyAuthResponse> {
        const { phone, otp, name, email, vehicleType, vehicleNumber } = data;

        // Verify OTP
        const verificationResult = await this.verifyOtp(phone, otp);
        if (!verificationResult.success) {
            throw new PresentableError('UNAUTHORIZED', verificationResult.message);
        }

        // Delete verified OTP
        await OtpModel.deleteOne({ phone, isVerified: true });

        // Check if delivery boy exists
        let deliveryBoy = await DeliveryBoyModel.findOne({ phone });
        let isNewDeliveryBoy = false;

        if (!deliveryBoy) {
            // Register new delivery boy
            const dummyPassword = await bcrypt.hash(phone + new Date().toISOString(), 10);

            deliveryBoy = new DeliveryBoyModel({
                phone,
                name: name || 'Delivery Partner',
                email,
                passwordHash: dummyPassword,
                isPhoneVerified: true,
                vehicleType,
                vehicleNumber,
                isActive: false, // Requires admin approval
            });

            await deliveryBoy.save();
            isNewDeliveryBoy = true;

            logger.info(`New delivery boy registered: ${phone}`);
        } else {
            // Update existing delivery boy's last login
            deliveryBoy.lastLogin = new Date();
            if (!deliveryBoy.isPhoneVerified) {
                deliveryBoy.isPhoneVerified = true;
            }
            await deliveryBoy.save();

            logger.info(`Delivery boy logged in: ${phone}`);
        }

        // Generate authentication tokens
        const token = tokenService.generateAuthTokens(deliveryBoy.id, ['delivery_boy']);

        return {
            deliveryBoy: deliveryBoy.toJSON() as IDeliveryBoy,
            tokens: {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                expiresIn: parseInt(token.expiresIn) || 3600
            },
            isNewDeliveryBoy
        };
    }

    /**
     * Verify OTP
     */
    private static async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
        const otpDoc = await OtpModel.findOne({
            phone,
            isVerified: false,
        }).sort({ createdAt: -1 });

        if (!otpDoc) {
            return { success: false, message: 'No active OTP found. Please request a new one.' };
        }

        if (new Date() > otpDoc.expiresAt) {
            return { success: false, message: 'OTP has expired. Please request a new one.' };
        }

        if (otpDoc.attempts >= MAX_OTP_ATTEMPTS) {
            return { success: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
        }

        const isMatch = await bcrypt.compare(otp, otpDoc.otp);

        if (!isMatch) {
            otpDoc.attempts += 1;
            await otpDoc.save();
            return { success: false, message: `Invalid OTP. You have ${MAX_OTP_ATTEMPTS - otpDoc.attempts} attempts left.` };
        }

        otpDoc.isVerified = true;
        await otpDoc.save();

        return {
            success: true,
            message: 'OTP verified successfully',
        };
    }

    /**
     * Hash OTP for secure storage
     */
    private static async hashOtp(otp: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(otp, salt);
    }

    /**
     * Refresh authentication tokens
     */
    static async refreshToken(data: RefreshTokenRequest): Promise<{ tokens: AuthTokens }> {
        if (!data.refreshToken) {
            throw new PresentableError('VALIDATION_ERROR', 'Refresh token is required');
        }

        const payload = tokenService.verifyRefreshToken(data.refreshToken);

        const deliveryBoy = await DeliveryBoyModel.findById(payload.userId);
        if (!deliveryBoy || !deliveryBoy.isActive) {
            throw new PresentableError('UNAUTHORIZED', 'Delivery boy not found or account is disabled');
        }

        // Generate new authentication tokens
        const tokenResponse = tokenService.generateAuthTokens(deliveryBoy.id, ['delivery_boy']);
        const tokens: AuthTokens = {
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken,
            expiresIn: parseInt(tokenResponse.expiresIn) || 3600
        };

        return { tokens };
    }

    /**
     * Find delivery boy by phone
     */
    static async findDeliveryBoyByPhone(phone: string): Promise<IDeliveryBoy | null> {
        const deliveryBoy = await DeliveryBoyModel.findOne({ phone });
        return deliveryBoy ? deliveryBoy.toJSON() as IDeliveryBoy : null;
    }

    /**
     * Find delivery boy by ID
     */
    static async findDeliveryBoyById(id: string): Promise<IDeliveryBoy | null> {
        const deliveryBoy = await DeliveryBoyModel.findById(id);
        return deliveryBoy ? deliveryBoy.toJSON() as IDeliveryBoy : null;
    }

    /**
     * Get active delivery boy by ID
     */
    static async getActiveDeliveryBoyById(id: string): Promise<IDeliveryBoy | null> {
        const deliveryBoy = await DeliveryBoyModel.findOne({ _id: id, isActive: true });
        return deliveryBoy ? deliveryBoy.toJSON() as IDeliveryBoy : null;
    }

    /**
     * Update delivery boy profile
     */
    static async updateProfile(deliveryBoyId: string, data: IUpdateDeliveryBoyProfileInput): Promise<IDeliveryBoy> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        // Update allowed fields
        if (data.name !== undefined) deliveryBoy.name = data.name;
        if (data.email !== undefined) deliveryBoy.email = data.email;
        if (data.vehicleType !== undefined) deliveryBoy.vehicleType = data.vehicleType;
        if (data.vehicleNumber !== undefined) deliveryBoy.vehicleNumber = data.vehicleNumber;
        if (data.drivingLicenseNumber !== undefined) deliveryBoy.drivingLicenseNumber = data.drivingLicenseNumber;
        if (data.deliveryZone !== undefined) deliveryBoy.deliveryZone = data.deliveryZone;
        if (data.emergencyContactName !== undefined) deliveryBoy.emergencyContactName = data.emergencyContactName;
        if (data.emergencyContactPhone !== undefined) deliveryBoy.emergencyContactPhone = data.emergencyContactPhone;
        if (data.bankAccountNumber !== undefined) deliveryBoy.bankAccountNumber = data.bankAccountNumber;
        if (data.ifscCode !== undefined) deliveryBoy.ifscCode = data.ifscCode;
        if (data.bankAccountHolderName !== undefined) deliveryBoy.bankAccountHolderName = data.bankAccountHolderName;
        if (data.upiId !== undefined) deliveryBoy.upiId = data.upiId;

        await deliveryBoy.save();

        logger.info(`Delivery boy profile updated: ${deliveryBoyId}`);
        return deliveryBoy.toJSON() as IDeliveryBoy;
    }

    /**
     * Update delivery boy location
     */
    static async updateLocation(deliveryBoyId: string, data: IUpdateDeliveryBoyLocationInput): Promise<IDeliveryBoy> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        deliveryBoy.currentLocation = {
            type: 'Point',
            coordinates: [data.longitude, data.latitude]
        };
        deliveryBoy.lastLocationUpdate = new Date();

        await deliveryBoy.save();

        return deliveryBoy.toJSON() as IDeliveryBoy;
    }

    /**
     * Update delivery boy availability
     */
    static async updateAvailability(deliveryBoyId: string, data: IUpdateDeliveryBoyAvailabilityInput): Promise<IDeliveryBoy> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        if (!deliveryBoy.isActive) {
            throw new PresentableError('FORBIDDEN', 'Account is not activated. Please contact admin.');
        }

        deliveryBoy.isAvailable = data.isAvailable;
        await deliveryBoy.save();

        logger.info(`Delivery boy availability updated: ${deliveryBoyId} - ${data.isAvailable ? 'Available' : 'Unavailable'}`);
        return deliveryBoy.toJSON() as IDeliveryBoy;
    }

    /**
     * Get available delivery boys in a zone
     */
    static async getAvailableDeliveryBoys(zone?: string): Promise<IDeliveryBoy[]> {
        const query: any = {
            isActive: true,
            isAvailable: true
        };

        if (zone) {
            query.deliveryZone = zone;
        }

        const deliveryBoys = await DeliveryBoyModel.find(query).sort({ averageRating: -1 });
        return deliveryBoys.map(db => db.toJSON() as IDeliveryBoy);
    }

    // ==================== ADMIN OPERATIONS ====================

    /**
     * Admin: Create delivery boy account
     */
    static async adminCreateDeliveryBoy(data: any): Promise<IDeliveryBoy> {
        // Check if delivery boy with phone already exists
        const existingDeliveryBoy = await DeliveryBoyModel.findOne({ phone: data.phone });
        if (existingDeliveryBoy) {
            throw new PresentableError('CONFLICT', 'Delivery boy with this phone number already exists');
        }

        // Check if email exists (if provided)
        if (data.email) {
            const existingEmail = await DeliveryBoyModel.findOne({ email: data.email });
            if (existingEmail) {
                throw new PresentableError('CONFLICT', 'Delivery boy with this email already exists');
            }
        }

        // Generate password hash
        const password = data.password || Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(password, 10);

        // Create delivery boy
        const deliveryBoy = new DeliveryBoyModel({
            ...data,
            passwordHash,
            isPhoneVerified: true, // Admin-created accounts are pre-verified
            isActive: data.isActive !== undefined ? data.isActive : true
        });

        await deliveryBoy.save();

        logger.info(`Admin created delivery boy: ${deliveryBoy.id}`);

        // Send credentials via SMS (optional)
        // await SmsService.sendCredentials(data.phone, password);

        return deliveryBoy.toJSON() as IDeliveryBoy;
    }

    /**
     * Admin: Update delivery boy
     */
    static async adminUpdateDeliveryBoy(deliveryBoyId: string, data: any): Promise<IDeliveryBoy> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        // Check email uniqueness if being updated
        if (data.email && data.email !== deliveryBoy.email) {
            const existingEmail = await DeliveryBoyModel.findOne({ email: data.email });
            if (existingEmail) {
                throw new PresentableError('CONFLICT', 'Email already exists');
            }
        }

        // Update fields
        Object.keys(data).forEach(key => {
            if (key !== 'phone' && key !== 'passwordHash') { // Don't allow phone/password change
                (deliveryBoy as any)[key] = data[key];
            }
        });

        await deliveryBoy.save();

        logger.info(`Admin updated delivery boy: ${deliveryBoyId}`);
        return deliveryBoy.toJSON() as IDeliveryBoy;
    }

    /**
     * Admin: Get delivery boys list with pagination and filters
     */
    /**
     * Admin: Get delivery boys list with pagination and filters
     */
    static async adminGetDeliveryBoysList(query: IDeliveryBoyListQuery): Promise<PaginatedResponse<IDeliveryBoy>> {
        const builder = new QueryBuilder<IDeliveryBoy>(DeliveryBoyModel as any, query);

        // Search filter
        if (query.search) {
            builder.filter(['name', 'phone', 'email']);
        }

        // Custom filters
        if (query.isActive !== undefined) builder.addFilter({ isActive: query.isActive });
        if (query.isAvailable !== undefined) builder.addFilter({ isAvailable: query.isAvailable });
        if (query.isDocumentVerified !== undefined) builder.addFilter({ isDocumentVerified: query.isDocumentVerified });
        if (query.vehicleType) builder.addFilter({ vehicleType: query.vehicleType });
        if (query.deliveryZone) builder.addFilter({ deliveryZone: query.deliveryZone });

        return await builder.exec();
    }

    /**
     * Admin: Get delivery boy statistics
     */
    static async adminGetDeliveryBoyStats(): Promise<any> {
        const total = await DeliveryBoyModel.countDocuments();
        const active = await DeliveryBoyModel.countDocuments({ isActive: true });
        const available = await DeliveryBoyModel.countDocuments({ isActive: true, isAvailable: true });
        const documentsVerified = await DeliveryBoyModel.countDocuments({ isDocumentVerified: true });
        const documentsPending = await DeliveryBoyModel.countDocuments({ isDocumentVerified: false });

        // Aggregate vehicle types
        const byVehicleType = await DeliveryBoyModel.aggregate([
            { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
        ]);

        const vehicleTypeMap: any = { bike: 0, scooter: 0, bicycle: 0, car: 0 };
        byVehicleType.forEach(item => {
            if (item._id) vehicleTypeMap[item._id] = item.count;
        });

        // Aggregate delivery zones
        const byZone = await DeliveryBoyModel.aggregate([
            { $unwind: '$deliveryZone' },
            { $group: { _id: '$deliveryZone', count: { $sum: 1 } } }
        ]);

        const zoneMap: Record<string, number> = {};
        byZone.forEach(item => {
            zoneMap[item._id] = item.count;
        });

        // Aggregate ratings and deliveries
        const aggregateStats = await DeliveryBoyModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalDeliveries: { $sum: '$totalDeliveries' },
                    completedDeliveries: { $sum: '$completedDeliveries' },
                    cancelledDeliveries: { $sum: '$cancelledDeliveries' },
                    avgRating: { $avg: '$averageRating' }
                }
            }
        ]);

        const stats = aggregateStats[0] || {
            totalDeliveries: 0,
            completedDeliveries: 0,
            cancelledDeliveries: 0,
            avgRating: 0
        };

        return {
            totalDeliveryBoys: total,
            activeDeliveryBoys: active,
            availableDeliveryBoys: available,
            onDelivery: active - available, // Approximation
            documentsVerified,
            documentsPending,
            averageRating: Math.round(stats.avgRating * 10) / 10,
            totalDeliveries: stats.totalDeliveries,
            completedDeliveries: stats.completedDeliveries,
            cancelledDeliveries: stats.cancelledDeliveries,
            byVehicleType: vehicleTypeMap,
            byZone: zoneMap
        };
    }

    /**
     * Admin: Toggle delivery boy status (activate/deactivate)
     */
    static async adminToggleStatus(deliveryBoyId: string, data: any): Promise<IDeliveryBoy> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        deliveryBoy.isActive = data.isActive;

        // If deactivating, also set unavailable
        if (!data.isActive) {
            deliveryBoy.isAvailable = false;
        }

        await deliveryBoy.save();

        logger.info(`Admin ${data.isActive ? 'activated' : 'deactivated'} delivery boy: ${deliveryBoyId}. Reason: ${data.reason || 'N/A'}`);
        return deliveryBoy.toJSON() as IDeliveryBoy;
    }

    /**
     * Admin: Verify delivery boy documents
     */
    static async adminVerifyDocuments(deliveryBoyId: string, data: any): Promise<IDeliveryBoy> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        deliveryBoy.isDocumentVerified = data.isDocumentVerified;
        if (data.isBackgroundCheckDone !== undefined) {
            deliveryBoy.isBackgroundCheckDone = data.isBackgroundCheckDone;
        }

        await deliveryBoy.save();

        logger.info(`Admin verified documents for delivery boy: ${deliveryBoyId}. Notes: ${data.verificationNotes || 'N/A'}`);
        return deliveryBoy.toJSON() as IDeliveryBoy;
    }

    /**
     * Admin: Assign delivery zones
     */
    static async adminAssignZones(deliveryBoyId: string, data: any): Promise<IDeliveryBoy> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        deliveryBoy.deliveryZone = data.deliveryZone;
        await deliveryBoy.save();

        logger.info(`Admin assigned zones to delivery boy: ${deliveryBoyId}. Zones: ${data.deliveryZone.join(', ')}`);
        return deliveryBoy.toJSON() as IDeliveryBoy;
    }

    /**
     * Admin: Delete delivery boy
     */
    static async adminDeleteDeliveryBoy(deliveryBoyId: string): Promise<void> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        // Check if delivery boy has pending deliveries
        // TODO: Add check for active deliveries when order system is implemented

        await DeliveryBoyModel.findByIdAndDelete(deliveryBoyId);

        logger.info(`Admin deleted delivery boy: ${deliveryBoyId}`);
    }

    /**
     * Admin: Bulk operations
     */
    static async adminBulkOperation(data: any): Promise<any> {
        const { deliveryBoyIds, operation, reason } = data;
        const results = {
            success: 0,
            failed: 0,
            errors: [] as Array<{ deliveryBoyId: string; error: string }>
        };

        for (const id of deliveryBoyIds) {
            try {
                switch (operation) {
                    case 'activate':
                        await this.adminToggleStatus(id, { isActive: true, reason });
                        break;
                    case 'deactivate':
                        await this.adminToggleStatus(id, { isActive: false, reason });
                        break;
                    case 'verify':
                        await this.adminVerifyDocuments(id, { isDocumentVerified: true, verificationNotes: reason });
                        break;
                    case 'delete':
                        await this.adminDeleteDeliveryBoy(id);
                        break;
                }
                results.success++;
            } catch (error: any) {
                results.failed++;
                results.errors.push({
                    deliveryBoyId: id,
                    error: error.message || 'Unknown error'
                });
            }
        }

        logger.info(`Admin bulk operation '${operation}' completed. Success: ${results.success}, Failed: ${results.failed}`);
        return results;
    }

    /**
     * Admin: Get delivery boy performance
     */
    static async adminGetPerformance(deliveryBoyId: string): Promise<any> {
        const deliveryBoy = await DeliveryBoyModel.findById(deliveryBoyId);

        if (!deliveryBoy) {
            throw new PresentableError('NOT_FOUND', 'Delivery boy not found');
        }

        const completionRate = deliveryBoy.totalDeliveries > 0
            ? (deliveryBoy.completedDeliveries / deliveryBoy.totalDeliveries) * 100
            : 0;

        return {
            deliveryBoyId: deliveryBoy.id,
            name: deliveryBoy.name,
            phone: deliveryBoy.phone,
            totalDeliveries: deliveryBoy.totalDeliveries,
            completedDeliveries: deliveryBoy.completedDeliveries,
            cancelledDeliveries: deliveryBoy.cancelledDeliveries,
            averageRating: deliveryBoy.averageRating,
            completionRate: Math.round(completionRate * 100) / 100,
            // TODO: Add more metrics from order data
        };
    }
}

export const deliveryBoyService = DeliveryBoyService;
