import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateSchemaMiddleware = (
  schema: Joi.ObjectSchema,
  source: "params" | "body" | "query" = "params"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source]; // Get data from params, body, or query

    const { error } = schema.validate(data);

    if (error) {
      return res.status(400).json({
        message: `Validation error: ${error.details
          .map((x) => x.message)
          .join(", ")}`,
      });
    }
    next();
  };
};