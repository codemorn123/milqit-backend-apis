
import { ErrorRequestHandler } from "express";
import BaseCustomError from "./../error/base-error";
import { MongoDuplicateKeyError } from "./../error/mongo-error";
import { ValidateError } from "tsoa";
import { PresentableError } from "./../error/clientErrorHelper";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof BaseCustomError) {
    return res.status(err.getStatusCode()).json(err.serializeErrorOutput());
  }

  if (err instanceof ValidateError) {
    const messages = Object.values(err.fields).map(field => field.message);
    const error = new PresentableError('VALIDATION_ERROR', messages.join(', '));
    return res.status(error.status).json(error);
  }

  // ✅ START: New logic for handling Joi Validation Errors
  if (err.isJoi) {
    // Joi validation errors have a '.details' array
    const messages = err.details.map((detail: any) => detail.message).join(', ');
    const error = new PresentableError('VALIDATION_ERROR', messages);
    return res.status(error.status).json(error);
  }

  // --- Type Guard for MongoDB Duplicate Key Error (E11000) ---
  // This block checks for the unique properties of the Mongo error.
  if (
    err instanceof Error &&    // 1. Is it an Error object?
    'code' in err &&           // 2. Does it have a 'code' property?
    err.code === 11000 &&      // 3. Is the code 11000?
    'keyValue' in err &&       // 4. Does it have a 'keyValue' property?
    typeof (err as any).keyValue === 'object' && (err as any).keyValue !== null
  ) {
    // Inside this block, TypeScript knows err.keyValue is safe to access.
    const keyValue = (err as any).keyValue as Record<string, string>;
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    
    const mongoError = new MongoDuplicateKeyError(field, value);
    return res.status(mongoError.getStatusCode()).json(mongoError.serializeErrorOutput());
  }


  if (err instanceof PresentableError) {
    return res.status(err.status).json(err);
  }

  // --- Handle generic JavaScript Errors ---
  if (err instanceof Error) {
    const error = new PresentableError('SERVER_ERROR', err.message);
    return res.status(error.status).json(error);
  }

  // --- Fallback for any other unknown error type ---
  const fallbackError = new PresentableError('SERVER_ERROR');
  return res.status(fallbackError.status).json(fallbackError);

};

export default errorHandler;