import { Schema, model, Model, models } from 'mongoose';
import { IFollowUp } from '@/types/FollowUp';

const FollowUpSchema: Schema<IFollowUp> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  needsCheckup: { type: Boolean, default: false },
  needsDrugs: { type: Boolean, default: false },
  needsOperation: { type: Boolean, default: false },
  notes: { type: String },
}, { timestamps: true });

export const FollowUp: Model<IFollowUp> = models.FollowUp || model<IFollowUp>('FollowUp', FollowUpSchema);