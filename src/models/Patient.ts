import { Schema, model, Model } from "mongoose";
import {
  IPatient,
  MedicalHistory,
  FamilyHistory,
  IAttachment,
  IPatientDrug,
  PatientType,
  IPatientLabTest,
  PatientLabTestStatus,
  PatientLabTestResult,
  Screening,
  AllergyHistory,
  BloodTransfusion,
  SurgicalHistory,
  DrugForChronicDisease,
  VitalData,
  Complexions,
  GeneralExamination,
  ReferralOfConvoyClinic,
  MaritalStatus,
  EducationLevel,
  SmokingStatus,
  SmokingCessation,
  Menstruation,
  Contraception,
  Cyanosis,
  BirthMode,
  BirthTerm,
  LocalExamination,
  ImmunizationHistory,
  DieteticHistory,
  DevelopmentalHistory,
  AntenatalHistory,
  NatalHistory,
  NeonatalHistory,
  ICUHistory,
  Anthropometry,
} from "@/types/Patient";

const FamilyHistorySchema: Schema<FamilyHistory> = new Schema(
  {
    similarCondition: { type: Boolean, required: true, default: false },
    HTN: { type: Boolean, required: true, default: false },
    DM: { type: Boolean, required: true, default: false },
    other: { type: String },
  },
  { _id: false }
);

