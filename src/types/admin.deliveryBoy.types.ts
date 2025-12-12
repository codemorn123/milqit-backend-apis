import { IDeliveryBoy } from '../models/DeliveryBoyModel';

/**
 * Admin create delivery boy request
 */
export interface IAdminCreateDeliveryBoyInput {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car';
    vehicleNumber?: string;
    drivingLicenseNumber?: string;
    aadharNumber?: string;
    panNumber?: string;
    deliveryZone?: string[];
    isActive?: boolean;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

/**
 * Admin update delivery boy request
 */
export interface IAdminUpdateDeliveryBoyInput {
    name?: string;
    email?: string;
    vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car';
    vehicleNumber?: string;
    drivingLicenseNumber?: string;
    aadharNumber?: string;
    panNumber?: string;
    deliveryZone?: string[];
    isActive?: boolean;
    isDocumentVerified?: boolean;
    isBackgroundCheckDone?: boolean;
    bankAccountNumber?: string;
    ifscCode?: string;
    bankAccountHolderName?: string;
    upiId?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

/**
 * Delivery boy activation/deactivation request
 */
export interface IToggleDeliveryBoyStatusInput {
    isActive: boolean;
    reason?: string;
}

/**
 * Document verification request
 */
export interface IVerifyDeliveryBoyDocumentsInput {
    isDocumentVerified: boolean;
    isBackgroundCheckDone?: boolean;
    verificationNotes?: string;
}

/**
 * Assign delivery zones request
 */
export interface IAssignDeliveryZonesInput {
    deliveryZone: string[];
}

/**
 * Delivery boy list query parameters
 */
export interface IDeliveryBoyListQuery {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isAvailable?: boolean;
    isDocumentVerified?: boolean;
    vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'car';
    deliveryZone?: string;
    sortBy?: 'name' | 'createdAt' | 'totalDeliveries' | 'averageRating';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Delivery boy statistics
 */
export interface IDeliveryBoyStats {
    totalDeliveryBoys: number;
    activeDeliveryBoys: number;
    availableDeliveryBoys: number;
    onDelivery: number;
    documentsVerified: number;
    documentsPending: number;
    averageRating: number;
    totalDeliveries: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    byVehicleType: {
        bike: number;
        scooter: number;
        bicycle: number;
        car: number;
    };
    byZone: Record<string, number>;
}

/**
 * Delivery boy performance metrics
 */
export interface IDeliveryBoyPerformance {
    deliveryBoyId: string;
    name: string;
    phone: string;
    totalDeliveries: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    averageRating: number;
    completionRate: number;
    onTimeDeliveryRate?: number;
    averageDeliveryTime?: number;
    totalEarnings?: number;
    lastDelivery?: Date;
}

/**
 * Paginated delivery boy list response
 */
export interface IPaginatedDeliveryBoyList {
    deliveryBoys: IDeliveryBoy[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Bulk operation request
 */
export interface IBulkDeliveryBoyOperation {
    deliveryBoyIds: string[];
    operation: 'activate' | 'deactivate' | 'verify' | 'delete';
    reason?: string;
}

/**
 * Bulk operation response
 */
export interface IBulkOperationResponse {
    success: number;
    failed: number;
    errors: Array<{
        deliveryBoyId: string;
        error: string;
    }>;
}
