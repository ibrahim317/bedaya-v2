import { Types } from "mongoose";

export interface IPatientTreatment {
  patientId: Types.ObjectId;
  clinicId: Types.ObjectId;
  treatmentName: string;
}