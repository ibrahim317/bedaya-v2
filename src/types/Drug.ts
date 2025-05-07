import { Document} from 'mongoose';

export interface IDrug extends Document {
  drugId: String; //barcode
  name: string;
  Quantity: number;
  stripInTHeBox: number ;
  sample: boolean
  ExpiryDate: Date;
  DailyConsumption?:number[];  // count of drugs consumed par day

 // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
} 