const ScreeningSchema: Schema<Screening> = new Schema(
  {
    nephropathy: { type: Boolean, required: true, default: false },
    UTI: { type: Boolean, required: true, default: false },
    OGTT: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const MedicalHistorySchema: Schema<MedicalHistory> = new Schema(
  {
    DM: { type: Boolean, required: true, default: false },
    HTN: { type: Boolean, required: true, default: false },
    HCV: { type: Boolean, required: true, default: false },
    RHD: { type: Boolean, required: true, default: false },
    enabled: { type: Boolean, required: true, default: false },
    other: { type: String },
  },
  { _id: false }
);

const AllergyHistorySchema: Schema<AllergyHistory> = new Schema(
  {
    enabled: { type: Boolean, required: true },
    type: { type: String, required: function() { return this.enabled === true; } },
  },
  { _id: false }
);

const BloodTransfusionSchema = new Schema({
  enabled: { type: Boolean, default: false, required: true },
  occasional: { type: Boolean, default: false, required: true },
  regualr: { type: Boolean, default: false, required: true },
}, { _id: false });

const SurgicalHistorySchema = new Schema({
  enabled: { type: Boolean, default: false, required: true },
  ICU: { type: Boolean, default: false, required: true },
  operation: new Schema({
    enabled: { type: Boolean, default: false, required: true },
    type: { type: String, default: "" },
  }, { _id: false }),
}, { _id: false });

const DrugForChronicDiseaseSchema: Schema<DrugForChronicDisease> = new Schema(
  {
    antiHTN: { type: Boolean, default: false, required: true },
    oralHypoglycemic: { type: Boolean, default: false, required: true },
    antiepileptic: { type: Boolean, default: false, required: true },
    antidiabetic: { type: Boolean, default: false, required: true },
    other: { type: String },
  },
  { _id: false }
);

const ComplexionsSchema: Schema<Complexions> = new Schema(
  {
    cyanosis: { type: String, enum: Object.values(Cyanosis), default: Cyanosis.None },
    jaundice: { type: Boolean, default: false },
    pallor: { type: Boolean, default: false },
  },
  { _id: false }
);

const AnthropometrySchema = new Schema({
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  OFC: { type: Number, required: true },
  weightForAge: { type: Number, required: true },
  heightForAge: { type: Number, required: true },
  deformity: { type: Boolean, default: false },
}, { _id: false });

const VitalDataSchema = new Schema({
  BP: { type: String, default: "" },
  PR: { type: String, default: "" },
  RR: { type: String, default: "" },
  CRT: { type: String }, // for child
  RBS: { type: String }, // for child
  Spo2: { type: String }, // for child
  temperature: { type: String, default: "" },
}, { _id: false });

const BirthModeSchema = new Schema({
  VD: { type: Boolean, default: false },
  CS: { type: Boolean, default: false },
  CS_reason: { type: String },
}, { _id: false });

const BirthTermSchema = new Schema({
  fullTerm: { type: Boolean, default: false },
  preterm: { type: Boolean, default: false },
  weeks: { type: Number },
}, { _id: false });

const LocalExaminationSchema = new Schema({
  main: { type: String },
  cardiac: { type: String },
  chest: { type: String },
  abdominal: { type: String },
}, { _id: false });

const ImmunizationHistorySchema = new Schema({
  upToDate: { type: Boolean, default: false },
  delayed: { type: Boolean, default: false },
  noVaccinations: { type: Boolean, default: false },
}, { _id: false });

const DieteticHistorySchema = new Schema({
  breastFeeding: { type: Boolean, default: false },
  artificialFeeding: { type: Boolean, default: false },
  combined: { type: Boolean, default: false },
  weaning: { type: Boolean, default: false },
}, { _id: false });

const DevelopmentalHistorySchema = new Schema({
  grossMotor: { type: String },
  fineMotor: { type: String },
  language: { type: String },
  social: { type: String },
  sphincter: { type: String },
}, { _id: false });

const AntenatalHistorySchema = new Schema({
  storch: { type: String },
  disease: { type: String },
  irradiation: { type: String },
  teratogenicdrugs: { type: String },
  hospitalization: { type: String },
}, { _id: false });

const NatalHistorySchema = new Schema({
  prematureRupture: { type: Boolean, default: false },
  prolongedDelivery: { type: Boolean, default: false },
  place: {
    hospital: { type: Boolean, default: false },
    home: { type: Boolean, default: false },
  },
}, { _id: false });

const NeonatalHistorySchema = new Schema({
  NICU: { type: String },
  Cyanosis: { type: String },
  Jaundice: { type: String },
  Pallor: { type: String },
  Convulsions: { type: String },
}, { _id: false });

const ICUHistorySchema = new Schema({
  enabled: { type: Boolean, default: false },
  other: { type: String },
}, { _id: false });

const GeneralExaminationSchema = new Schema({
  vitalData: { type: VitalDataSchema, required: true },
  complexions: { type: ComplexionsSchema, required: true },
  anthropometry: { type: AnthropometrySchema },
}, { _id: false });

const ReferralOfConvoyClinicSchema: Schema<ReferralOfConvoyClinic> = new Schema(
  {
    IM: { type: Boolean, default: false, required: true },
    cardio: { type: Boolean, default: false, required: true },
    surgery: { type: Boolean, default: false, required: true },
    ophth: { type: Boolean, default: false, required: true },
    obsAndGyn: { type: Boolean, default: false, required: true },
    ENT: { type: Boolean, default: false, required: true },
    derma: { type: Boolean, default: false, required: true },
    ortho: { type: Boolean, default: false, required: true },
    dental: { type: Boolean, default: false, required: true },
    goHome: { type: Boolean, default: false, required: true },
  },
  { _id: false }
);

const SmokingStatusSchema = new Schema({
  enabled: { type: Boolean, default: false, required: true },
  type: { type: String, default: "" },
  other: { type: String },
  smokingPerDay: { type: Number },
}, { _id: false });

const SmokingCessationSchema = new Schema({
  enabled: { type: Boolean, default: false },
  duration: { type: Number, required: function(this: { enabled: boolean }) { return this.enabled === true; } },
}, { _id: false });

const MenstruationSchema: Schema<Menstruation> = new Schema(
  {
    type: { type: String, enum: ["Regular", "Irregular", "Menopause"], required: true },
    gravidaNumber: { type: Number },
    abortionNumber: { type: Number },
  },
  { _id: false }
);

const ContraceptionSchema = new Schema({
  enabled: { type: Boolean, required: true, default: false },
  method: { 
      type: String, 
      enum: ["IUD", "Implant", "DOC", "Other"],
      required: function(this: { enabled: boolean }) { return this.enabled === true; }
    },
    other: { type: String },
  },
  { _id: false }
);

const AttachmentSchema: Schema<IAttachment> = new Schema(
  {
    type: { type: String, required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now, required: true },
  },
  { _id: false }
);

const PatientDrugSchema: Schema<IPatientDrug> = new Schema(
  {
    drugId: { type: Schema.Types.ObjectId, ref: "Drug", required: true },
    quantity: { type: Number },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const PatientLabTestResultSchema: Schema<PatientLabTestResult> = new Schema(
  {
    name: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    unit: { type: String, required: true },
    refValue: { type: String, required: true },
  },
  { _id: false }
);

const PatientLabTestSchema: Schema<IPatientLabTest> = new Schema(
  {
    labtestId: { type: Schema.Types.ObjectId, ref: "LabTest", required: true },
    status: {
      type: String,
      enum: Object.values(PatientLabTestStatus),
      required: true,
    },
    results: [PatientLabTestResultSchema],
  },
  { _id: false }
);

const PatientSchema: Schema<IPatient> = new Schema(
  {
    // Core
    type: {
      type: String,
      enum: Object.values(PatientType),
      required: true,
      index: true,
    },
    name: { type: String, required: true, index: true },
    sex: { type: String, required: true },
    age: { type: Number },
    houseNumber: { type: String },
    mobileNumber: { type: String, index: true },
    code: { type: String, index: true, unique: true, sparse: true },
    checkupDay: { type: Number, default: 1, required: true, min: 1, max: 5 },

    // Adult Specific
    occupation: { type: String },
    maritalStatus: { 
      type: String,
      enum: Object.values(MaritalStatus),
    },
    educationLevel: { 
      type: String,
      enum: Object.values(EducationLevel),
    },
    smokingStatus: { type: SmokingStatusSchema },
    smokingCessation: { type: SmokingCessationSchema },
    menstruation: { type: MenstruationSchema },
    contraceptionMethod: { type: ContraceptionSchema },

    // Medical Information
    medicalHistory: { type: MedicalHistorySchema },
    allergyHistory: { type: AllergyHistorySchema },
    bloodTransfusion: { type: BloodTransfusionSchema },
    surgicalHistory: { type: SurgicalHistorySchema },
    drugsForChronicDisease: { type: DrugForChronicDiseaseSchema },
    familyHistory: { type: FamilyHistorySchema },
    screening: { type: ScreeningSchema },
    icuHistory: { type: ICUHistorySchema },

    // Child Specific
    fatherOccupation: { type: String },
    fatherEducationLevel: { type: String, enum: Object.values(EducationLevel) },
    motherEducationLevel: { type: String, enum: Object.values(EducationLevel) },
    birthTerm: { type: BirthTermSchema },
    consanguinity: { type: Boolean },
    NICUAdmission: { type: String },
    orderOfBirth: { type: String },
    birthMode: { type: BirthModeSchema },
    followUpType: { type: String, enum: ["Pediatric", "Other"] },
    localExamination: { type: LocalExaminationSchema },

    // Child History
    immunizationHistory: { type: ImmunizationHistorySchema },
    dieteticHistory: { type: DieteticHistorySchema },
    developmentalHistory: { type: DevelopmentalHistorySchema },
    antenatalHistory: { type: AntenatalHistorySchema },
    natalHistory: { type: NatalHistorySchema },
    neonatalHistory: { type: NeonatalHistorySchema },

    // Status Flags
    followUp: { type: Boolean, required: true },
    communityDevelopment: { type: Boolean, required: true },

    // Referral
    referralOfConvoyClinic: { type: ReferralOfConvoyClinicSchema },

    // Embedded Arrays
    complaints: [{ type: String }],
    generalExamination: { type: GeneralExaminationSchema, required: true },
    attachments: [AttachmentSchema],
    drugs: [PatientDrugSchema],
    labTest: [PatientLabTestSchema],
  },
  { timestamps: true }
);

export const Patient: Model<IPatient> = model<IPatient>(
  "Patient",
  PatientSchema
);
