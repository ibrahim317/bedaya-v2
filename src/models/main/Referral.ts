import { Schema, model, Model, models } from 'mongoose';
import { IReferral } from '@/types/Referral';

const ReferralSchema: Schema<IReferral> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  fromClinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  toClinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  reason: { type: String },
  referralDate: { type: Date, default: Date.now },
}, { timestamps: true });

export const Referral: Model<IReferral> = models.Referral || model<IReferral>('Referral', ReferralSchema);