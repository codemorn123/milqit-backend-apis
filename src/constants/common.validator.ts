import Joi from "joi";
export const idParamSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": '"id" must be a valid MongoDB ObjectID',
      "any.required": '"id" is required',
    }),
});