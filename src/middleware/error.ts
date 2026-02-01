import { ErrorRequestHandler } from "express";
import { StatusCodes } from 'http-status-codes';
import { ValidateError } from "tsoa";
import { APIError, BadRequestError, ConflictError, ValidationError } from "../error/api-error";

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Log the error
  console.error('❌ Global Error Handler:', {
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
  });

  // Ensure CORS headers are set on error responses
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // --- Handle Specific Error Types ---

  // 1. APIError (Custom standardized errors)
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      details: err.details
    });
  }

  // 2. Multer/File Upload Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: 'File too large. Maximum size is 10MB.',
      code: 'LIMIT_FILE_SIZE'
    });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: 'Unexpected file field. Expected: "file"',
      code: 'LIMIT_UNEXPECTED_FILE'
    });
  }

  // 3. TSOA Validation Errors
  if (err instanceof ValidateError) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.fields
    });
  }

  // 4. Joi Validation Errors
  if (err.isJoi) {
    const messages = err.details.map((detail: any) => detail.message).join(', ');
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: messages,
      code: 'VALIDATION_ERROR',
      details: err.details
    });
  }

  // 5. MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000 && err.keyPattern && err.keyValue) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    return res.status(StatusCodes.CONFLICT).json({
      success: false,
      error: `Duplicate value entered for ${field}: ${value}`,
      code: 'DUPLICATE_KEY_ERROR',
      details: err.keyValue
    });
  }

  // 6. Generic/Unknown Errors
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    error: message,
    code: 'SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;