import { Schema, model, Model } from 'mongoose';
import { IDrug } from '@/types/Drug';

const DrugSchema: Schema<IDrug> = new Schema({
  name: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

export const Drug: Model<IDrug> = model<IDrug>('Drug', DrugSchema); 