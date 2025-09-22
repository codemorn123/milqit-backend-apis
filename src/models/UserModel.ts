import mongoose, { Schema, Document } from 'mongoose';
import { UserProfile } from '../types/auth.types';
import { Address } from './../types/location.types';



export interface IUser {
  id: string;
  email: string | null;
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
  isNewUser: boolean;
  // currentLocation?: {
  //   type: string;
  //   coordinates: [number, number]; // [longitude, latitude]
  // };

  currentLocation?: {
    type: string;
    // FIX: Changed from tuple [number, number] to a number array number[]
    // This makes the type compatible with TSOA's metadata generator.
    coordinates: number[]; // [longitude, latitude]
  };
  lastLocationUpdate?: Date;

}


type IUserDocument = IUser & Document;

const UserSchema = new Schema<IUserDocument>(
  {
    // email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true,   sparse: true,  },

    email: {
      type: String,
      // Email is only required if a phone number is NOT provided
      required: function(this: IUserDocument) {
          return !this.phone;
      },
      // required: false,

      unique: false, 
      trim: true,
      lowercase: true,

     
      
  },
    name: { type: String, required: true, trim: true },
    // phone: { type: String, sparse: true, unique: true, index: true },
    // phone: { type: String, required: false, index: true, sparse: true, unique: true },

    // email: { type: String, required: fa, unique: true, index: true },
    phone: { 
      type: String,  
      unique: true, // A unique index on phone is correct.
      index: true,
      required: function() {
        return !this.email;
      },
    },


    
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['customer'], index: true },
    isActive: { type: Boolean, default: true, index: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isNewUser: { type: Boolean, default: true },
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



UserSchema.pre('save', function(next) {
  // 'this' refers to the document being saved
  if (this.email === '') {
    this.email = null;
  }
  next();
});

UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      // The index will only apply to documents that have an 'email' field
      // that is not null.
      email: { $exists: true, $ne: null }
    }
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
