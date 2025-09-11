import mongoose, { Schema, Document, Model } from 'mongoose';

// OTP document interface
export interface IOtp {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  isInvalidated: boolean; // Better naming to avoid conflict with Document.invalidate
  createdAt: Date;
  updatedAt: Date;
}

// Document interface for Mongoose
export interface IOtpDocument extends IOtp, Document {}

// OTP schema
const OtpSchema = new Schema<IOtpDocument>(
  {
    phone: { 
      type: String, 
      required: true,
      index: true
    },
    otp: { 
      type: String, 
      required: true 
    },
    expiresAt: { 
      type: Date, 
      required: true
    },
    attempts: { 
      type: Number, 
      default: 0 
    },
    verified: { 
      type: Boolean, 
      default: false 
    },
    isInvalidated: {
      type: Boolean,
      default: false
    }
  }, 
  { 
    timestamps: true 
  }
);

// Create TTL index to automatically remove expired OTPs after 24 hours


// Export model
export const OtpModel: Model<IOtpDocument> = mongoose.model<IOtpDocument>('Otp', OtpSchema);