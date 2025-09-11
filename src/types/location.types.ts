/**
 * Geographic location with latitude and longitude
 */
export interface GeoLocation {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

/**
 * GeoJSON point for MongoDB
 */
export interface GeoPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Address information
 */
export interface Address {
    id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
    addressType: 'home' | 'work' | 'other';
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Delivery zone information
 */
export interface DeliveryZone {
    id: string;
    name: string;
    isActive: boolean;
    geometry: {
        type: 'Polygon' | 'MultiPolygon';
        coordinates: number[][][];
    };
    estimatedDeliveryTimeMinutes: number;
    minimumOrderValue: number;
    deliveryFee: number;
    storeIds: string[];
}