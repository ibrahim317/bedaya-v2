import { Document } from 'mongoose';
import { ICommonDiagnosis } from './CommonDiagnosis';
import { ICommonTreatment } from './CommonTreatment';
export interface IClinic extends Document {
  name: string;
  commonDiagnoses: ICommonDiagnosis[];
  commonTreatments: ICommonTreatment[];
  enableImages?: boolean;
} 