// src/features/kisan-community/kisan-community.model.ts

import { IKisanCommunity } from './../../types/kisan-community.types';
import { Document, model, Schema, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IKisanCommunityDocument extends IKisanCommunity, Document { }
const kisanCommunitySchema = new Schema<IKisanCommunityDocument>(
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
    id: false,
    toJSON: {
      virtuals: true,
      transform: function (doc: IKisanCommunityDocument, ret: any) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc: IKisanCommunityDocument, ret: any) {
        delete ret.__v;
        return ret;
      }
    }
  }

);

// Apply pagination plugin
kisanCommunitySchema.plugin(mongoosePaginate);

const KisanCommunityModel = model<IKisanCommunityDocument, PaginateModel<IKisanCommunityDocument>>('KisanCommunity', kisanCommunitySchema);

export default KisanCommunityModel;