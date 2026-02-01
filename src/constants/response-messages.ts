import { StatusCodes } from 'http-status-codes';

/**
 * HTTP Status Messages
 * Standard HTTP status code messages
 */
export const HTTP_STATUS_MESSAGES: Record<number, string> = {
    // 2xx Success
    [StatusCodes.OK]: 'Success',
    [StatusCodes.CREATED]: 'Resource created successfully',
    [StatusCodes.ACCEPTED]: 'Request accepted',
    [StatusCodes.NO_CONTENT]: 'No content',

    // 4xx Client Errors
    [StatusCodes.BAD_REQUEST]: 'Bad Request',
    [StatusCodes.UNAUTHORIZED]: 'Unauthorized',
    [StatusCodes.FORBIDDEN]: 'Forbidden',
    [StatusCodes.NOT_FOUND]: 'Not Found',
    [StatusCodes.CONFLICT]: 'Conflict',
    [StatusCodes.UNPROCESSABLE_ENTITY]: 'Validation Error',
    [StatusCodes.TOO_MANY_REQUESTS]: 'Too Many Requests',

    // 5xx Server Errors
    [StatusCodes.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [StatusCodes.BAD_GATEWAY]: 'Bad Gateway',
    [StatusCodes.SERVICE_UNAVAILABLE]: 'Service Unavailable',
};

/**
 * Common Success Messages
 * Organized by operation type
 */
export const SUCCESS_MESSAGES = {
    // Generic
    SUCCESS: 'Success',
    OPERATION_SUCCESSFUL: 'Operation completed successfully',

    // CRUD Operations
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    RETRIEVED: 'Resource retrieved successfully',

    // Data Operations
    FETCHED: 'Data fetched successfully',
    SAVED: 'Data saved successfully',
    PROCESSED: 'Data processed successfully',

    // Authentication
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    OTP_SENT: 'OTP sent successfully',
    OTP_VERIFIED: 'OTP verified successfully',
    PASSWORD_RESET: 'Password reset successfully',
    PASSWORD_CHANGED: 'Password changed successfully',

    // User Operations
    PROFILE_UPDATED: 'Profile updated successfully',
    PROFILE_RETRIEVED: 'Profile retrieved successfully',
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',

    // Order Operations
    ORDER_PLACED: 'Order placed successfully',
    ORDER_UPDATED: 'Order updated successfully',
    ORDER_CANCELLED: 'Order cancelled successfully',
    ORDER_RETRIEVED: 'Order retrieved successfully',

    // Cart Operations
    ITEM_ADDED_TO_CART: 'Item added to cart successfully',
    ITEM_REMOVED_FROM_CART: 'Item removed from cart successfully',
    CART_UPDATED: 'Cart updated successfully',
    CART_CLEARED: 'Cart cleared successfully',

    // Payment Operations
    PAYMENT_SUCCESSFUL: 'Payment processed successfully',
    PAYMENT_VERIFIED: 'Payment verified successfully',
    REFUND_INITIATED: 'Refund initiated successfully',

    // File Operations
    FILE_UPLOADED: 'File uploaded successfully',
    FILE_DELETED: 'File deleted successfully',

    // Notification Operations
    NOTIFICATION_SENT: 'Notification sent successfully',
    NOTIFICATION_MARKED_READ: 'Notification marked as read',

    // Settings
    SETTINGS_UPDATED: 'Settings updated successfully',
    SETTINGS_RETRIEVED: 'Settings retrieved successfully',

    // Subscription
    SUBSCRIPTION_CREATED: 'Subscription created successfully',
    SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',
    SUBSCRIPTION_UPDATED: 'Subscription updated successfully',
} as const;

/**
 * Common Error Messages
 * Organized by error type
 */
export const ERROR_MESSAGES = {
    // Generic Errors
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    CONFLICT: 'Conflict',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    VALIDATION_ERROR: 'Validation Error',

    // Authentication Errors
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_EXPIRED: 'Token expired',
    TOKEN_INVALID: 'Invalid token',
    SESSION_EXPIRED: 'Session expired',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    ACCOUNT_DISABLED: 'Account has been disabled',
    ACCOUNT_NOT_VERIFIED: 'Account not verified',

    // Validation Errors
    REQUIRED_FIELD_MISSING: 'Required field is missing',
    INVALID_FORMAT: 'Invalid format',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PHONE: 'Invalid phone number',
    PASSWORD_TOO_WEAK: 'Password is too weak',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',

    // Resource Errors
    RESOURCE_NOT_FOUND: 'Resource not found',
    RESOURCE_ALREADY_EXISTS: 'Resource already exists',
    RESOURCE_DELETED: 'Resource has been deleted',
    RESOURCE_UNAVAILABLE: 'Resource is unavailable',

    // User Errors
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User already exists',
    USER_INACTIVE: 'User account is inactive',
    EMAIL_ALREADY_REGISTERED: 'Email already registered',
    PHONE_ALREADY_REGISTERED: 'Phone number already registered',

    // Order Errors
    ORDER_NOT_FOUND: 'Order not found',
    ORDER_ALREADY_CANCELLED: 'Order already cancelled',
    ORDER_CANNOT_BE_CANCELLED: 'Order cannot be cancelled',
    INSUFFICIENT_STOCK: 'Insufficient stock',

    // Payment Errors
    PAYMENT_FAILED: 'Payment failed',
    PAYMENT_VERIFICATION_FAILED: 'Payment verification failed',
    INVALID_PAYMENT_METHOD: 'Invalid payment method',
    REFUND_FAILED: 'Refund processing failed',

    // Cart Errors
    CART_EMPTY: 'Cart is empty',
    ITEM_NOT_IN_CART: 'Item not found in cart',
    INVALID_QUANTITY: 'Invalid quantity',

    // Coupon Errors
    COUPON_NOT_FOUND: 'Coupon not found',
    COUPON_EXPIRED: 'Coupon has expired',
    COUPON_NOT_APPLICABLE: 'Coupon is not applicable',
    COUPON_ALREADY_USED: 'Coupon has already been used',
    MINIMUM_ORDER_NOT_MET: 'Minimum order value not met',

    // File Errors
    FILE_TOO_LARGE: 'File size exceeds maximum limit',
    INVALID_FILE_TYPE: 'Invalid file type',
    FILE_UPLOAD_FAILED: 'File upload failed',

    // Rate Limiting
    TOO_MANY_REQUESTS: 'Too many requests, please try again later',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',

    // Server Errors
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    DATABASE_ERROR: 'Database error occurred',
    EXTERNAL_SERVICE_ERROR: 'External service error',
} as const;

/**
 * Get standard message for HTTP status code
 */
export function getStatusMessage(statusCode: number): string {
    return HTTP_STATUS_MESSAGES[statusCode] || 'Unknown status';
}
