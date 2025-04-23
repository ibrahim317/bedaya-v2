import { Document, Types } from 'mongoose';

export enum PatientType {
    Adult = 'adult',
    Child = 'child',
}

export interface IFamilyHistory {
  condition: string;
  relationship: string;
}

export interface IMedicalHistory {
  type: string;
  description: string;
  additional_info?: string;
  date?: Date;
}

export interface IAttachment {
  type: string;
  url: string;
  uploaded_at: Date;
}

export interface IPatientDrug {
  drug_id: Types.ObjectId;
  checked?: boolean;
}

export interface IPatient extends Document {
  // Core Patient Info
  type: PatientType;
  name: string;
  sex: string;
  house_number?: string;
  mobile_number?: string;
  code?: string;

  // Adult Specific Info
  occupation?: string;
  marital_status?: string;
  education_level?: string;
  smoking_status?: string;
  gravida_number?: number;
  contraception_method?: string;

  // Child Specific Info
  father_occupation?: string;
  birth_term?: string;
  developmental_hist_gross?: string;
  immunization_history?: string;
  birth_mode?: string;

  // Embedded Arrays
  family_history: IFamilyHistory[];
  medical_history: IMedicalHistory[];
  attachments: IAttachment[];
  drugs: IPatientDrug[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
} 