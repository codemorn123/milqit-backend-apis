import { StatusCodes } from 'http-status-codes';
import { APIError } from './api-error';

// Defines the shape of our standard API error response
// Kept for backward compatibility
export interface ClientErrorInterface {
    success: boolean;
    error: string;
    code?: string;
    details?: any;
}

export type CustomErrorCode =
    | 'VALIDATION_ERROR'
    | 'CONFLICT'
    | 'NOT_FOUND'
    | 'SERVER_ERROR'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'BAD_REQUEST'
    | 'TOO_MANY_REQUESTS';

const codeToStatusMap: Record<string, number> = {
    'VALIDATION_ERROR': StatusCodes.UNPROCESSABLE_ENTITY,
    'CONFLICT': StatusCodes.CONFLICT,
    'NOT_FOUND': StatusCodes.NOT_FOUND,
    'SERVER_ERROR': StatusCodes.INTERNAL_SERVER_ERROR,
    'UNAUTHORIZED': StatusCodes.UNAUTHORIZED,
    'FORBIDDEN': StatusCodes.FORBIDDEN,
    'BAD_REQUEST': StatusCodes.BAD_REQUEST,
    'TOO_MANY_REQUESTS': StatusCodes.TOO_MANY_REQUESTS
};

/**
 * @deprecated Use specific error classes from ./api-error.ts (e.g. NotFoundError, BadRequestError)
 */
export class PresentableError extends APIError {
    public readonly status: number; // Backward compatibility alias for statusCode

    constructor(code: CustomErrorCode | string = 'SERVER_ERROR', message?: string) {
        const status = codeToStatusMap[code] || StatusCodes.INTERNAL_SERVER_ERROR;
        const msg = message || 'An unexpected error occurred';
        super(msg, status, code);
        this.status = status;
    }
}

// Keep customErrors for compatibility if used elsewhere (constants)
export const customErrors = {
    VALIDATION_ERROR: { status: StatusCodes.UNPROCESSABLE_ENTITY, message: 'Validation failed' },
    CONFLICT: { status: StatusCodes.CONFLICT, message: 'Resource conflict' },
    NOT_FOUND: { status: StatusCodes.NOT_FOUND, message: 'Not found' },
    SERVER_ERROR: { status: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Server error' },
    UNAUTHORIZED: { status: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' },
    FORBIDDEN: { status: StatusCodes.FORBIDDEN, message: 'Forbidden' },
    TOO_MANY_REQUESTS: { status: StatusCodes.TOO_MANY_REQUESTS, message: 'Too many requests' },
    BAD_REQUEST: { status: StatusCodes.BAD_REQUEST, message: 'Bad request' }
};