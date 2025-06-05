import { Schema, model, Model, models } from 'mongoose';
import { IPatientDiagnosis } from '@/types/PatientDiagnosis';

const PatientDiagnosisSchema: Schema<IPatientDiagnosis> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinicId: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true, index: true },
  diagnosisName: { type: String, required: true },
}, { timestamps: true });

const PatientDiagnosis: Model<IPatientDiagnosis> = models.PatientDiagnosis || model<IPatientDiagnosis>('PatientDiagnosis', PatientDiagnosisSchema);
export default PatientDiagnosis;
