import mongoose, { Schema, Document } from 'mongoose';
import { UserProfile } from '../types/auth.types';
import { Address } from './../types/location.types';

export interface IUserDocument extends Document {
  id: string; 
  email: string;
  name: string;
  phone?: string;
  passwordHash: string;
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  mobileNumber?: string;
 primaryAddressId?: string;
    addresses?: Address[];
  currentLocation?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  lastLocationUpdate?: Date;


  toProfileDTO(): UserProfile;

}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, sparse: true, unique: true, index: true  },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['customer'], index: true },
    isActive: { type: Boolean, default: true, index: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
     mobileNumber: {
    type: String,
    sparse: true, // This makes the index ignore null values
    unique: true
  },

 primaryAddressId: { type: String },
  addresses: [{
      id: { type: String, required: true },
      label: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      addressType: { 
        type: String, 
        enum: ['home', 'work', 'other'],
        required: true
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }],
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    },
    lastLocationUpdate: { type: Date }

  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true, // Ensure virtuals are included in toJSON
        transform: (doc, ret: any) => {
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash; // Never expose password hash
      },
    },
    toObject: { virtuals: true },
  }
);

// Instance method to return a clean DTO



export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
// UserSchema.index({ phone: 1 }, { unique: true, sparse: true });