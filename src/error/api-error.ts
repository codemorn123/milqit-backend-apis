import { StatusCodes } from 'http-status-codes';

export interface ErrorDetails {
  field?: string;
  message: string;
  value?: any;
  [key: string]: any;
}

export class APIError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ErrorDetails[] | any;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: ErrorDetails[] | any,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Restore prototype chain
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

// === Standard HTTP Errors ===

export class BadRequestError extends APIError {
  constructor(message: string = 'Bad Request', details?: any) {
    super(message, StatusCodes.BAD_REQUEST, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(message, StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED', details);
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(message, StatusCodes.FORBIDDEN, 'FORBIDDEN', details);
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Not Found', details?: any) {
    super(message, StatusCodes.NOT_FOUND, 'NOT_FOUND', details);
  }
}

export class ConflictError extends APIError {
  constructor(message: string = 'Conflict', details?: any) {
    super(message, StatusCodes.CONFLICT, 'CONFLICT', details);
  }
}

export class ValidationError extends APIError {
  constructor(message: string = 'Validation Failed', details?: any) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', details);
  }
}

export class TooManyRequestsError extends APIError {
  constructor(message: string = 'Too Many Requests', details?: any) {
    super(message, StatusCodes.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS', details);
  }
}

export class InternalServerError extends APIError {
  constructor(message: string = 'Internal Server Error', details?: any) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR', details);
  }
}

export default APIError;