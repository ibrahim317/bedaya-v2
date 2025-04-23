import { Schema, model, Model } from 'mongoose';
import { IDiagnosis } from '@/types/Diagnosis';

const DiagnosisSchema: Schema<IDiagnosis> = new Schema({
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  diagnosis_name: { type: String, required: true },
  treatment: { type: String },
  report: { type: String },
}, { timestamps: true });

export const Diagnosis: Model<IDiagnosis> = model<IDiagnosis>('Diagnosis', DiagnosisSchema); 