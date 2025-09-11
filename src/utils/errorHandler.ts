import { Response, Request, NextFunction } from 'express';
import { z, ZodIssue } from 'zod';
import { logger } from '../config/logger';
import { ValidateError } from 'tsoa';

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(resource: string): ApiError {
    return new ApiError(404, 'NOT_FOUND', `${resource} not found`);
  }

  static conflict(message: string, details?: unknown): ApiError {
    return new ApiError(409, 'CONFLICT', message, details);
  }

  static validation(details: unknown): ApiError {
    return new ApiError(422, 'VALIDATION_ERROR', 'Validation failed', details);
  }
  
  static tooManyRequests(message = 'Too many requests'): ApiError {
    return new ApiError(429, 'TOO_MANY_REQUESTS', message);
  }
  
  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, 'INTERNAL_SERVER_ERROR', message);
  }
}

/**
 * Format a Zod validation error path
 * In latest Zod versions (2025+), path can include symbols as well
 */
function formatZodPath(path: PropertyKey[]): string {
  return path.map(p => {
    if (typeof p === 'number') {
      return `[${p}]`;
    } else if (typeof p === 'symbol') {
      return `[${String(p)}]`; // Convert symbol to string representation
    } else {
      return p; // It's already a string
    }
  }).join('.');
}



// import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PresentableError } from '../error/clientErrorHelper'; // Adjust path if needed


// This map translates your custom error codes into standard HTTP status codes.
const errorCodeToHttpStatus: { [key:string]: number } = {
  VALIDATION_ERROR: StatusCodes.UNPROCESSABLE_ENTITY, // 422
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,             // 401
  FORBIDDEN: StatusCodes.FORBIDDEN,                   // 403
  NOT_FOUND: StatusCodes.NOT_FOUND,                   // 404
  TOO_MANY_REQUESTS: StatusCodes.TOO_MANY_REQUESTS,   // 429
  SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,    // 500
};

/**
 * Express error handling middleware.
 * This should be the LAST middleware registered in your app.
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // If the response has already been sent, don't do anything.
  if (res.headersSent) {
    return next(err);
  }

  // Check if the error is a custom, "presentable" error we created.
  if (err instanceof PresentableError) {
    const statusCode = errorCodeToHttpStatus[err.code] || StatusCodes.INTERNAL_SERVER_ERROR;
    
    logger.warn(`Client Error: ${err.message} | Code: ${err.code} | Path: ${req.path}`);

    return res.status(statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // For all other unexpected errors, log them and return a generic 500 error.
  logger.error({
    message: `Unhandled Internal Server Error: ${err.message}`,
    stack: err.stack,
    path: req.path,
  });

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}