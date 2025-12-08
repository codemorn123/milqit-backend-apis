import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

export const validateZodSchemaMiddleware = (
    schema: ZodSchema<any>,
    source: "params" | "body" | "query" = "params"
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req[source];
            await schema.parseAsync(data);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Validation Failed",
                    errors: formattedErrors,
                });
            }
            next(error);
        }
    };
};
