// src/features/kisan-community/kisan-community.model.ts

import { IKisanCommunity } from './../../types/kisan-community.types';
import { Document, model, Schema } from 'mongoose';

type KisanCommunityDocument = IKisanCommunity & Document;
const kisanCommunitySchema = new Schema<KisanCommunityDocument>(
  {
    farmerName: { type: String, required: true, trim: true },
    farmName: { type: String, required: true, trim: true },
    farmLocation: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, trim: true },
    products: { type: String, required: true },
    description: { type: String, required: true },
    profileImage: {
      url: { type: String },
      key: { type: String },
    },
  },
  {
    
        timestamps: true, 
        versionKey: false,
        toJSON: { 
          virtuals: true,
          transform: function(doc: KisanCommunityDocument, ret: any) {
            // delete ret._id;
            delete ret.__v;
            // ret.id = doc._id?.toString();
            return ret;
          }
        },
        toObject: { 
          virtuals: true 
        }
      }
  
);

const KisanCommunityModel = model<KisanCommunityDocument>('KisanCommunity', kisanCommunitySchema);

export default KisanCommunityModel;