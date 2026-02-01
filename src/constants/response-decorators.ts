import { Response } from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { ClientErrorInterface } from '../error/clientErrorHelper';
import { ErrorResponse } from '../types/common.types';
import {
    VALIDATION_ERROR_EXAMPLE,
    SERVER_ERROR_EXAMPLE,
    NOT_FOUND_ERROR_EXAMPLE
} from '../error/exampleErrors';
import { HTTP_STATUS_MESSAGES } from './response-messages';

/**
 * Common Response Decorators
 * These can be applied to controllers to avoid repetitive @Response decorators
 */

/**
 * Standard Error Responses (4xx and 5xx)
 * Apply these to controller classes for consistent error handling
 */
export function StandardErrorResponses() {
    return function (target: any) {
        // Apply standard error response decorators
        Response<ClientErrorInterface>(
            StatusCodes.BAD_REQUEST,
            HTTP_STATUS_MESSAGES[StatusCodes.BAD_REQUEST]
        )(target);

        Response<ClientErrorInterface>(
            StatusCodes.UNAUTHORIZED,
            HTTP_STATUS_MESSAGES[StatusCodes.UNAUTHORIZED]
        )(target);

        Response<ClientErrorInterface>(
            StatusCodes.FORBIDDEN,
            HTTP_STATUS_MESSAGES[StatusCodes.FORBIDDEN]
        )(target);

        Response<ClientErrorInterface>(
            StatusCodes.NOT_FOUND,
            HTTP_STATUS_MESSAGES[StatusCodes.NOT_FOUND],
            NOT_FOUND_ERROR_EXAMPLE
        )(target);

        Response<ClientErrorInterface>(
            StatusCodes.UNPROCESSABLE_ENTITY,
            HTTP_STATUS_MESSAGES[StatusCodes.UNPROCESSABLE_ENTITY],
            VALIDATION_ERROR_EXAMPLE
        )(target);

        Response<ClientErrorInterface>(
            StatusCodes.INTERNAL_SERVER_ERROR,
            HTTP_STATUS_MESSAGES[StatusCodes.INTERNAL_SERVER_ERROR],
            SERVER_ERROR_EXAMPLE
        )(target);

        return target;
    };
}

/**
 * API Error Responses (Generic ErrorResponse type)
 * Use for simpler controllers that don't need ClientErrorInterface
 */
export function ApiErrorResponses() {
    return function (target: any) {
        Response<ErrorResponse>(
            StatusCodes.BAD_REQUEST,
            HTTP_STATUS_MESSAGES[StatusCodes.BAD_REQUEST]
        )(target);

        Response<ErrorResponse>(
            StatusCodes.UNAUTHORIZED,
            HTTP_STATUS_MESSAGES[StatusCodes.UNAUTHORIZED]
        )(target);

        Response<ErrorResponse>(
            StatusCodes.FORBIDDEN,
            HTTP_STATUS_MESSAGES[StatusCodes.FORBIDDEN]
        )(target);

        Response<ErrorResponse>(
            StatusCodes.NOT_FOUND,
            HTTP_STATUS_MESSAGES[StatusCodes.NOT_FOUND]
        )(target);

        Response<ErrorResponse>(
            StatusCodes.INTERNAL_SERVER_ERROR,
            HTTP_STATUS_MESSAGES[StatusCodes.INTERNAL_SERVER_ERROR]
        )(target);

        return target;
    };
}

/**
 * Conflict Response
 * For resources that may have conflicts (e.g., duplicate entries)
 */
export function ConflictResponse() {
    return function (target: any) {
        Response<ClientErrorInterface>(
            StatusCodes.CONFLICT,
            HTTP_STATUS_MESSAGES[StatusCodes.CONFLICT]
        )(target);

        return target;
    };
}

/**
 * Complete Admin Controller Responses
 * Includes all standard responses plus conflict
 */
export function AdminControllerResponses() {
    return function (target: any) {
        // Apply standard errors
        StandardErrorResponses()(target);

        // Add conflict response
        Response<ClientErrorInterface>(
            StatusCodes.CONFLICT,
            HTTP_STATUS_MESSAGES[StatusCodes.CONFLICT]
        )(target);

        return target;
    };
}

/**
 * Complete Customer Controller Responses
 * Standard error responses for customer-facing endpoints
 */
export function CustomerControllerResponses() {
    return function (target: any) {
        StandardErrorResponses()(target);
        return target;
    };
}

/**
 * Public Controller Responses
 * For public endpoints with minimal error responses
 */
export function PublicControllerResponses() {
    return function (target: any) {
        Response<ErrorResponse>(
            StatusCodes.BAD_REQUEST,
            HTTP_STATUS_MESSAGES[StatusCodes.BAD_REQUEST]
        )(target);

        Response<ErrorResponse>(
            StatusCodes.NOT_FOUND,
            HTTP_STATUS_MESSAGES[StatusCodes.NOT_FOUND]
        )(target);

        Response<ErrorResponse>(
            StatusCodes.INTERNAL_SERVER_ERROR,
            HTTP_STATUS_MESSAGES[StatusCodes.INTERNAL_SERVER_ERROR]
        )(target);

        return target;
    };
}
