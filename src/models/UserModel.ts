

// import mongoose, { Schema, Document } from 'mongoose';
// import { Address } from './../types/location.types';

// export interface IUser {
//   id: string;
//   email?: string;
//   name: string;
//   phone?: string;
//   passwordHash: string;
//   roles: string[];
//   isActive: boolean;
//   isEmailVerified: boolean;
//   isPhoneVerified: boolean;
//   lastLogin?: Date;
//   createdAt: Date;
//   updatedAt: Date;
//   primaryAddressId?: string;
//   addresses?: Address[];
//   isNewUser: boolean;
//   currentLocation?: {
//     type: string;
//     coordinates: number[];
//   };
//   lastLocationUpdate?: Date;
// }

// type IUserDocument = IUser & Document;

// const UserSchema = new Schema<IUserDocument>(
//   {
//     phone: {
//       type: String,
//       required: function () { return !this.email; },
//       index: true,
//     },
//     email: {
//       type: String,
//       required: function () { return !this.phone; },
//       trim: true,
//       lowercase: true,
//       validate: {
//         validator: function (v: string) {
//           if (!v) return true;
//           return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
//         },
//         message: 'Please provide a valid email address',
//       },
//       index: true,
//     },
//     name: { type: String, trim: true, default: "Guest User" },
//     passwordHash: { type: String, required: true },
//     roles: { type: [String], default: ['customer'], index: true },
//     isActive: { type: Boolean, default: true, index: true },
//     isEmailVerified: { type: Boolean, default: false },
//     isPhoneVerified: { type: Boolean, default: false },
//     isNewUser: { type: Boolean, default: true },
//     lastLogin: { type: Date },
//     primaryAddressId: { type: String },
//     addresses: [{
//       id: { type: String, required: true },
//       label: { type: String, required: true },
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       pincode: { type: String, required: true },
//       landmark: { type: String },
//       latitude: { type: Number },
//       longitude: { type: Number },
//       addressType: {
//         type: String,
//         enum: ['home', 'work', 'other'],
//         required: true
//       },
//       createdAt: { type: Date, default: Date.now },
//       updatedAt: { type: Date, default: Date.now }
//     }],
//     currentLocation: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         default: 'Point'
//       },
//       coordinates: {
//         type: [Number],
//         default: [0, 0]
//       }
//     },
//     lastLocationUpdate: { type: Date }
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       virtuals: true,
//       transform: (_, ret: any) => {
//         delete ret._id;
//         delete ret.__v;
//         delete ret.passwordHash;
//       },
//     },
//     toObject: { virtuals: true },
//   }
// );

// // This ensures null emails don't trigger the unique index
// UserSchema.index(
//   { email: 1 },
//   { unique: true, partialFilterExpression: { email: { $exists: true, $ne: null } } }
// );
// UserSchema.index(
//   { phone: 1 },
//   { unique: true, partialFilterExpression: { phone: { $exists: true, $ne: null } } }
// );

// export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);




import mongoose, { Schema, Document } from 'mongoose';
import { Address } from './../types/location.types';

export interface IUser {
  id: string;
  email?: string
  name: string;
  phone: string;
  passwordHash: string;
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
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

type IUserDocument = IUser & Document;

const UserSchema = new Schema<IUserDocument>(
  {
    phone: {
      type: String,
      required: function () { return !this.email; },
      index: true,
    },
    email: {
      type: String,
      required: function () { return !this.phone; },
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
      index: true,
      // DO NOT add default: null!
    },
    name: { type: String, trim: true, default: "Guest User" },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['customer'], index: true },
    isActive: { type: Boolean, default: true, index: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
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
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
      },
    },
    toObject: { virtuals: true },
  }
);



// Pre-save hook: Remove email if it's blank or null
UserSchema.pre('save', function (next) {
  if (typeof this.email === "string" && this.email.trim() === "") {
    this.email = undefined;
  }
  if (this.email === null) {
    this.email = undefined;
  }
  next();
});
// Unique index only on non-null, non-undefined email
UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true, $ne: null } } }
);
UserSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $exists: true, $ne: null } } }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);