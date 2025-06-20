import {Patient} from "@/models/main/Patient";
import User from "@/models/main/User";
import Clinic from "@/models/main/Clinic";
import Drug from "@/models/main/Drug";
import DispensedMedication from "@/models/main/DispensedMedication";
import { connectDB } from "@/lib/db";
import { startOfDay, subDays } from "date-fns";

export async function getDashboardStats() {
  await connectDB();

  const patientCount = await Patient.countDocuments();
  const userCount = await User.countDocuments();
  const clinicCount = await Clinic.countDocuments();
  const drugCount = await Drug.countDocuments();
  const dispensedMedicationCount = await DispensedMedication.countDocuments();

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

  return {
    patientCount,
    userCount,
    clinicCount,
    drugCount,
    dispensedMedicationCount,
    dailyPatientCounts,
  };
} 