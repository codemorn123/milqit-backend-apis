import { logger } from "./../config/logger";
import { ZodError, ZodObject } from "zod";
import { ApiError } from "./errorHandler";
import { NextFunction, Request } from "express";

export const validate = (schema: ZodObject) =>
 async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      logger.warn('Validation failed for MarotiKathoke');
      return next(ApiError.badRequest('Validation failed', formattedErrors));
    }
    return next(ApiError.internal('Internal server error during validation'));
  }

  };

// More specific validators
export const validateBody = 
  (schema: ZodObject) => 
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      const formattedErrors = error.errors?.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message
      }));
      next(ApiError.badRequest(formattedErrors));
    }
  };

export const validateQuery = 
  (schema: ZodObject) => 
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedQuery = schema.parse(req.query);
      req.query = Object.fromEntries(
        Object.entries(parsedQuery).map(([key, value]) => [key, String(value)])
      );
      next();
    } catch (error: any) {
      const formattedErrors = error.errors?.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message
      }));
      next(ApiError.badRequest(formattedErrors));
    }
  };

