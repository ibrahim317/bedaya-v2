import { Document, Types } from 'mongoose';

export interface IDrug {
  barcode: string;
  name: string;
  quantityByPills: number;
  stripsPerBox: number;
  pillsPerStrip: number;
  sample: boolean;
  expiryDate: Date | string;
  dailyConsumption?:number[];  // count of drugs consumed par day
  quantityByBoxes?: number;
  dailyConsumptionByBoxes?: number[];

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
