import {
  IPatient,
  PatientType,
  PatientLabTestStatus,
  PatientLabTestResult,
} from "@/types/Patient";

interface FetchPatientsParams {
  type: PatientType;
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function fetchPatients({
  type,
  search = "",
  sortField = "createdAt",
  sortOrder = "desc",
  page = 1,
  pageSize = 10,
}: FetchPatientsParams) {
  const params = new URLSearchParams({
    type,
    search,
    sortField,
    sortOrder,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await fetch(`/api/patients?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return response.json();
}

export async function createPatient(data: any) {
  const response = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create patient");
  }
  return response.json();
}

export async function fetchPatientById(id: string): Promise<IPatient> {
  const response = await fetch(`/api/patients/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch patient");
  }
  return response.json();
}

export async function updatePatient(id: string, data: any) {
  const response = await fetch(`/api/patients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update patient");
  }
  return response.json();
}

export async function deletePatient(id: string) {
  const response = await fetch(`/api/patients/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete patient");
  }
  return response.json();
}

export async function searchPatients(search: string) {
  const params = new URLSearchParams({
    search,
    pageSize: "20",
  });
  const response = await fetch(`/api/patients?${params}`);
  if (!response.ok) {
    throw new Error("Failed to search patients");
  }

  return response.json();
}

export const updateLabTest = async (
  patientId: string,
  data: {
    labTestName: "Urine" | "Blood" | "Stool";
    status: PatientLabTestStatus;
    results?: PatientLabTestResult[];
  }
) => {
  try {
    const response = await fetch(`/api/patients/${patientId}/lab-tests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update lab test");
    }
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to update lab test");
  }
}; 