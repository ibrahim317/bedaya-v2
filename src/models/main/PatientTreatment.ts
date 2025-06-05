import { Schema, model, Model, models } from 'mongoose';
import { IPatientTreatment } from '@/types/PatientTreatment';

const PatientTreatmentSchema: Schema<IPatientTreatment> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  treatmentName: { type: String, required: true },
}, { timestamps: true });

const PatientTreatment: Model<IPatientTreatment> = models.PatientTreatment || model<IPatientTreatment>('PatientTreatment', PatientTreatmentSchema);
export default PatientTreatment;
