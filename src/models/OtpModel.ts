import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOtp {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  isInvalidated: boolean; 
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  
}

export interface IOtpDocument extends IOtp, Document {}
const OtpSchema = new Schema<IOtpDocument>(
  {phone: {
      type: String,
      required: true,
      index: true,
      unique: true ,
      validate: {
        validator: function (v) {
          return /^\+[1-9]\d{1,14}$/.test(v);
        },
        message: 'Please provide a valid phone number',
    },

    },
   
    otp: {
      type: String,
      required: true,
      // REMOVED: Validation for 6-digit numeric code
    },
    expiresAt: { type: Date, required: true },
  
    attempts: { 
      type: Number, 
      default: 0 
    },
    
    isVerified: {
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

// OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel: Model<IOtpDocument> = mongoose.model<IOtpDocument>('Otp', OtpSchema);