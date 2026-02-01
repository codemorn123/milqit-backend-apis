import { Document } from 'mongoose';

export interface IImage extends Document {
  title?: string;
  url?: string;
  key?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IImageUpdate extends Partial<IImage> { }

export interface S3MulterFile extends Express.Multer.File {
  location: string;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  size: number;
  etag: string;
}

export { IImageUpdate };