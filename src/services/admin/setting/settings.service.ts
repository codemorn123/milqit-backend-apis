

import APIError from "./../../../error/api-error";
import SettingsModel from "./../../../models/cms/settings.model";
import { ISettings } from "./../../../types/settings.types";

// This ensures the mobile app never gets an empty response.
const defaultSettings: Partial<ISettings> = {
    splashScreen: { imageUrl: 'https://default.com/splash.png', durationSeconds: 3 },
    maintenanceMode: { isEnabled: false, message: 'We are under maintenance.' },
    forceUpdate: { isRequired: false, minVersion: '1.0.0', updateMessage: 'Please update your app.' },
    supportInfo: { email: 'support@milqit.com', phone: '12345' },
    featureFlags: { isReferralEnabled: true, isNewPaymentGatewayVisible: false },
};

class SettingsService {
  /**
   * Retrieves the application settings.
   * If no settings exist, it returns a default configuration.
   */
  public async getSettings(): Promise<Partial<ISettings>> {
    const settings = await SettingsModel.findOne().lean<ISettings>();
    return settings || defaultSettings;
  }

  /**
   * Updates the application settings using the singleton pattern.
   * findOneAndUpdate with upsert:true will update the document if it exists,
   * or create it if it doesn't.
   */
  public async updateSettings(data: Partial<ISettings>): Promise<ISettings> {
    const updatedSettings = await SettingsModel.findOneAndUpdate(
      {}, // Empty filter matches the single document
      { $set: data }, // Use $set to update only provided fields
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options
    ).lean<ISettings>();

    if (!updatedSettings) {
        // This should theoretically never happen with upsert:true
        throw new APIError('Failed to update settings.', 500);
    }
    return updatedSettings;
  }
}

export default new SettingsService();