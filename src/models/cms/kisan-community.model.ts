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
    toJSON: {
      virtuals: true,
      transform: function (doc: IKisanCommunityDocument, ret: any) {
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

// Apply pagination plugin
kisanCommunitySchema.plugin(mongoosePaginate);

const KisanCommunityModel = model<IKisanCommunityDocument, PaginateModel<IKisanCommunityDocument>>('KisanCommunity', kisanCommunitySchema);

export default KisanCommunityModel;