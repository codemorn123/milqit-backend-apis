



import { StatusCodes } from 'http-status-codes';

// Defines the shape of our standard API error response
export interface ClientErrorInterface {
    success: false;
    status: StatusCodes;
    message: string;
    code: string;
}

// A dictionary of predefined error types for consistency
export const customErrors = {
    VALIDATION_ERROR: {
        status: StatusCodes.UNPROCESSABLE_ENTITY, // 422 is more specific for validation
        message: 'The request was invalid. Please check the provided data.',
    },
    CONFLICT: {
        status: StatusCodes.CONFLICT, // 409
        message: 'The resource already exists.',
    },
    NOT_FOUND: {
        status: StatusCodes.NOT_FOUND, // 404
        message: 'The requested resource could not be found.',
    },
    SERVER_ERROR: {
        status: StatusCodes.INTERNAL_SERVER_ERROR, // 500
        message: 'An unexpected error occurred on the server.',
    },
	UNAUTHORIZED: {
		status: StatusCodes.UNAUTHORIZED, // 401
		message: 'You are not authorized to perform this action.',
	},
	FORBIDDEN: {
		status: StatusCodes.FORBIDDEN, // 403
		message: 'You do not have permission to perform this action.',
	},
	TOO_MANY_REQUESTS: {
		status: StatusCodes.TOO_MANY_REQUESTS, // 429
		message: 'Too many requests. Please try again later.',
	},
	BAD_REQUEST: {
		status: StatusCodes.BAD_REQUEST, // 400
		message: 'The request was invalid. Please check the provided data.',
	},

};

// Type to ensure we only use defined error codes
export type CustomErrorCode = keyof typeof customErrors;

/**
 * A custom error class for creating consistent, client-facing error responses.
 */
export class PresentableError extends Error implements ClientErrorInterface {
    public readonly success = false;
    public readonly status: StatusCodes;
    public readonly code: CustomErrorCode;

    constructor(code: CustomErrorCode = 'SERVER_ERROR', message?: string) {
        // Use the provided message or the default message from our dictionary
        super(message || customErrors[code].message);
        this.status = customErrors[code].status;
        this.code = code;
    }
}