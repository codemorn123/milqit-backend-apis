/**
 * Admin Cart DTOs - Clean and Simple Structure
 * Optimized for React Native mobile apps (RFS, SmartFlow, home_fresh_app, core_mobile_app, shree-react-naive-app)
 * @author MarotiKathoke
 * @created 2025-09-13 16:44:44
 */

// Simple, direct interfaces without "I" prefix
export interface CartItem {
    productId: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    quantity: number;
    unit: string;
    images: string[];
    brand?: string;
    categoryId: string;
    sku: string;
    isAvailable: boolean;
    maxQuantity: number;
    subtotal: number;
    discount: number;
    finalPrice: number;
  }
  
  export interface UserInfo {
    id: string;
    name: string;
    phone: string;
    email?: string;
  }
  
  export interface Address {
    id: string;
    address: string;
    city: string;
    state: string;
    pincode?: string;
  }
  
  export interface DeviceInfo {
    platform: 'ios' | 'android';
    version: string;
    deviceId: string;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
    address: string;
  }
  
  export interface Cart {
    id: string;
    userId: string;
    userInfo?: UserInfo;
    sessionId?: string;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    discount: number;
    deliveryCharges: number;
    taxes: number;
    totalAmount: number;
    savings: number;
    status: 'active' | 'checkout' | 'completed' | 'abandoned';
    deliveryType: 'standard' | 'express' | 'scheduled' | 'pickup';
    deliveryAddress?: Address;
    scheduledDelivery?: string; // ISO date string
    estimatedDelivery?: string; // ISO date string
    appliedCoupons: string[];
    notes?: string;
    deviceInfo?: DeviceInfo;
    location?: Location;
    isActive: boolean;
    expiresAt: string; // ISO date string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
  
  export interface Pagination {
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
    pagingCounter: number;
  }
  
  export interface CartAnalytics {
    totalCarts: number;
    activeCarts: number;
    abandonedCarts: number;
    completedCarts: number;
    abandonmentRate: string;
    averageCartValue: number;
    topProducts: Array<{
      productId: string;
      name: string;
      totalQuantity: number;
    }>;
  }
  
  export interface FunnelData {
    active?: { count: number; totalValue: number };
    checkout?: { count: number; totalValue: number };
    completed?: { count: number; totalValue: number };
    abandoned?: { count: number; totalValue: number };
  }
  
  export interface CartFunnel {
    funnelData: FunnelData;
    conversionRates: {
      activeToCheckout: string;
      checkoutToCompleted: string;
      overallConversion: string;
    };
    totalCarts: number;
  }
  
  export interface CleanupResult {
    deletedCount: number;
    message: string;
  }
  
  // Response interfaces for TSOA
  export interface CartListResponse {
    success: boolean;
    message: string;
    data: {
      carts: Cart[];
      pagination: Pagination;
    };
    timestamp: string;
    user: string;
  }
  
  export interface CartDetailResponse {
    success: boolean;
    message: string;
    data: {
      cart: Cart;
    };
    timestamp: string;
    user: string;
  }
  
  export interface CartAnalyticsResponse {
    success: boolean;
    message: string;
    data: {
      analytics: CartAnalytics;
    };
    timestamp: string;
    user: string;
  }
  
  export interface CartFunnelResponse {
    success: boolean;
    message: string;
    data: {
      funnel: CartFunnel;
    };
    timestamp: string;
    user: string;
  }
  
  export interface CartCleanupResponse {
    success: boolean;
    message: string;
    data: {
      result: CleanupResult;
    };
    timestamp: string;
    user: string;
  }
  
  /**
   * Convert Mongoose cart document to clean DTO
   * @param cartDoc Raw mongoose document
   * @returns Clean Cart object
   */
  export function toCartDTO(cartDoc: any): Cart {
    return {
      id: cartDoc._id?.toString() || cartDoc.id,
      userId: cartDoc.userId?.toString() || cartDoc.userId,
      userInfo: cartDoc.userId && typeof cartDoc.userId === 'object' ? {
        id: cartDoc.userId._id?.toString() || cartDoc.userId.id,
        name: cartDoc.userId.name || '',
        phone: cartDoc.userId.phone || '',
        email: cartDoc.userId.email
      } : undefined,
      sessionId: cartDoc.sessionId,
      items: cartDoc.items?.map((item: any) => ({
        productId: item.productId?._id?.toString() || item.productId?.toString() || item.productId,
        name: item.name || item.productId?.name || '',
        slug: item.slug || item.productId?.slug || '',
        price: item.price || item.productId?.price || 0,
        compareAtPrice: item.compareAtPrice || item.productId?.compareAtPrice,
        quantity: item.quantity || 0,
        unit: item.unit || '',
        images: item.images || item.productId?.images || [],
        brand: item.brand || item.productId?.brand,
        categoryId: item.categoryId?.toString() || item.categoryId,
        sku: item.sku || item.productId?.sku || '',
        isAvailable: item.isAvailable !== false,
        maxQuantity: item.maxQuantity || 0,
        subtotal: item.subtotal || 0,
        discount: item.discount || 0,
        finalPrice: item.finalPrice || 0
      })) || [],
      totalItems: cartDoc.totalItems || 0,
      subtotal: cartDoc.subtotal || 0,
      discount: cartDoc.discount || 0,
      deliveryCharges: cartDoc.deliveryCharges || 0,
      taxes: cartDoc.taxes || 0,
      totalAmount: cartDoc.totalAmount || 0,
      savings: cartDoc.savings || 0,
      status: cartDoc.status || 'active',
      deliveryType: cartDoc.deliveryType || 'standard',
      deliveryAddress: cartDoc.deliveryAddress && typeof cartDoc.deliveryAddress === 'object' ? {
        id: cartDoc.deliveryAddress._id?.toString() || cartDoc.deliveryAddress.id,
        address: cartDoc.deliveryAddress.address || '',
        city: cartDoc.deliveryAddress.city || '',
        state: cartDoc.deliveryAddress.state || '',
        pincode: cartDoc.deliveryAddress.pincode
      } : undefined,
      scheduledDelivery: cartDoc.scheduledDelivery?.toISOString(),
      estimatedDelivery: cartDoc.estimatedDelivery?.toISOString(),
      appliedCoupons: cartDoc.appliedCoupons || [],
      notes: cartDoc.notes,
      deviceInfo: cartDoc.deviceInfo,
      location: cartDoc.location,
      isActive: cartDoc.isActive !== false,
      expiresAt: cartDoc.expiresAt?.toISOString() || new Date().toISOString(),
      createdAt: cartDoc.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: cartDoc.updatedAt?.toISOString() || new Date().toISOString()
    };
  }