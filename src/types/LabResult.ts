import { Document, Types } from 'mongoose';

export interface ILabResult extends Document {
  patient_id: Types.ObjectId;
  test_id: Types.ObjectId;
  value: string;
  report?: string;
  checked?: boolean;
  test_date?: Date;
  createdAt: Date;
  updatedAt: Date;
} 