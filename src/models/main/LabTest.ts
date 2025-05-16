import { Schema, model, Model, models } from 'mongoose';
import { ILabTest } from '@/types/LabTest';

const LabTestSchema: Schema<ILabTest> = new Schema({
  type: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
}, { timestamps: true });

export const LabTest: Model<ILabTest> = models.LabTest || model<ILabTest>('LabTest', LabTestSchema); 