import { Schema, model, Model, models } from 'mongoose';
import { IDispensedMedication } from '@/types/DispensedMedication';

const DispensedMedicationSchema: Schema<IDispensedMedication> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  medications: [{
    drug: { type: Schema.Types.ObjectId, ref: 'Drug', required: true },
    quantity: { type: Number, required: true },
  }],
}, { timestamps: true });

const DispensedMedication: Model<IDispensedMedication> = models.DispensedMedication || model<IDispensedMedication>('DispensedMedication', DispensedMedicationSchema);
export default DispensedMedication;
