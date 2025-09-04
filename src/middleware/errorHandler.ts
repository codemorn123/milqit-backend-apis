import { StatusCodes } from 'http-status-codes';

export class ApiError extends Error {
  public readonly statusCode: StatusCodes;
  public readonly details?: any;

  constructor(statusCode: StatusCodes, message: string, details: any = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace
    Object.setPrototypeOf(this, new.target.prototype);
  }

  // Static methods for common error types
  static badRequest(message: string, details?: any) {
    return new ApiError(StatusCodes.BAD_REQUEST, message, details);
  }

  static notFound(message: string, details?: any) {
    return new ApiError(StatusCodes.NOT_FOUND, message, details);
  }

  static conflict(message: string, details?: any) {
    return new ApiError(StatusCodes.CONFLICT, message, details);
  }

  static internal(message: string, details?: any) {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message, details);
  }
}