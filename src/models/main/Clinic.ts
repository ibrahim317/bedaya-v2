import { Schema, model, Model, models } from 'mongoose';
import { IClinic } from '@/types/Clinic';

const CommonItemSchema = new Schema({
  name: { type: String, required: true }
});

const ClinicSchema: Schema<IClinic> = new Schema({
  name: { type: String, required: true, index: true },
  commonDiagnoses: [CommonItemSchema],
  commonTreatments: [CommonItemSchema],
}, { timestamps: true });

const Clinic: Model<IClinic> = models.Clinic || model<IClinic>('Clinic', ClinicSchema);
export default Clinic;
