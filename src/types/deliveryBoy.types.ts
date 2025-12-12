import { IDeliveryBoy } from '../models/DeliveryBoyModel';
import { AuthTokens } from './auth.types';

/**
 * Delivery Boy Profile - safe data to return to clients
 */
export interface DeliveryBoyProfile {
    id: string;
    name: string;
    phone: string;
    email?: string;
    isActive: boolean;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;

    // Delivery-specific fields
    vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car';
    vehicleNumber?: string;
    isDocumentVerified: boolean;
    isBackgroundCheckDone: boolean;
    isAvailable: boolean;
    deliveryZone?: string[];
    totalDeliveries: number;
    completedDeliveries: number;
    averageRating: number;
}

/**
 * Send OTP request for delivery boy
 */
export interface IDeliveryBoySendOtpInput {
    phone: string;
}

/**
 * Verify OTP and login/register delivery boy
 */
export interface IDeliveryBoyVerifyOtpInput {
    phone: string;
    otp: string;
    name?: string;
    email?: string;
    vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car';
    vehicleNumber?: string;
}

/**
 * Complete authentication response for delivery boy
 */
export interface IDeliveryBoyAuthResponse {
    deliveryBoy: IDeliveryBoy;
    tokens: AuthTokens;
    isNewDeliveryBoy: boolean;
}

/**
 * Update delivery boy profile request
 */
export interface IUpdateDeliveryBoyProfileInput {
    name?: string;
    email?: string;
    vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car';
    vehicleNumber?: string;
    drivingLicenseNumber?: string;
    deliveryZone?: string[];
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    bankAccountHolderName?: string;
    upiId?: string;
}

/**
 * Update delivery boy location
 */
export interface IUpdateDeliveryBoyLocationInput {
    latitude: number;
    longitude: number;
}

/**
 * Update delivery boy availability
 */
export interface IUpdateDeliveryBoyAvailabilityInput {
    isAvailable: boolean;
}
