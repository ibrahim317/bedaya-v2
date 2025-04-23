import { Schema, model, Model } from 'mongoose';
import { IPatient, IFamilyHistory, IMedicalHistory, IAttachment, IPatientDrug, PatientType } from '@/types/Patient';

const FamilyHistorySchema: Schema<IFamilyHistory> = new Schema({
  condition: { type: String, required: true },
  relationship: { type: String, required: true },
}, { _id: false });

const MedicalHistorySchema: Schema<IMedicalHistory> = new Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  additional_info: { type: String },
  date: { type: Date },
}, { _id: false });

const AttachmentSchema: Schema<IAttachment> = new Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  uploaded_at: { type: Date, default: Date.now, required: true },
}, { _id: false });

const PatientDrugSchema: Schema<IPatientDrug> = new Schema({
  drug_id: { type: Schema.Types.ObjectId, ref: 'Drug', required: true },
  checked: { type: Boolean, default: false },
}, { _id: false });

const PatientSchema: Schema<IPatient> = new Schema({
  // Core
  type: { type: String, enum: Object.values(PatientType), required: true, index: true },
  name: { type: String, required: true, index: true },
  sex: { type: String, required: true },
  house_number: { type: String },
  mobile_number: { type: String, index: true },
  code: { type: String, index: true, unique: true, sparse: true },

  // Adult Specific
  occupation: { type: String },
  marital_status: { type: String },
  education_level: { type: String },
  smoking_status: { type: String },
  gravida_number: { type: Number },
  contraception_method: { type: String },

  // Child Specific
  father_occupation: { type: String },
  birth_term: { type: String },
  developmental_hist_gross: { type: String },
  immunization_history: { type: String },
  birth_mode: { type: String },

  // Embedded Arrays
  family_history: [FamilyHistorySchema],
  medical_history: [MedicalHistorySchema],
  attachments: [AttachmentSchema],
  drugs: [PatientDrugSchema],
}, { timestamps: true });

export const Patient: Model<IPatient> = model<IPatient>('Patient', PatientSchema); 