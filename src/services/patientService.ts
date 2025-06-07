import { Patient } from "@/models/main/Patient";
import { connectDB } from "@/lib/db";
import { IPatient, PatientLabTest, PatientLabTestStatus, PatientLabTestResult } from "@/types/Patient";

function removeEmpty(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeEmpty).filter((v) => v !== undefined && v !== null);
  } else if (obj && typeof obj === "object") {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeEmpty(value);
      if (
        cleanedValue !== undefined &&
        cleanedValue !== null &&
        !(typeof cleanedValue === "object" && Object.keys(cleanedValue).length === 0) &&
        !(typeof cleanedValue === "string" && cleanedValue === "")
      ) {
        cleaned[key] = cleanedValue;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  } else {
    if (obj === "" || obj === undefined || obj === null) return undefined;
    return obj;
  }
}

export const patientService = {
  async createPatient(data: Partial<IPatient>) {
    await connectDB();
    try {
      const cleanedData = removeEmpty(data);
      const patient = new Patient(cleanedData);
      await patient.save();
      return patient.toObject();
    } catch (error: any) {
        console.log("error", error);
      // You can add more domain-specific error handling here
      throw new Error(error.message || "Failed to create patient");
    }
  },
  async getPatientById(id: string) {
    await connectDB();
    const patient = await Patient.findById(id).lean();
    return patient;
  },
  async updatePatientById(id: string, data: Partial<IPatient>) {
    await connectDB();
    const cleanedData = removeEmpty(data);
    const updated = await Patient.findByIdAndUpdate(id, cleanedData, { new: true, lean: true });
    return updated;
  },
  async deletePatientById(id: string) {
    await connectDB();
    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Patient not found");
    }
    return deleted;
  },
};

export const updatePatientLabTest = async (
  patientId: string,
  labTestName: "Urine" | "Blood" | "Stool",
  status: PatientLabTestStatus,
  results?: PatientLabTestResult[]
) => {
  await connectDB();

  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  const labTestIndex = patient.labTest.findIndex(
    (test: PatientLabTest) => test.labTestName === labTestName
  );

  if (labTestIndex > -1) {
    // Update existing lab test
    patient.labTest[labTestIndex].status = status;
    if (results) {
      patient.labTest[labTestIndex].results = results;
    }
  } else {
    // Add new lab test
    patient.labTest.push({
      labTestName,
      status,
      results: results || [],
    });
  }

  await patient.save();
  return patient;
}; 