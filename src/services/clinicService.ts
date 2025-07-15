import Clinic from "@/models/main/Clinic";
import ClinicVisit from "@/models/main/ClinicVisit";
import { Patient } from "@/models/main/Patient";
import { Types } from "mongoose";

interface CreateClinicVisitParams {
  patientId: string | Types.ObjectId;
  clinicId: string | Types.ObjectId;
  patientName: string;
  clinicName: string;
  diagnoses: string[];
  treatments: string[];
  followUpImages?: string[];
  radiologyImages?: string[];
}

export const clinicService = {
  async createClinicVisit({
    patientId,
    clinicId,
    patientName,
    clinicName,
    diagnoses,
    treatments,
    followUpImages,
    radiologyImages,
  }: CreateClinicVisitParams) {
    await ClinicVisit.create({
      patientId,
      clinicId,
      patientName,
      clinicName,
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
    })
      .sort({ createdAt: -1 })
      .lean();

    const treatments = visits.flatMap((visit) =>
      (visit.treatments || []).map((treatmentName) => ({
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
    })
      .sort({ createdAt: -1 })
      .lean();
    return visits;
  },

  async getClinicStats(clinicId: string) {
    const clinic = await Clinic.findById(clinicId).lean();
    if (!clinic) {
      throw new Error("Clinic not found");
    }

    const totalVisits = await ClinicVisit.countDocuments({
      clinicId: new Types.ObjectId(clinicId),
    });

    const referralFieldMap: { [key: string]: string } = {
      IM: "IM",
      Cardio: "cardio",
      Surgery: "surgery",
      Ophthalmology: "ophth",
      "Obs & Gyn": "obsAndGyn",
      Gynecology: "gyn",
      ENT: "ENT",
      Derma: "derma",
      Ortho: "ortho",
      Pharmacy: "pharmacy",
      Dental: "dental",
      Pediatrics: "pediatric",
      Radiology: "radiology",
    };

    const referralField = referralFieldMap[clinic.name];

    let referredVisits = 0;
    if (referralField) {
      referredVisits = await Patient.countDocuments({
        [`referral.${referralField}`]: true,
      });
    }

    return {
      totalVisits,
      referredVisits,
    };
  },
};
