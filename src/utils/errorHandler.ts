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

// Express error handler middleware
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): Response {
  // Log the error with contextual information
  const logLevel = err instanceof ApiError && err.status < 500 ? 'warn' : 'error';
  logger[logLevel]({
    err,
    path: req.path,
    method: req.method,
    statusCode: err instanceof ApiError ? err.status : 500,
    ip: req.ip,
    userId: (req as any).user?.userId
  }, err.message);
  
  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    // Using issues instead of errors in modern Zod versions (2025+)
    const formattedErrors = err.issues.map(issue => ({
      path: formatZodPath(issue.path),
      message: issue.message,
      code: issue.code
    }));
    
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: formattedErrors
      }
    });
  }
  
  // Handle TSOA validation errors
  if (err instanceof ValidateError) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation Failed',
        details: err.fields
      }
    });
  }
  
  // Handle our ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }
  
  // Handle all other errors as internal server errors
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}