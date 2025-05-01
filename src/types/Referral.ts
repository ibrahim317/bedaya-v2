import { Document, Types } from 'mongoose';

export interface IReferral extends Document {
  patientId: Types.ObjectId;
  fromClinicId: Types.ObjectId;
  toClinicId: Types.ObjectId;
  reason?: string;
  referralDate?: Date;
  createdAt: Date;
  updatedAt: Date;
} 