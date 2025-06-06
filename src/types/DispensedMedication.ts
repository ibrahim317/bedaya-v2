import { Document, ObjectId } from 'mongoose';
import { IDrug } from './Drug';

export interface IDispensedMedication extends Document {
  patientId: ObjectId;
  medications: {
    drug: ObjectId;
    quantity: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedDispensedMedication extends Omit<IDispensedMedication, 'medications'> {
  medications: {
    drug: IDrug;
    quantity: number;
  }[];
}

export type DispensedMedicationData = {
    patientId: string;
    medications: {
      drug: string;
      quantity: number;
    }[];
}