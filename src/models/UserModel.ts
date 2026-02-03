

import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Address } from './../types/location.types';
import { createSchemaOptions } from '../utils/schema.helpers';

export interface IUser {
  id: string;
  name: string;
  phone: string;
  email?: string; // Optioanl
  passwordHash: string;
  roles: string[];
  isActive: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  primaryAddressId?: string;
  addresses?: Address[];
  isNewUser: boolean;
  currentLocation?: {
    type: string;
    coordinates: number[];
  };
  lastLocationUpdate?: Date;
}

export type IUserDocument = IUser & Document;

const UserSchema = new Schema<IUserDocument>(
  {
    phone: {
      type: String,
      required: true,
      index: true,


      validate: {
        validator: (value: string) => {
          return /^\+[1-9]\d{1,14}$/.test(value);
        },
        message: 'Please provide a valid phone number',
      },
      unique: true
    },
    email: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
      trim: true,
      lowercase: true
    },
    name: { type: String, trim: true, default: "Guest User" },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['customer'], index: true },
    isActive: { type: Boolean, default: true, index: true },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isNewUser: { type: Boolean, default: true },
    lastLogin: { type: Date },
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
        type: [Number],
        default: [0, 0]
      }
    },
    lastLocationUpdate: { type: Date }
  },
  createSchemaOptions({
    toJSON: {
      virtuals: true,
      transform: (_: any, ret: any) => {
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  })
);

// Apply the pagination plugin
UserSchema.plugin(mongoosePaginate);

export const UserModel = mongoose.model<IUserDocument, PaginateModel<IUserDocument>>('User', UserSchema);

// Default export for compatibility
export default UserModel;