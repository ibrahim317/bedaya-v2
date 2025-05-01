import { Document, Types } from "mongoose";

export enum PatientType {
  Adult = "adult",
  Child = "child",
}

export type FamilyHistory = {
  similarCondition: boolean;
  HTN: boolean;
  DM: boolean;
  other?: string;
};
export type Screening = {
  nephropathy?: boolean;
  UTI?: boolean;
  OGTT?: boolean;
  rickets?: boolean;
  anemia?: boolean;
  parasites?: boolean;
  DM?: boolean;
};

export type MedicalHistory = {
  enabled: boolean;
  DM: boolean;
  HTN: boolean;
  HCV: boolean;
  RHD: boolean;
  other?: string;
};

export type AllergyHistory =
  | { enabled: true; type: string }
  | { enabled: false };

export interface IAttachment {
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface IPatientDrug {
  drugId: Types.ObjectId;
  quantity?: number;
  checked?: boolean;
}
export enum PatientLabTestStatus {
  CheckedIn = "Checked In",
  CheckedOut = "Checked Out",
}

export type PatientLabTestResult = {
  name: string;
  value: string | number | boolean;
  unit: string;
  refValue: string;
};

export interface IPatientLabTest {
  labtestId: Types.ObjectId;
  status: PatientLabTestStatus;
  results: [PatientLabTestResult];
}

export enum MaritalStatus {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  Widowed = "Widowed",
}

export enum EducationLevel {
  Illiterate = "Illiterate",
  ReadAndWrite = "Read and Write",
  Primary = "Primary",
  Preparatory = "Preparatory",
  Secondary = "Secondary",
  University = "University",
  PostGraduate = "Post Graduate",
}

export type SmokingStatus =
  | { enabled: true; type?: string; other?: string; smokingPerDay?: number }
  | { enabled: false };

export type SmokingCessation =
  | { enabled: true; duration?: number }
  | { enabled: false };

export type Menstruation = {
  type: "Regular" | "Irregular" | "Menopause";
  gravidaNumber?: number;
  abortionNumber?: number;
};

export type Contraception =
  | {
      enabled: true;
      method: "IUD" | "Implant" | "DOC" | "Other";
      other?: string;
    }
  | { enabled: false };

export type BloodTransfusion =
  | {
      enabled: true;
      occasional: boolean;
      regualr: boolean;
      other?: string;
    }
  | { enabled: false };
export type ICUHistory =
  | {
      enabled: true;
      other?: string;
    }
  | { enabled: false };
export type SurgicalHistory =
  | {
      enabled: true;
      ICU: boolean;
      other?: string;
      operation:
        | {
            enabled: true;
            type: string;
          }
        | { enabled: false };
    }
  | { enabled: false };

export type DrugForChronicDisease = {
  antiHTN: boolean;
  oralHypoglycemic: boolean;
  antiepileptic: boolean;
  antidiabetic: boolean;
  other?: string;
};

export type VitalData = {
  BP: string;
  PR: string;
  RR: string;
  CRT?: string; // for child
  RBS?: string; // for child
  Spo2?: string; // for child
  temperature: string;
};

export enum Cyanosis {
  Central = "Central",
  Peripheral = "Peripheral",
  None = "None",
}

export type Complexions = {
  cyanosis: Cyanosis;
  jaundice: boolean;
  pallor: boolean;
};

export type Anthropometry = {
  weight: number;
  height: number;
  OFC: number;
  weightForAge: number;
  heightForAge: number;
  deformity: boolean;
};

export type GeneralExamination = {
  vitalData: VitalData;
  complexions: Complexions;
  anthropometry?: Anthropometry;
};

export type ReferralOfConvoyClinic = {
  IM: boolean;
  cardio: boolean;
  surgery: boolean;
  ophth: boolean;
  obsAndGyn: boolean;
  ENT: boolean;
  derma: boolean;
  ortho: boolean;
  dental: boolean;
  goHome: boolean;
  isOther: boolean;
  other?: string;
};
// ------------- Child Specific Info -------------

export type BirthMode = {
  VD: boolean;
  CS: boolean;
  CS_reason?: string;
};

export type BirthTerm = {
  fullTerm: boolean;
  preterm: boolean;
  weeks?: number;
};

export type LocalExamination = {
  main?: string;
  cardiac?: string;
  chest?: string;
  abdominal?: string;
};

export type ImmunizationHistory = {
  upToDate: boolean;
  delayed: boolean;
  noVaccinations: boolean;
};

export type DieteticHistory = {
  breastFeeding: boolean;
  artificialFeeding: boolean;
  combined: boolean;
  weaning: boolean;
};

export type DevelopmentalHistory = {
  grossMotor?: string;
  fineMotor?: string;
  language?: string;
  social?: string;
  sphincter?: string;
};

export type AntenatalHistory = {
  storch?: string;
  disease?: string;
  irradiation?: string;
  teratogenicdrugs?: string;
  hospitalization?: string;
};

export type NatalHistory = {
  prematureRupture: boolean;
  prolongedDelivery: boolean;
  place: {
    hospital: boolean;
    home: boolean;
  };
};

export type NeonatalHistory = {
  NICU?: string;
  Cyanosis?: string;
  Jaundice?: string;
  Pallor?: string;
  Convulsions?: string;
};


export interface IPatient extends Document {
  // Core Patient Info
  type: PatientType;
  name: string;
  sex: string;
  houseNumber?: string;
  mobileNumber?: string;
  code?: string;
  age?: number;
  checkupDay?: number;
  // Adult Specific Info
  occupation?: string;
  maritalStatus?: MaritalStatus;
  educationLevel?: EducationLevel;
  smokingStatus?: SmokingStatus;
  smokingCessation?: SmokingCessation;
  menstruation?: Menstruation;
  contraceptionMethod?: Contraception;
  medicalHistory?: MedicalHistory;
  allergyHistory?: AllergyHistory;
  bloodTransfusion?: BloodTransfusion;
  surgicalHistory?: SurgicalHistory;
  drugsForChronicDisease?: DrugForChronicDisease;
  familyHistory?: FamilyHistory;
  screening?: Screening;
  referralOfConvoyClinic?: ReferralOfConvoyClinic;
  followUp: boolean;
  communityDevelopment: boolean;

  // Child Specific Info
  fatherOccupation?: string;
  fatherEducationLevel?: EducationLevel;
  motherEducationLevel?: EducationLevel;
  birthTerm?: BirthTerm;
  consanguinity?: boolean;
  NICUAdmission?: string;
  orderOfBirth?: string;

  immunizationHistory?: ImmunizationHistory;
  dieteticHistory?: DieteticHistory;
  developmentalHistory?: DevelopmentalHistory;
  antenatalHistory?: AntenatalHistory;
  natalHistory?: NatalHistory;
  neonatalHistory?: NeonatalHistory;



  birthMode?: BirthMode;
  icuHistory?: ICUHistory;
  followUpType?: "Pediatric" | "Other";
  localExamination?: LocalExamination;

  // Embedded Arrays
  complaints: string[];
  generalExamination: GeneralExamination;
  attachments: IAttachment[];
  drugs: IPatientDrug[];
  labTest: IPatientLabTest[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
