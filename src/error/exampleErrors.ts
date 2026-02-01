import { ErrorResponse } from '../types/common.types';

export const VALIDATION_ERROR_EXAMPLE: ErrorResponse = {
    success: false,
    error: 'Validation failed',
    code: 'VALIDATION_ERROR',
    details: {
        field: ['Error description']
    }
};

export const NOT_FOUND_ERROR_EXAMPLE: ErrorResponse = {
    success: false,
    error: 'Resource not found',
    code: 'NOT_FOUND'
};

export const SERVER_ERROR_EXAMPLE: ErrorResponse = {
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR'
};

export const UNAUTHORIZED_ERROR_EXAMPLE: ErrorResponse = {
    success: false,
    error: 'Authentication required',
    code: 'UNAUTHORIZED'
};

