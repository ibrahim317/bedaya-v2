import { IPatient, PatientType, PatientLabTestStatus, PatientLabTestResult } from "@/types/Patient";
import { offlineClient } from './offlineClient';
import { STORE_NAMES } from '@/types/IndexedDB';
import { fetchJson } from './base';
import { cacheService } from '@/services/cacheService';

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
  
  const url = `/api/patients?${params}`;
  
  // Make direct API call to ensure proper filtering by type
  try {
    const response = await fetchJson<any>(url, { method: 'GET' });
    
    let items: IPatient[];
    
    if (Array.isArray(response)) {
      items = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      items = response.data;
    } else {
      console.warn(`Unexpected response format from ${url}. Returning empty array.`);
      return [];
    }
    
    // Cache the filtered results
    for (const item of items) {
      const id = item._id || (item as any).id;
      if (id) {
        await cacheService.set(STORE_NAMES.PATIENTS, id, item);
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Failed to fetch patients from ${url}:`, error);
    throw error;
  }
}

export async function createPatient(data: any): Promise<IPatient> {
  const url = "/api/patients";
  // Using post, which handles offline queueing.
  return offlineClient.post(STORE_NAMES.PATIENTS, url, data);
}

export async function fetchPatientById(id: string): Promise<IPatient | null> {
  const url = `/api/patients/${id}`;
  // Using get for single items, which handles caching.
  return offlineClient.get<IPatient>(STORE_NAMES.PATIENTS, id, url);
}

export async function updatePatient(id: string, data: any): Promise<IPatient> {
  const url = `/api/patients/${id}`;
  // Using put, which handles optimistic updates and offline queueing.
  return offlineClient.put(STORE_NAMES.PATIENTS, id, url, data);
}

export async function deletePatient(id: string) {
  const url = `/api/patients/${id}`;
  // Using delete, which handles optimistic deletion and offline queueing.
  return offlineClient.delete(STORE_NAMES.PATIENTS, id, url);
}

export async function searchPatients(search: string) {
  const params = new URLSearchParams({
    search,
    pageSize: "20",
  });
  const url = `/api/patients?${params}`;
  // Using getAll for search results as well.
  return offlineClient.getAll<IPatient>(STORE_NAMES.PATIENTS, url, { forceRefresh: true }); // Force refresh for search
}

export const updateLabTest = async (
  patientId: string,
  data: {
    labTestName: "Urine" | "Blood" | "Stool" | "Albumin-Creat";
    status?: PatientLabTestStatus;
    results?: PatientLabTestResult[];
  }
): Promise<IPatient> => {
  const url = `/api/patients/${patientId}/lab-tests`;
  // Lab tests are complex; for now, we'll treat them as a 'post' operation
  // on the patient store, which isn't ideal but works for queueing.
  // A better solution would be a separate 'lab_tests' store.
  return offlineClient.post(STORE_NAMES.PATIENTS, url, data, {
    // This isn't a standard patient creation, so don't optimistically add to cache
  });
}; 