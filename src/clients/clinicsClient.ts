import { fetchJson } from './base';

export interface IClinic {
  _id: string;
  name: string;
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
    return await fetchJson<IClinicSummary[]>('/api/clinics');
  },

  /**
   * Get a single clinic by ID with full details
   */
  async getClinicById(id: string): Promise<IClinic> {
    return await fetchJson<IClinic>(`/api/clinics/${id}`);
  },

  /**
   * Create a new clinic
   */
  async createClinic(name: string): Promise<IClinic> {
    return await fetchJson<IClinic>('/api/clinics', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Update a clinic
   */
  async updateClinic(id: string, name: string): Promise<IClinic> {
    return await fetchJson<IClinic>(`/api/clinics/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Add a single diagnosis to a clinic
   */
  async addDiagnosis(clinicId: string, name: string) {
    return await fetchJson(`/api/clinics/${clinicId}/common-diagnoses`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Add multiple diagnoses to a clinic
   */
  async addBulkDiagnoses(clinicId: string, names: string[]) {
    return await fetchJson(`/api/clinics/${clinicId}/common-diagnoses/bulk`, {
      method: 'POST',
      body: JSON.stringify({ names }),
    });
  },

  /**
   * Delete a diagnosis from a clinic
   */
  async deleteDiagnosis(clinicId: string, diagnosisId: string) {
    return await fetchJson(`/api/clinics/${clinicId}/common-diagnoses/${diagnosisId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Add a single treatment to a clinic
   */
  async addTreatment(clinicId: string, name: string) {
    return await fetchJson(`/api/clinics/${clinicId}/common-treatments`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Add multiple treatments to a clinic
   */
  async addBulkTreatments(clinicId: string, names: string[]) {
    return await fetchJson(`/api/clinics/${clinicId}/common-treatments/bulk`, {
      method: 'POST',
      body: JSON.stringify({ names }),
    });
  },

  /**
   * Delete a treatment from a clinic
   */
  async deleteTreatment(clinicId: string, treatmentId: string) {
    return await fetchJson(`/api/clinics/${clinicId}/common-treatments/${treatmentId}`, {
      method: 'DELETE',
    });
  },

  async createPatientRecords(clinicId: string, payload: { patientId: string; diagnoses: string[]; treatments: string[] }) {
    const response = await fetch(`/api/clinics/${clinicId}/records`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create patient records');
    }

    return response.json();
  },

  async getPatientTreatments(clinicId: string, patientId: string) {
    return await fetchJson(`/api/clinics/${clinicId}/patients/${patientId}/treatments`);
  }
}; 