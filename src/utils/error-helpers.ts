import { ValidationError as JoiValidationError } from 'joi';
import {
    ValidationError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    InternalServerError
} from '../error/api-error';

/**
 * Helper utilities for clean error handling
 */

/**
 * Handles Joi validation errors by throwing a clean ValidationError
 * @param error - Joi validation error from schema.validate()
 * @throws ValidationError with formatted error details
 */
export function handleValidationError(error: JoiValidationError): never {
    throw new ValidationError(error.details[0].message, error.details);
}

/**
 * Throws a BadRequestError with the given message
 * @param message - Error message
 * @param details - Optional additional details
 * @throws BadRequestError
 */
export function throwBadRequest(message: string, details?: any): never {
    throw new BadRequestError(message, details);
}

/**
 * Throws an UnauthorizedError with the given message
 * @param message - Error message
 * @throws UnauthorizedError
 */
export function throwUnauthorized(message: string = 'Unauthorized'): never {
    throw new UnauthorizedError(message);
}

/**
 * Throws a ForbiddenError with the given message
 * @param message - Error message
 * @throws ForbiddenError
 */
export function throwForbidden(message: string = 'Forbidden'): never {
    throw new ForbiddenError(message);
}

/**
 * Throws a NotFoundError with the given message
 * @param message - Error message
 * @throws NotFoundError
 */
export function throwNotFound(message: string = 'Not Found'): never {
    throw new NotFoundError(message);
}

/**
 * Throws an InternalServerError with the given message
 * @param message - Error message
 * @param details - Optional additional details
 * @throws InternalServerError
 */
export function throwInternalError(message: string = 'Internal Server Error', details?: any): never {
    throw new InternalServerError(message, details);
}

/**
 * Validates a condition and throws BadRequestError if false
 * @param condition - Condition to validate
 * @param message - Error message if condition is false
 * @throws BadRequestError if condition is false
 */
export function assertValid(condition: boolean, message: string): asserts condition {
    if (!condition) {
        throw new BadRequestError(message);
    }
}

/**
 * Validates that a value exists and throws NotFoundError if not
 * @param value - Value to check
 * @param message - Error message if value is null/undefined
 * @throws NotFoundError if value is null/undefined
 */
export function assertExists<T>(value: T | null | undefined, message: string = 'Resource not found'): asserts value is T {
    if (value == null) {
        throw new NotFoundError(message);
    }
}

/**
 * Validates user authorization and throws UnauthorizedError if userId is missing
 * @param userId - User ID from token
 * @throws UnauthorizedError if userId is missing
 */
export function assertAuthenticated(userId: string | undefined): asserts userId is string {
    if (!userId) {
        throw new UnauthorizedError('User not authenticated');
    }
}
