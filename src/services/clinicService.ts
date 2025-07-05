import Clinic from '@/models/main/Clinic';
import ClinicVisit from '@/models/main/ClinicVisit';
import { Referral } from '@/models/main/Referral';
import { Types } from 'mongoose';

interface CreateClinicVisitParams {
  patientId: string | Types.ObjectId;
  clinicId: string | Types.ObjectId;
  diagnoses: string[];
  treatments: string[];
  followUpImages?: string[];
  radiologyImages?: string[];
}

export const clinicService = {
  async createClinicVisit({ patientId, clinicId, diagnoses, treatments, followUpImages, radiologyImages }: CreateClinicVisitParams) {
    await ClinicVisit.create({
      patientId,
      clinicId,
      diagnoses,
      treatments,
      followUpImages: followUpImages || [],
      radiologyImages: radiologyImages || [],
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
  },

  async getClinicStats(clinicId: string) {
    const checkupClinic = await Clinic.findOne({ name: 'Check-up' }).lean();
    if (!checkupClinic) {
      // Handle case where Check-up clinic is not found
      // For now, let's assume it always exists.
      // Or we can throw an error.
      console.warn("Check-up clinic not found. Referred patient stats will be inaccurate.");
    }
    
    const totalVisits = await ClinicVisit.countDocuments({
      clinicId: new Types.ObjectId(clinicId),
    });

    const referredVisits = checkupClinic ? await Referral.countDocuments({
      fromClinicId: checkupClinic._id,
      toClinicId: new Types.ObjectId(clinicId),
    }) : 0;

    return {
      totalVisits,
      referredVisits,
    };
  }
}; 