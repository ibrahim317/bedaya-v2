import ClinicVisit from '@/models/main/ClinicVisit';
import { Types } from 'mongoose';

interface CreateClinicVisitParams {
  patientId: string | Types.ObjectId;
  clinicId: string | Types.ObjectId;
  diagnoses: string[];
  treatments: string[];
  images?: string[];
}

export const clinicService = {
  async createClinicVisit({ patientId, clinicId, diagnoses, treatments, images }: CreateClinicVisitParams) {
    await ClinicVisit.create({
      patientId,
      clinicId,
      diagnoses,
      treatments,
      images: images || [],
    });

    return { success: true };
  },

  async getPatientTreatmentsForClinic(clinicId: string, patientId: string) {
    const visits = await ClinicVisit.find({
      clinicId: new Types.ObjectId(clinicId),
      patientId: new Types.ObjectId(patientId),
    }).sort({ createdAt: -1 }).lean();

    const treatments = visits.flatMap(visit =>
      (visit.treatments || []).map(treatmentName => ({
        _id: `${visit._id}-${treatmentName}`, // Create a unique key
        treatmentName,
        createdAt: visit.createdAt,
      }))
    );
    return treatments;
  },

  async getPatientVisitHistory(clinicId: string, patientId: string) {
    const visits = await ClinicVisit.find({
      clinicId: new Types.ObjectId(clinicId),
      patientId: new Types.ObjectId(patientId),
    }).sort({ createdAt: -1 }).lean();
    return visits;
  }
}; 