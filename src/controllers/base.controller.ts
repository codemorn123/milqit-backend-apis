import { Controller, Response } from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse, success, successNull } from '../utils/SuccessResponse';
import { PaginatedResponse } from '../types/pagination.types';
import { ErrorResponse } from '../types/common.types';
import { NOT_FOUND_ERROR_EXAMPLE, SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../error/exampleErrors';

/**
 * Base Controller providing common functionality for response handling
 */
@Response<ErrorResponse>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', NOT_FOUND_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ErrorResponse>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ErrorResponse>(StatusCodes.CONFLICT, 'Conflict')
export abstract class BaseController extends Controller {
    /**
     * Send a success response with data
     */
    protected sendSuccess<T>(data: T, message: string = 'Success', statusCode: number = StatusCodes.OK): SuccessResponse<T> {
        this.setStatus(statusCode);
        return success(data, message);
    }

    /**
     * Send a paginated response
     */
    protected sendPaginated<T>(data: PaginatedResponse<T>, message: string = 'Data fetched successfully', statusCode: number = StatusCodes.OK): SuccessResponse<PaginatedResponse<T>> {
        this.setStatus(statusCode);
        return success(data, message);
    }

    /**
     * Send a created response (201)
     */
    protected sendCreated<T>(data: T, message: string = 'Resource created successfully'): SuccessResponse<T> {
        this.setStatus(StatusCodes.CREATED);
        return success(data, message);
    }

    /**
     * Send a generic response without data (e.g. for delete)
     */
    protected sendResponse(message: string = 'Success', statusCode: number = StatusCodes.OK): SuccessResponse<null> {
        this.setStatus(statusCode);
        return successNull(message);
    }

    /**
     * Send an error response
     */
    protected sendError(error: string, code?: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, details?: Record<string, any>): ErrorResponse {
        this.setStatus(statusCode);
        return { success: false, error, code, details };
    }

    protected sendBadRequest(message: string = 'Bad Request', code: string = 'BAD_REQUEST', details?: Record<string, any>): ErrorResponse {
        return this.sendError(message, code, StatusCodes.BAD_REQUEST, details);
    }

    protected sendUnauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED', details?: Record<string, any>): ErrorResponse {
        return this.sendError(message, code, StatusCodes.UNAUTHORIZED, details);
    }

    protected sendForbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN', details?: Record<string, any>): ErrorResponse {
        return this.sendError(message, code, StatusCodes.FORBIDDEN, details);
    }

    protected sendNotFound(message: string = 'Not Found', code: string = 'NOT_FOUND', details?: Record<string, any>): ErrorResponse {
        return this.sendError(message, code, StatusCodes.NOT_FOUND, details);
    }

    protected sendConflict(message: string = 'Conflict', code: string = 'CONFLICT', details?: Record<string, any>): ErrorResponse {
        return this.sendError(message, code, StatusCodes.CONFLICT, details);
    }

    protected sendInternalError(message: string = 'Internal Server Error', code: string = 'INTERNAL_ERROR', details?: Record<string, any>): ErrorResponse {
        return this.sendError(message, code, StatusCodes.INTERNAL_SERVER_ERROR, details);
    }

    /**
     * Get user ID from request
     * Throws 401 if user is not attached to request
     */
    protected getUserId(req: any): string {
        if (!req.user || !req.user.userId) {
            throw {
                statusCode: StatusCodes.UNAUTHORIZED,
                message: 'User authentication required',
            };
        }
        return req.user.userId;
    }

    /**
     * Get user object from request
     */
    protected getUser(req: any): { userId: string; roles: string[] } {
        if (!req.user) {
            throw {
                statusCode: StatusCodes.UNAUTHORIZED,
                message: 'User authentication required',
            };
        }
        return req.user;
    }
}
