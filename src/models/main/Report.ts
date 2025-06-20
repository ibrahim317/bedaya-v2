import { Schema, model, models, Model, Document } from 'mongoose';
import { QueryPayload } from '@/types/Query';

export interface IReport extends Document {
  name: string;
  description: string;
  query: QueryPayload;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    query: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Report: Model<IReport> =
  models.Report || model<IReport>('Report', ReportSchema);

export default Report; 