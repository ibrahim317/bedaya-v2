import { Schema } from 'mongoose';

export interface IClinicVisit {
  _id?: string;
  patientId: Schema.Types.ObjectId;
  clinicId: Schema.Types.ObjectId;
  patientName: string;
  clinicName: string;
  diagnoses: string[];
  treatments: string[];
  followUpImages: string[];
  radiologyImages: string[];
  createdAt?: string;
  updatedAt?: string;
} 