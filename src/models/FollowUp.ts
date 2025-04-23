import { Schema, model, Model } from 'mongoose';
import { IFollowUp } from '@/types/FollowUp';

const FollowUpSchema: Schema<IFollowUp> = new Schema({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  needs_checkup: { type: Boolean, default: false },
  needs_drugs: { type: Boolean, default: false },
  needs_operation: { type: Boolean, default: false },
  notes: { type: String },
}, { timestamps: true });

export const FollowUp: Model<IFollowUp> = model<IFollowUp>('FollowUp', FollowUpSchema); 