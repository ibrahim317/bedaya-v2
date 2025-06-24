import { Schema } from 'mongoose';

export interface IClinicVisit {
  _id?: string;
  patientId: Schema.Types.ObjectId;
  clinicId: Schema.Types.ObjectId;
  diagnoses: string[];
  treatments: string[];
  images: string[];
  createdAt?: string;
  updatedAt?: string;
} 