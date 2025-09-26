import { BannerPlacement, BannerPurpose } from "./../types/banner.enums";
import { BannerPlatform } from "./../types/banner.types";
import Joi from "joi";

export const createBannerSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": '"title" cannot be empty',
    "any.required": '"title" is a required field',
  }),

  placement: Joi.string()
    .valid(...Object.values(BannerPlacement))
    .required()
    .messages({
      "any.only": "Invalid banner placement",
      "any.required": '"placement" is a required field',
    }),

  platform: Joi.string()
    .valid(...Object.values(BannerPlatform))
    .required()
    .messages({
      "any.only": "Invalid platform",
      "any.required": '"platform" is a required field',
    }),

  purpose: Joi.string()
    .valid(...Object.values(BannerPurpose))
    .optional()
    .messages({
      "any.only": "Invalid banner purpose",
    }),

  redirectLink: Joi.string().uri().optional().allow("").messages({
    "string.uri": '"redirectLink" must be a valid URL',
  }),

  isActive: Joi.boolean().optional(),
});

/**
 * Schema for validating the query parameters when fetching a list of banners.
 */
export const bannerFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),

  placement: Joi.string()
    .valid(...Object.values(BannerPlacement))
    .optional(),
  purpose: Joi.string().valid(...Object.values(BannerPurpose)).optional(),
  platform: Joi.string().valid(...Object.values(BannerPlatform)).optional(),

  isActive: Joi.string().valid("true", "false").optional(),
});
