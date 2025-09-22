import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOtp {
  phone: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  // verified: boolean;
  isInvalidated: boolean; 
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  email: string;
  
}

export interface IOtpDocument extends IOtp, Document {}

// OTP schema
const OtpSchema = new Schema<IOtpDocument>(
  {
    // phone: { 
    //   type: String, 
    //   required: true,
    //   index: true
    // },
    // otp: { 
    //   type: String, 
    //   required: true 
    // },


    phone: {
      type: String,
      required: function () {
        return !this.email; 
      },
      validate: {
        validator: function () {
          return !(this.phone && this.email); 
        },
        message: "Only one of phone or email should be provided, not both.",
      },
    },
    email: {
      type: String,
      required: function () {
        return !this.phone; 
      },
    },
    // otp: {
    //   type: String,
    //   required: true,
    //   validate: {
    //     validator: function (v) {
    //       return /^\d{6}$/.test(v); 
    //     },
    //     message: props => `The OTP ${props.value} must be a 6-digit numeric code.`,
    //   },
    // },
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
    // verified: { 
    //   type: Boolean, 
    //   default: false 
    // },
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

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel: Model<IOtpDocument> = mongoose.model<IOtpDocument>('Otp', OtpSchema);