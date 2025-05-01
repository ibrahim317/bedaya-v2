import { Schema, model, Model } from 'mongoose';
import { ILabResult } from '@/types/LabResult';

const LabResultSchema: Schema<ILabResult> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  testId: { type: Schema.Types.ObjectId, ref: 'LabTest', required: true },
  value: { type: String, required: true },
  report: { type: String },
  checked: { type: Boolean, default: false },
  testDate: { type: Date, default: Date.now },
}, { timestamps: true });

export const LabResult: Model<ILabResult> = model<ILabResult>('LabResult', LabResultSchema);