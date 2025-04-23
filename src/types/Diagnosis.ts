import { Document, Types } from 'mongoose';

export interface IDiagnosis extends Document {
  patient_id: Types.ObjectId;
  clinic_id: Types.ObjectId;
  diagnosis_name: string;
  treatment?: string;
  report?: string;
  createdAt: Date;
  updatedAt: Date;
} 