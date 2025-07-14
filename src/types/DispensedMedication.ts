import { Document, ObjectId } from 'mongoose';
import { IDrugWithId } from './Drug';

export interface IDispensedMedication extends Document {
  patientId: ObjectId;
  medications: {
    drug: {
      name: string;
      barcode: string;
      expiryDate: Date | string;
    };
    quantity: number;
    quantityType: 'pills' | 'strips' | 'boxes';
    remainingQuantity: number;
    remainingUnit: 'pills' | 'strips' | 'boxes';
  }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IPopulatedDispensedMedication extends Omit<IDispensedMedication, 'medications' | 'patientId'> {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    code: string;
  },
  medications: {
    drug: {
      name: string;
      barcode: string;
      expiryDate: Date | string;
    };
    quantity: number;
    quantityType: 'pills' | 'strips' | 'boxes';
    remainingQuantity: number;
    remainingUnit: 'pills' | 'strips' | 'boxes';
  }[];
}

export type DispensedMedicationData = {
    patientId: string;
    medications: {
      drug: {
        name: string;
        barcode: string;
        expiryDate: Date | string;
      };
      quantity: number;
      quantityType: 'pills' | 'strips' | 'boxes';
      remainingQuantity: number;
      remainingUnit: 'pills' | 'strips' | 'boxes';
    }[];
}