import { Schema, model, Model } from 'mongoose';
import { IDiagnosis } from '@/types/Diagnosis';

const DiagnosisSchema: Schema<IDiagnosis> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  diagnosisName: { type: String, required: true },
  treatment: { type: String },
  report: { type: String },
}, { timestamps: true });

export const Diagnosis: Model<IDiagnosis> = model<IDiagnosis>('Diagnosis', DiagnosisSchema); 