import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateSchemaMiddleware = (
  schema: Joi.ObjectSchema,
  source: "params" | "body" | "query" = "params"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const { error } = schema.validate(data);
    if (error) {

      const formattedErrors = error.details.map((err) => ({
        field: err.path.join('.'), // Use .join('.') to handle nested fields
        message: err.message,
      }));
      // return res.status(400).json({
      //   message: `Validation error: ${error.details
      //     .map((x) => x.message)
      //     .join(", ")}`,
      // });

      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: formattedErrors,
      });
    }
    next();
  };
};