interface IImage {
  title?: string;
  url?: string;
  key?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IImageUpdate extends Partial<IImage> {}

interface S3MulterFile extends Express.Multer.File {
  location: string;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  size: number;
  etag: string;
}

export { IImage, IImageUpdate, S3MulterFile };