import Joi from "joi";
import mongoose from "mongoose";
export const idParamSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": '"id" must be a valid MongoDB ObjectID',
      "any.required": '"id" is required',
    }),
});

export const categoryIdParamSchema = Joi.object({
  categoryId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": '"categoryId" must be a valid MongoDB ObjectID',
      "any.required": '"categoryId" is required',
    }),
});

export const userIdParamSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": '"userId" must be a valid MongoDB ObjectID',
      "any.required": '"userId" is required',
    }),
});


export const objectIdValidator = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'MongoDB ObjectId validation').messages({
  'any.invalid': 'Invalid MongoDB ObjectId format'
});



export const imageUploadSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'Image URL must be a valid web address.',
    'any.required': 'Image URL is a required field.',
  }),
  key: Joi.string().optional().allow(''),
});


export const fileUploadSchema = Joi.object({
  // Basic check to ensure the file object exists
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif', 'image/webp').required(),
    size: Joi.number().max(5 * 1024 * 1024).required(), // 5MB limit
    buffer: Joi.binary().required(),
  }).unknown(true).required().messages({ // .unknown(true) allows other multer properties
    'any.required': 'An image file is required.',
    'object.base': 'The uploaded file is invalid.',
  }),
});