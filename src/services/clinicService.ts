import PatientDiagnosis from '@/models/main/PatientDiagnosis';
import PatientTreatment from '@/models/main/PatientTreatment';
import { Types } from 'mongoose';

interface CreatePatientRecordsParams {
  patientId: string | Types.ObjectId;
  clinicId: string | Types.ObjectId;
  diagnoses: string[];
  treatments: string[];
}

export const clinicService = {
  async createPatientRecords({ patientId, clinicId, diagnoses, treatments }: CreatePatientRecordsParams) {
    const diagnosisDocs = diagnoses.map(diagnosisName => ({
      patientId,
      clinicId,
      diagnosisName,
    }));

    const treatmentDocs = treatments.map(treatmentName => ({
      patientId,
      clinicId,
      treatmentName,
    }));

    if (diagnosisDocs.length > 0) {
        await PatientDiagnosis.insertMany(diagnosisDocs);
    }

    if (treatmentDocs.length > 0) {
        await PatientTreatment.insertMany(treatmentDocs);
    }
    
    return { success: true };
  },

  async getPatientTreatmentsForClinic(clinicId: string, patientId: string) {
    await PatientTreatment.find({ _id: null }); // Ensure model is initialized
    return await PatientTreatment.find({
      clinicId: new Types.ObjectId(clinicId),
      patientId: new Types.ObjectId(patientId),
    }).lean();
  }
}; 