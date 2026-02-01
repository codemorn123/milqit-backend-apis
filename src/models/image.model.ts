import mongoose, { Schema, PaginateModel } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { IImage } from "./../types/image.type";

const imageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // change type to string if your uploading just one image
    url: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    updateAt: {
      type: Date,
      default: null,
    },
  },
  {
    toJSON: {
      versionKey: false, // Excludes __v from the JSON response
    },
    toObject: {
      versionKey: false, // Excludes __v when using toObject()
    },
  }
);


imageSchema.index({ filename: 1 });
imageSchema.index({ key: 1 });
imageSchema.index({ category: 1 });
imageSchema.index({ createdAt: -1 });

// Apply pagination plugin
imageSchema.plugin(mongoosePaginate);

const imageModel = mongoose.model<IImage, PaginateModel<IImage>>("Image", imageSchema);

export default imageModel;