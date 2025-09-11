import { StatusCodes } from 'http-status-codes';

// Define custom errors thrown by various functions in the backend
export const customErrors = {
	SERVER_ERROR: {
		status: StatusCodes.INTERNAL_SERVER_ERROR
	},
	UNAUTHORIZED: {
		status: StatusCodes.UNAUTHORIZED
	},
	FORBIDDEN: {
		status: StatusCodes.FORBIDDEN
	},
	NOT_FOUND: {
		status: StatusCodes.NOT_FOUND
	},
	VALIDATION_ERROR: {
		status: StatusCodes.UNPROCESSABLE_ENTITY
	},
	EXCEL_ERROR: {
		status: StatusCodes.BAD_REQUEST
	},
	AWS_ERROR: {
		status: StatusCodes.INTERNAL_SERVER_ERROR
	},
	BAD_REQUEST: {
		status: StatusCodes.BAD_REQUEST
	}
    ,TOO_MANY_REQUESTS: {
		status: StatusCodes.TOO_MANY_REQUESTS
	},CONFLICT: {
        status: StatusCodes.CONFLICT
    }
};

export type customErrorCode = keyof typeof customErrors;