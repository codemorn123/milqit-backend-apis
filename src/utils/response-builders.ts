/**
 * Type-safe response builders for common service operations
 * Use these helpers to ensure consistent, type-safe responses across your services
 */

import { DeleteResponse, ToggleLikeResponse, BulkOperationResponse } from '../types/service.types';

/**
 * Creates a standardized delete response
 * @param entityName - Name of the entity that was deleted (e.g., 'User', 'Product')
 * @returns Properly typed delete response
 */
export function createDeleteResponse(entityName: string = 'Document'): DeleteResponse {
    return {
        message: `${entityName} deleted successfully`,
        status: 200
    };
}

/**
 * Creates a standardized toggle like response
 * @param liked - Whether the item was liked or unliked
 * @param totalLikes - Total number of likes after the operation
 * @param itemName - Name of the item type (e.g., 'Reel', 'Post')
 * @returns Properly typed toggle like response
 */
export function createToggleLikeResponse(
    liked: boolean,
    totalLikes: number,
    itemName: string = 'Item'
): ToggleLikeResponse {
    return {
        message: liked ? `${itemName} liked.` : `${itemName} unliked.`,
        liked,
        likes: totalLikes
    };
}

/**
 * Creates a standardized bulk operation response
 * @param modifiedCount - Number of documents modified
 * @param operationType - Type of operation performed (e.g., 'activate', 'delete', 'update')
 * @returns Properly typed bulk operation response
 */
export function createBulkOperationResponse(
    modifiedCount: number,
    operationType: string = 'modified'
): BulkOperationResponse {
    return {
        success: true,
        modifiedCount,
        message: `Successfully ${operationType} ${modifiedCount} document(s)`
    };
}

/**
 * Type guard to check if a value is a valid ObjectId string
 * @param value - Value to check
 * @returns True if the value matches MongoDB ObjectId pattern
 */
export function isValidObjectId(value: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(value);
}

/**
 * Type-safe error response creator
 * @param message - Error message
 * @param statusCode - HTTP status code
 * @param details - Optional additional error details
 * @returns Error response object
 */
export function createErrorResponse(
    message: string,
    statusCode: number = 400,
    details?: Record<string, unknown>
) {
    return {
        success: false,
        message,
        statusCode,
        ...(details && { details })
    };
}

/**
 * Type-safe success response creator
 * @param data - Response data
 * @param message - Success message
 * @returns Success response object
 */
export function createSuccessResponse<T>(
    data: T,
    message: string = 'Operation successful'
) {
    return {
        success: true,
        message,
        data
    };
}
