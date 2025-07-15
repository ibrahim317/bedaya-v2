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
}, {
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
});

DrugSchema.set('toObject', { virtuals: true, getters: true });
DrugSchema.set('toJSON', { virtuals: true, getters: true });


DrugSchema.virtual('quantityByBoxes', {
  c_type: 'Number',
  c_dependencies: ['quantityByPills', 'stripsPerBox', 'pillsPerStrip'],
}).get(function(this: IDrug) {
  const pillsPerBox = this.stripsPerBox * this.pillsPerStrip;
  if (pillsPerBox > 0) {
    return Math.ceil(this.quantityByPills / pillsPerBox);
  }
  return 0;
});

DrugSchema.virtual('dailyConsumptionByBoxes', {
  c_type: 'Array',
  c_dependencies: ['dailyConsumption', 'stripsPerBox', 'pillsPerStrip'],
}).get(function(this: IDrug) {
  if (!this.dailyConsumption) return [];

  const pillsPerBox = this.stripsPerBox * this.pillsPerStrip;
  if (pillsPerBox > 0) {
    return this.dailyConsumption.map((pills: number) => Math.ceil(pills / pillsPerBox));
  }

  return Array(this.dailyConsumption.length).fill(0);
});

const Drug: Model<IDrug> = models.Drug || model<IDrug>('Drug', DrugSchema);
export default Drug; 
