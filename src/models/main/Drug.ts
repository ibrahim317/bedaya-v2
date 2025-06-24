import { Schema, model, Model, models } from 'mongoose';
import { IDrug } from '@/types/Drug';

const DrugSchema: Schema<IDrug> = new Schema({
  barcode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  quantityByPills: { type: Number, required: true },
  stripsPerBox: { type: Number, required: true },
  pillsPerStrip: { type: Number, required: true },
  sample: { type: Boolean, required: true ,default: false },
  expiryDate: { type: Date, required: true },
  dailyConsumption: { type: [Number], required: false, default: [0, 0, 0, 0, 0] },
}, { timestamps: true });
const Drug: Model<IDrug> = models.Drug || model<IDrug>('Drug', DrugSchema);
export default Drug; 
