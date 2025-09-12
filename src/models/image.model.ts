import mongoose, { Schema } from "mongoose";
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

const imageModel = mongoose.model<IImage>("Image", imageSchema);

export default imageModel;