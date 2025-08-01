import {Patient} from "@/models/main/Patient";
import User from "@/models/main/User";
import Clinic from "@/models/main/Clinic";
import Drug from "@/models/main/Drug";
import DispensedMedication from "@/models/main/DispensedMedication";
import { connectDB } from "@/lib/db";
import { startOfDay, subDays } from "date-fns";
import { PatientType, PatientLabTestStatus } from "@/types/Patient";
import ClinicVisit from "@/models/main/ClinicVisit";

export async function getDashboardStats() {
  await connectDB();

  const patientCount = await Patient.countDocuments();
  const userCount = await User.countDocuments();
  const clinicCount = await Clinic.countDocuments();
  const drugCount = await Drug.countDocuments();
  const dispensedMedicationCount = await DispensedMedication.countDocuments();

  const patientsPerClinic = await ClinicVisit.aggregate([
    {
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: '_id',
        as: 'patient',
      },
    },
    {
      $unwind: '$patient',
    },
    {
      $group: {
        _id: {
          clinicId: '$clinicId',
          patientId: '$patientId',
          type: '$patient.type',
        },
      },
    },
    {
      $group: {
        _id: {
          clinicId: '$_id.clinicId',
          type: '$_id.type',
        },
        patientCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'clinics',
        localField: '_id.clinicId',
        foreignField: '_id',
        as: 'clinicInfo',
      },
    },
    {
      $unwind: '$clinicInfo',
    },
    {
      $project: {
        _id: 0,
        clinicName: '$clinicInfo.name',
        patientCount: 1,
        type: '$_id.type',
      },
    },
  ]);

  // Calculate daily stats for the last 7 days
  const today = startOfDay(new Date());
  const dailyPatientCounts = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const nextDate = subDays(today, i - 1);
    const count = await Patient.countDocuments({
      createdAt: {
        $gte: date,
        $lt: nextDate,
      },
    });
    dailyPatientCounts.push({
      date: date.toISOString().split("T")[0],
      count,
    });
  }

  const adultPatientCount = await Patient.countDocuments({ type: PatientType.Adult });
  const childPatientCount = await Patient.countDocuments({ type: PatientType.Child });
  
  const labTestStatsResult = await Patient.aggregate([
    { $unwind: "$labTest" },
    {
      $group: {
        _id: {
          type: "$type",
          labTestName: "$labTest.labTestName",
          status: "$labTest.status",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          type: "$_id.type",
          labTestName: "$_id.labTestName",
        },
        statuses: {
          $push: {
            status: "$_id.status",
            count: "$count",
          },
        },
        total: { $sum: "$count" },
      },
    },
    {
      $group: {
        _id: "$_id.type",
        labTests: {
          $push: {
            labTestName: "$_id.labTestName",
            total: "$total",
            statuses: "$statuses",
          },
        },
      },
    },
  ]);

  const labTestStats = labTestStatsResult.reduce((acc, item) => {
    const patientType = item._id;
    acc[patientType] = item.labTests.reduce((labAcc: any, lab: any) => {
      labAcc[lab.labTestName] = {
        total: lab.total,
        statuses: lab.statuses.reduce((statusAcc: any, s: any) => {
          statusAcc[s.status] = s.count;
          return statusAcc;
        }, {}),
      };
      return labAcc;
    }, {});
    return acc;
  }, {});

  const labTotalsResult = await Patient.aggregate([
    {
      $addFields: {
        overAllLabsStatus: {
          $ifNull: ["$overAllLabsStatus", "Not Requested"]
        }
      }
    },
    {
      $group: {
        _id: {
          type: "$type",
          status: "$overAllLabsStatus",
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.type",
        statuses: {
          $push: {
            status: "$_id.status",
            count: "$count",
          },
        },
      },
    },
  ]);

  const labTotals = {
    [PatientType.Adult]: { labTotalIn: 0, labTotalOut: 0, labTotalNotRequested: 0 },
    [PatientType.Child]: { labTotalIn: 0, labTotalOut: 0, labTotalNotRequested: 0 },
  };

  labTotalsResult.forEach(item => {
    const patientType = item._id;
    const target = labTotals[patientType as PatientType];
    if (target) {
      item.statuses.forEach((s: { status: PatientLabTestStatus; count: number }) => {
        if (s.status === PatientLabTestStatus.CheckedIn) {
          target.labTotalIn = s.count;
        } else if (s.status === PatientLabTestStatus.CheckedOut) {
          target.labTotalOut = s.count;
        } else {
          target.labTotalNotRequested = s.count;
        }
      });
    }
  });


  return {
    patientCount,
    userCount,
    clinicCount,
    drugCount,
    dispensedMedicationCount,
    patientsPerClinic,
    dailyPatientCounts,
    adultPatientCount,
    childPatientCount,
    labTestStats,
    labTotals,
  };
} 