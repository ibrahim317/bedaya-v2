import { Schema, model, Model, models } from "mongoose";
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
  ChildFamilyHistory,
} from "@/types/Patient";

const FamilyHistorySchema: Schema<FamilyHistory> = new Schema(
  {
    similarCondition: { type: Boolean, default: false },
    HTN: { type: Boolean, default: false },
    DM: { type: Boolean, default: false },
    other: { type: String },
  },
  { _id: false }
);

const ChildFamilyHistorySchema: Schema<ChildFamilyHistory> = new Schema(
  {
    similarCondition: { type: String, default: "" },
    HTN: { type: String, default: "" },
    DM: { type: String, default: "" },
    geneticDisease: { type: String, default: "" },
    other: { type: String },
  },
  { _id: false }
);
const ScreeningSchema: Schema<Screening> = new Schema(
  {
    nephropathy: { type: Boolean, default: false },
    UTI: { type: Boolean, default: false },
    OGTT: { type: Boolean, default: false },
    rickets: { type: Boolean, default: false },
    anemia: { type: Boolean, default: false },
    parasites: { type: Boolean, default: false },
    DM: { type: Boolean, default: false },
  },
  { _id: false }
);

const MedicalHistorySchema: Schema<MedicalHistory> = new Schema(
  {
    DM: { type: Boolean, default: false },
    HTN: { type: Boolean, default: false },
    HCV: { type: Boolean, default: false },
    RHD: { type: Boolean, default: false },
    enabled: { type: Boolean, default: false },
    other: { type: String },
  },
  { _id: false }
);

const AllergyHistorySchema: Schema<AllergyHistory> = new Schema(
  {
    enabled: { type: Boolean },
    type: { type: String },
  },
  { _id: false }
);

const BloodTransfusionSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    type: {type: String, enum: ["occasional","regular"]},
    duration: { type: String },
    details: { type: String },
  },
  { _id: false }
);

const SurgicalHistorySchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    ICU: { type: Boolean, default: false },
    operation: new Schema(
      {
        enabled: { type: Boolean, default: false },
        type: { type: String, default: "" },
      },
      { _id: false }
    ),
  },
  { _id: false }
);

const DrugForChronicDiseaseSchema: Schema<DrugForChronicDisease> = new Schema(
  {
    antiHTN: { type: Boolean, default: false },
    oralHypoglycemic: { type: Boolean, default: false },
    antiepileptic: { type: Boolean, default: false },
    antidiuretic: { type: Boolean, default: false },
    other: { type: String },
  },
  { _id: false }
);

const CyanosisSchema = new Schema(
  {
    peripheral: { type: Boolean, default: false },
    central: { type: Boolean, default: false },
  },
  { _id: false }
);

const ComplexionsSchema: Schema<Complexions> = new Schema(
  {
    cyanosis: { type: CyanosisSchema },
    jaundice: { type: Boolean, default: false },
    pallor: { type: Boolean, default: false },
  },
  { _id: false }
);

const AdultAnthropometrySchema = new Schema(
  {
    weight: { type: Number },
    height: { type: Number },
    BMI: { type: Number },
  },
  { _id: false }
);

const AnthropometrySchema = new Schema(
  {
    weight: { type: Number },
    height: { type: Number },
    OFC: { type: Number },
    weightForAge: { type: Number },
    heightForAge: { type: Number },
    weightForHeight: { type: Number },
    deformity: { type: Boolean, default: false },
  },
  { _id: false }
);

const VitalDataSchema = new Schema(
  {
    BP: { type: String, default: "" },
    PR: { type: String, default: "" },
    RR: { type: String, default: "" },
    CRT: { type: String }, // for child
    RBS: { type: String }, // for child
    Spo2: { type: String }, // for child
    temperature: { type: String, default: "" },
  },
  { _id: false }
);

const BirthModeSchema = new Schema(
  {
    VD: { type: Boolean, default: false },
    CS: { type: Boolean, default: false },
    CS_reason: { type: String },
  },
  { _id: false }
);

const BirthTermSchema = new Schema(
  {
    fullTerm: { type: Boolean, default: false },
    preterm: { type: Boolean, default: false },
    weeks: { type: Number },
  },
  { _id: false }
);

const LocalExaminationSchema = new Schema(
  {
    main: { type: String },
    cardiac: { type: String },
    chest: { type: String },
    abdominal: { type: String },
  },
  { _id: false }
);

const ImmunizationHistorySchema = new Schema(
  {
    upToDate: { type: Boolean, default: false },
    delayed: { type: Boolean, default: false },
    noVaccinations: { type: Boolean, default: false },
  },
  { _id: false }
);

const DieteticHistorySchema = new Schema(
  {
    breastFeeding: { type: Boolean, default: false },
    artificialFeeding: { type: Boolean, default: false },
    combined: { type: Boolean, default: false },
    weaning: { type: Boolean, default: false },
  },
  { _id: false }
);

const DevelopmentalHistorySchema = new Schema(
  {
    grossMotor: { type: String },
    fineMotor: { type: String },
    language: { type: String },
    social: { type: String },
    sphincter: { type: String },
  },
  { _id: false }
);

const AntenatalHistorySchema = new Schema(
  {
    storch: { type: String },
    disease: { type: String },
    irradiation: { type: String },
    teratogenicdrugs: { type: String },
    hospitalization: { type: String },
  },
  { _id: false }
);

