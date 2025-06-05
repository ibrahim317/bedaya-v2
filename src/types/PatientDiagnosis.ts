import { Document, Types } from 'mongoose';

export interface IPatientDiagnosis extends Document {
  patientId: Types.ObjectId;
  clinicId: Types.ObjectId;
  diagnosisName: string;
  createdAt: Date;
  updatedAt: Date;
} 