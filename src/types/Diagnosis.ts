import { Document, Types } from 'mongoose';

export interface IDiagnosis extends Document {
  patientId: Types.ObjectId;
  clinicId: Types.ObjectId;
  diagnosisName: string;
  treatment?: string;
  report?: string;
  createdAt: Date;
  updatedAt: Date;
} 