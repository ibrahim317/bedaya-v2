import { Document, Types } from 'mongoose';

export interface ILabResult extends Document {
  patientId: Types.ObjectId;
  testId: Types.ObjectId;
  value: string;
  report?: string;
  checked?: boolean;
  testDate?: Date;
  createdAt: Date;
  updatedAt: Date;
} 