const NatalHistorySchema = new Schema(
  {
    prematureRupture: { type: Boolean, default: false },
    prolongedDelivery: { type: Boolean, default: false },
    place: {
      hospital: { type: Boolean, default: false },
      home: { type: Boolean, default: false },
    },
  },
  { _id: false }
);

const NeonatalHistorySchema = new Schema(
  {
    NICU: { type: String },
    Cyanosis: { type: String },
    Jaundice: { type: String },
    Pallor: { type: String },
    Convulsions: { type: String },
  },
  { _id: false }
);

const ICUHistorySchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    other: { type: String },
  },
  { _id: false }
);

const GeneralExaminationSchema = new Schema(
  {
    vitalData: { type: VitalDataSchema },
    complexions: { type: ComplexionsSchema },
    anthropometry: { type: AnthropometrySchema },
  },
  { _id: false }
);

const ReferralOfConvoyClinicSchema: Schema<ReferralOfConvoyClinic> = new Schema(
  {
    IM: { type: Boolean, default: false },
    cardio: { type: Boolean, default: false },
    surgery: { type: Boolean, default: false },
    ophth: { type: Boolean, default: false },
    obsAndGyn: { type: Boolean, default: false },
    gyn: { type: Boolean, default: false },
    ENT: { type: Boolean, default: false },
    derma: { type: Boolean, default: false },
    ortho: { type: Boolean, default: false },
    pharmacy: { type: Boolean, default: false },
    dental: { type: Boolean, default: false },
    goHome: { type: Boolean, default: false },
    other: { type: String },
  },
  { _id: false }
);

const SmokingStatusSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    type: { type: String, default: "" },
    other: { type: String },
    smokingPerDay: { type: Number },
  },
  { _id: false }
);

const SmokingCessationSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    duration: { type: Number },
  },
  { _id: false }
);

const MenstruationSchema: Schema<Menstruation> = new Schema(
  {
    type: { type: String, enum: ["Regular", "Irregular", "Menopause"] },
    gravidaNumber: { type: Number },
    abortionNumber: { type: Number },
  },
  { _id: false }
);

const ContraceptionSchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    method: {
      type: String,
      enum: ["IUD", "Implant", "DOC", "Other"],
      required: function (this: { enabled: boolean }) {
        return this.enabled === true;
      },
    },
    other: { type: String },
  },
  { _id: false }
);

const AttachmentSchema: Schema<IAttachment> = new Schema(
  {
    type: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PatientDrugSchema: Schema<IPatientDrug> = new Schema(
  {
    drugId: { type: Schema.Types.ObjectId, ref: "Drug" },
    quantity: { type: Number },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const PatientLabTestResultSchema: Schema<PatientLabTestResult> = new Schema(
  {
    name: { type: String },
    value: { type: Schema.Types.Mixed },
    unit: { type: String },
    refValue: { type: String },
  },
  { _id: false }
);

const PatientLabTestSchema: Schema<IPatientLabTest> = new Schema(
  {
    labtestId: { type: Schema.Types.ObjectId, ref: "LabTest" },
    status: {
      type: String,
      enum: Object.values(PatientLabTestStatus),
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
      default: PatientType.Adult,
      index: true,
    },
    name: { type: String, index: true },
    sex: { type: String, default: "" },
    age: { type: Number, default: 0 },
    houseNumber: { type: String, default: "" },
    mobileNumber: { type: String, default: "", index: true },
    code: { type: String, index: true, unique: true, sparse: true },
    checkupDay: { type: Number, default: 1, min: 1, max: 5 },

    // Adult Specific
    occupation: { type: String, default: "" },
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
    adultAnthropometry: { type: AdultAnthropometrySchema },
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
    fatherOccupation: { type: String, default: "" },
    fatherEducationLevel: { type: String, enum: Object.values(EducationLevel) },
    motherEducationLevel: { type: String, enum: Object.values(EducationLevel) },
    birthTerm: { type: BirthTermSchema },
    consanguinity: { type: String, default: "" },
    NICUAdmission: { type: String, default: "" },
    orderOfBirth: { type: String, default: "" },
    birthMode: { type: BirthModeSchema },
    followUpType: { type: String, enum: ["Pediatric", "Other"] },
    localExamination: { type: LocalExaminationSchema },

    // Child History
    childFamilyHistory: { type: ChildFamilyHistorySchema },
    immunizationHistory: { type: ImmunizationHistorySchema },
    dieteticHistory: { type: DieteticHistorySchema },
    developmentalHistory: { type: DevelopmentalHistorySchema },
    antenatalHistory: { type: AntenatalHistorySchema },
    natalHistory: { type: NatalHistorySchema },
    neonatalHistory: { type: NeonatalHistorySchema },

    // Status Flags
    followUp: { type: Boolean, default: false },
    communityDevelopment: { type: Boolean, default: false },

    // Referral
    referral: { type: ReferralOfConvoyClinicSchema },

    // Embedded Arrays
    complaints: { type: [String], default: [] },
    generalExamination: { type: GeneralExaminationSchema },
    attachments: { type: [AttachmentSchema], default: [] },
    drugs: { type: [PatientDrugSchema], default: [] },
    labTest: { type: [PatientLabTestSchema], default: [] },
  },
  { timestamps: true }
);

// Handle hot reloading
const Patient =
  (models.Patient as Model<IPatient>) ||
  model<IPatient>("Patient", PatientSchema);

export { Patient };
