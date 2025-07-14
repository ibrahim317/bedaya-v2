import { Schema, model, Model, models } from 'mongoose';
import { IDispensedMedication } from '@/types/DispensedMedication';
import { IDrug } from '@/types/Drug';

const MedicationSchema: Schema<Pick<IDrug, 'name' | 'barcode' | 'expiryDate'>> = new Schema({
    name: { type: String, required: true },
    barcode: { type: String, required: true },
    expiryDate: { type: Date, required: true },
}, { _id: false });

const DispensedMedicationSchema: Schema<IDispensedMedication> = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  medications: [{
    _id: false,
    drug: {
      type: MedicationSchema,
    },
    quantity: { type: Number, required: true },
    quantityType: { type: String, required: true, enum: ['pills', 'strips', 'boxes'] },
    remainingQuantity: { type: Number, default: 0 },
    remainingUnit: { type: String, required: true, enum: ['pills', 'strips', 'boxes'] },
  }],
}, { timestamps: true });

const DispensedMedication: Model<IDispensedMedication> = models.DispensedMedication || model<IDispensedMedication>('DispensedMedication', DispensedMedicationSchema);
export default DispensedMedication;
