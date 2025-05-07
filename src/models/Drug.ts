import { Schema, model, Model, models } from 'mongoose';
import { IDrug } from '@/types/Drug';

const DrugSchema: Schema<IDrug> = new Schema({
  drugId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  Quantity: { type: Number, required: true },
  stripInTHeBox: { type: Number, required: true },
  sample: { type: Boolean, required: true ,default: false },
  ExpiryDate: { type: Date, required: true },
  DailyConsumption: { type: [Number], required: false, default: [0, 0, 0, 0, 0] },
  createdAt: { type: Date, required: false, default: Date.now },
  updatedAt: { type: Date, required: false, default: Date.now },
});
const Drug: Model<IDrug> = models.Drug || model<IDrug>('Drug', DrugSchema);
export default Drug; 
