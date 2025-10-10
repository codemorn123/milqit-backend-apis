import Joi from 'joi';

export const updateSettingsSchema = Joi.object({
  splashScreen: Joi.object({
    imageUrl: Joi.string().uri().optional(),
    durationSeconds: Joi.number().min(1).max(10).optional(),
  }).optional(),

  maintenanceMode: Joi.object({
    isEnabled: Joi.boolean().optional(),
    message: Joi.string().min(10).max(200).optional(),
  }).optional(),

  forceUpdate: Joi.object({
    isRequired: Joi.boolean().optional(),
    // Validates semantic versioning format like "1.0.0"
    minVersion: Joi.string().pattern(/^\d+\.\d+\.\d+$/).optional().messages({
        'string.pattern.base': 'minVersion must be in semantic version format (e.g., "1.2.3")',
    }),
    updateMessage: Joi.string().min(10).max(200).optional(),
  }).optional(),

  supportInfo: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().min(10).max(15).optional(),
  }).optional(),

  featureFlags: Joi.object({
    isReferralEnabled: Joi.boolean().optional(),
    isNewPaymentGatewayVisible: Joi.boolean().optional(),
  }).optional(),
}).min(1); // Requires at least one key to be present for an update