import { ValidateError } from 'tsoa';
import { customErrorCode, customErrors } from './customErrors';
import logger from './../services/logger';
export interface ClientErrorInterface {
	success: false;
	code: customErrorCode;
	status: number;
	message?: string;
}

// Define a standard error object that can be sent to client
export class PresentableError extends Error implements ClientErrorInterface {
	success: false;
	status: number;
	code: customErrorCode;
	meta?: any;

	constructor(customErrorCode: customErrorCode = 'SERVER_ERROR', message?: string, meta?: any) {
		super();
		this.success = false;
		this.code = customErrorCode;
		this.status = customErrors[customErrorCode].status;
		this.message = message || '';
		this.meta = meta;
	}
}

// Check if a given object is a standard error
const isPresentableError = (err: any): err is PresentableError => {
	if (typeof err !== 'object') return false;
	const keys = Object.keys(err);
	if (!(keys.includes('status') && keys.includes('code'))) return false;
	if (
		!(
			typeof err['status'] === 'number' &&
			typeof err['code'] === 'string' &&
			Object.keys(customErrors).indexOf(err['code']) !== -1 &&
			(typeof err['message'] === 'string' || typeof err['message'] === 'undefined')
		)
	)
		return false;
	return true;
};

// Converts any input into a presentable error as best as possible
export const getPresentableError = (err: any) => {
	console.error(err);
	let error = new PresentableError();

	if (isPresentableError(err)) {
		error = err;
	} else {
		if (typeof err === 'string') error.message = err;
		if (typeof err?.meta?.cause === 'string' || err instanceof ValidateError) {
			error.status = customErrors['VALIDATION_ERROR'].status;
			error.code = 'VALIDATION_ERROR';
			error.message = err.fields ? JSON.stringify(err.fields) : '';
		}
		if (err instanceof Error) {
			error.message = err.message;
			// Preserve meta field if it exists on the error
			if (Object.prototype.hasOwnProperty.call(err, 'meta')) {
				error.meta = (err as any).meta;
			}
		}
	}

	// if (isProd) {
	// 	// Show only client error in prod
	// 	logger.debug(JSON.stringify(error, null, 2));
	// } else {
	// 	// Show original error in dev
	// 	try {
	// 		logger.error(JSON.stringify(err, null, 2));
	// 	} catch (err) {
	// 		logger.error(err);
	// 	}
	// }

    // Show original error in dev
		try {
			logger.error(JSON.stringify(err, null, 2));
		} catch (err) {
			logger.error(err);
		}

	return error;
};