// src/features/kisan-community/kisan-community.types.ts

import { Document } from 'mongoose';

export interface IKisanCommunity  {
  farmerName: string;
  farmName: string;
  farmLocation: string;
  mobile: string;
  email?: string;
  products: string;
  description: string;
  profileImage?: {
    url: string;
    key: string;
  };
  createdAt: Date;
  updatedAt: Date;
}




