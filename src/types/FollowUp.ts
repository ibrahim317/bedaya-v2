import { Document, Types } from 'mongoose';

export interface IFollowUp extends Document {
  patientId: Types.ObjectId;
  clinicId: Types.ObjectId;
  needsCheckup?: boolean;
  needsDrugs?: boolean;
  needsOperation?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
} 