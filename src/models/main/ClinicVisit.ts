import { Schema, model, Model, models } from 'mongoose';
import { IClinicVisit } from '@/types/ClinicVisit';

const ClinicVisitSchema: Schema<IClinicVisit> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  patientName: { type: String, required: true, index: true },
  clinicName: { type: String, required: true, index: true },
  diagnoses: { type: [String], default: [] },
  treatments: { type: [String], default: [] },
  followUpImages: { type: [String], default: [] },
  radiologyImages: { type: [String], default: [] },
}, { timestamps: true });

const ClinicVisit: Model<IClinicVisit> = models.ClinicVisit || model<IClinicVisit>('ClinicVisit', ClinicVisitSchema);

export default ClinicVisit; 