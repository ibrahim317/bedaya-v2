import { Document, Types } from 'mongoose';

export interface IDrug {
  barcode: string;
  name: string;
  quantityByPills: number;
  stripsPerBox: number;
  pillsPerStrip: number;
  sample: boolean;
  expiryDate: Date | string;
  remains?: string;
  dailyConsumption?:number[];  // count of drugs consumed par day

 // Timestamps
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IDrugDocument extends IDrug, Document {
  _id: Types.ObjectId;
}

export interface IDrugWithId extends IDrug {
  _id: string;
}                   
