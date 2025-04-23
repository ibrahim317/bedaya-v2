import { Schema, model, Model } from 'mongoose';
import { ILabTest } from '@/types/LabTest';

const LabTestSchema: Schema<ILabTest> = new Schema({
  type: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
}, { timestamps: true });

export const LabTest: Model<ILabTest> = model<ILabTest>('LabTest', LabTestSchema); 