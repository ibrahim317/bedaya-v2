import { Document, Types } from 'mongoose';

export interface IReferral extends Document {
  patient_id: Types.ObjectId;
  from_clinic_id: Types.ObjectId;
  to_clinic_id: Types.ObjectId;
  reason?: string;
  referral_date?: Date;
  createdAt: Date;
  updatedAt: Date;
} 