import { PatientType } from "@/types/Patient";

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