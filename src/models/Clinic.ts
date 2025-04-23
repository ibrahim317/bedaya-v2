import { Schema, model, Model } from 'mongoose';
import { IClinic } from '@/types/Clinic';

const ClinicSchema: Schema<IClinic> = new Schema({
  name: { type: String, required: true, index: true },
}, { timestamps: true });

export const Clinic: Model<IClinic> = model<IClinic>('Clinic', ClinicSchema); 