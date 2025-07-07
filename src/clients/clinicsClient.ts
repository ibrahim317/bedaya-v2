import { fetchJson } from './base';
import { IClinicVisit } from '@/types/ClinicVisit';
import { offlineClient } from './offlineClient';
import { STORE_NAMES } from '@/types/IndexedDB';

export interface IClinic {
  _id: string;
  name: string;
  enableImages?: boolean;
  commonDiagnoses: Array<{
    _id: string;
    name: string;
  }>;
  commonTreatments: Array<{
    _id: string;
    name: string;
  }>;
}

export interface IClinicSummary {
  _id: string;
  name: string;
  commonDiagnoses: number;
  commonTreatments: number;
}

export const clinicsClient = {
  /**
   * Get all clinics with counts
   */
  async getAllClinics(): Promise<IClinicSummary[]> {
    const url = '/api/clinics';
    return await offlineClient.getAll<IClinicSummary>(STORE_NAMES.CLINICS_SUMMARY, url);
  },

  /**
   * Get a single clinic by ID with full details
   */
  async getClinicById(id: string, options?: { forceRefresh: boolean }): Promise<IClinic | null> {
    const url = `/api/clinics/${id}`;
    return await offlineClient.get<IClinic>(STORE_NAMES.CLINICS, id, url, options);
  },

  /**
   * Create a new clinic
   */
  async createClinic(name: string): Promise<IClinic> {
    const url = '/api/clinics';
    return await offlineClient.post<IClinic>(STORE_NAMES.CLINICS, url, { name });
  },

  /**
   * Update a clinic
   */
  async updateClinic(
    id: string,
    data: Partial<Omit<IClinic, '_id'>>
  ): Promise<IClinic> {
    const url = `/api/clinics/${id}`;
    return await offlineClient.put<IClinic>(STORE_NAMES.CLINICS, id, url, data);
  },

  /**
   * Add a single diagnosis to a clinic
   */
  async addDiagnosis(clinicId: string, name: string) {
    const url = `/api/clinics/${clinicId}/common-diagnoses`;
    // This is a sub-resource. Queueing this requires more complex logic to
    // ensure the clinic itself is updated. For now, we queue it as a POST.
    return await offlineClient.post(STORE_NAMES.CLINICS, url, { name });
  },

  /**
   * Add multiple diagnoses to a clinic
   */
  async addBulkDiagnoses(clinicId: string, names: string[]) {
    const url = `/api/clinics/${clinicId}/common-diagnoses/bulk`;
    return await offlineClient.post(STORE_NAMES.CLINICS, url, { names });
  },

  /**
   * Delete a diagnosis from a clinic
   */
  async deleteDiagnosis(clinicId: string, diagnosisId: string) {
    const url = `/api/clinics/${clinicId}/common-diagnoses/${diagnosisId}`;
    // Deleting a sub-resource. Queueing this is complex.
    return await offlineClient.delete(STORE_NAMES.CLINICS, `${clinicId}-${diagnosisId}`, url);
  },

  /**
   * Add a single treatment to a clinic
   */
  async addTreatment(clinicId: string, name: string) {
    const url = `/api/clinics/${clinicId}/common-treatments`;
    return await offlineClient.post(STORE_NAMES.CLINICS, url, { name });
  },

  /**
   * Add multiple treatments to a clinic
   */
  async addBulkTreatments(clinicId: string, names: string[]) {
    const url = `/api/clinics/${clinicId}/common-treatments/bulk`;
    return await offlineClient.post(STORE_NAMES.CLINICS, url, { names });
  },

  /**
   * Delete a treatment from a clinic
   */
  async deleteTreatment(clinicId: string, treatmentId: string) {
    const url = `/api/clinics/${clinicId}/common-treatments/${treatmentId}`;
    return await offlineClient.delete(STORE_NAMES.CLINICS, `${clinicId}-${treatmentId}`, url);
  },

  async createClinicVisit(clinicId: string, payload: { patientId: string; diagnoses: string[]; treatments: string[]; followUpImages?: string[], radiologyImages?: string[] }) {
    const url = `/api/clinics/${clinicId}/records`;
    // Clinic visits could be their own store. For now, we queue against the clinic.
    return await offlineClient.post('clinic_visits', url, payload);
  },

  async getPatientTreatments(clinicId: string, patientId: string) {
    const url = `/api/clinics/${clinicId}/patients/${patientId}/treatments`;
    // This is read-only and specific, so direct fetch is acceptable. Caching could be added.
    return await fetchJson(url);
  },

  async getPatientVisitHistory(clinicId: string, patientId: string): Promise<IClinicVisit[]> {
    const url = `/api/clinics/${clinicId}/patients/${patientId}/visits`;
    // Use direct fetch for visit history as this should always be fresh data
    // Caching was causing stale data issues
    return await fetchJson(url);
  },

  async getClinicStats(clinicId: string): Promise<{ totalVisits: number; referredVisits: number }> {
    const url = `/api/clinics/${clinicId}/stats`;
    // Stats are volatile, so fetching directly is best.
    return await fetchJson(url);
  }
}; 