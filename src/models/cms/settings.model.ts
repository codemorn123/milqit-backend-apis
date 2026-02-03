import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ISettings } from './../../types/settings.types';
import { createSchemaOptions } from '../../utils/schema.helpers';

type SettingsDocument = ISettings & Document;


const settingsSchema: Schema = new Schema<SettingsDocument>({
  splashScreen: {
    imageUrl: { type: String, required: true },
    durationSeconds: { type: Number, default: 3 },
  },
  maintenanceMode: {
    isEnabled: { type: Boolean, default: false },
    message: { type: String, default: 'The app is currently down for maintenance. Please check back later.' },
  },
  forceUpdate: {
    isRequired: { type: Boolean, default: false },
    minVersion: { type: String, required: true, trim: true, default: '1.0.0' }, // e.g., "1.2.5"
    updateMessage: { type: String, default: 'A new version of the app is available. Please update to continue.' },
  },
  supportInfo: {
    email: { type: String, default: 'support@milqit.com' },
    phone: { type: String, default: '+91-123-456-7890' },
  },
  featureFlags: {
    isReferralEnabled: { type: Boolean, default: true },
    isNewPaymentGatewayVisible: { type: Boolean, default: false },
  },
}, createSchemaOptions());

// Apply pagination plugin
settingsSchema.plugin(mongoosePaginate);

const SettingsModel = mongoose.model<SettingsDocument, PaginateModel<SettingsDocument>>('Setting', settingsSchema);

export default SettingsModel;