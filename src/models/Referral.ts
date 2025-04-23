import { Schema, model, Model } from 'mongoose';
import { IReferral } from '@/types/Referral';

const ReferralSchema: Schema<IReferral> = new Schema({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  from_clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  to_clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  reason: { type: String },
  referral_date: { type: Date, default: Date.now },
}, { timestamps: true });

export const Referral: Model<IReferral> = model<IReferral>('Referral', ReferralSchema); 