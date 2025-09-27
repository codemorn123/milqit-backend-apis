import { Document, Types } from 'mongoose';

interface IBase extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export { IBase };