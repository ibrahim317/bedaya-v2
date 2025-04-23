import { Schema, model, Model } from 'mongoose';
import { ILabResult } from '@/types/LabResult';

const LabResultSchema: Schema<ILabResult> = new Schema({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  test_id: { type: Schema.Types.ObjectId, ref: 'LabTest', required: true },
  value: { type: String, required: true },
  report: { type: String },
  checked: { type: Boolean, default: false },
  test_date: { type: Date, default: Date.now },
}, { timestamps: true });

export const LabResult: Model<ILabResult> = model<ILabResult>('LabResult', LabResultSchema); 