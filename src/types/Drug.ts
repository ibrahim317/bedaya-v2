import { Document} from 'mongoose';

export interface IDrug extends Document {
  barcode: string;
  name: string;
  quantity: number;
  stripsPerBox: number ;
  sample: boolean
  expiryDate: Date | string;
  dailyConsumption?:number[];  // count of drugs consumed par day

 // Timestamps
  createdAt?: string | Date;
  updatedAt?: string | Date;
}                   
