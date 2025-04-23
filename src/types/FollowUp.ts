import { Document, Types } from 'mongoose';

export interface IFollowUp extends Document {
  patient_id: Types.ObjectId;
  clinic_id: Types.ObjectId;
  needs_checkup?: boolean;
  needs_drugs?: boolean;
  needs_operation?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 