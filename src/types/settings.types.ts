import { Document } from 'mongoose';

export interface ISettings {
  splashScreen: {
    imageUrl: string;
    durationSeconds: number;
  };
  maintenanceMode: {
    isEnabled: boolean;
    message: string;
  };
  forceUpdate: {
    isRequired: boolean;
    minVersion: string;
    updateMessage: string;
  };
  supportInfo: {
    email: string;
    phone: string;
  };
  featureFlags: {
    isReferralEnabled: boolean;
    isNewPaymentGatewayVisible: boolean;
  };
}