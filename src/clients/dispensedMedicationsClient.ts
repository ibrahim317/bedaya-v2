import {
  DispensedMedicationData,
  IDispensedMedication,
  IPopulatedDispensedMedication,
} from '@/types/DispensedMedication';
import { fetchJson } from './base';

export const dispensedMedicationsClient = {
  async create(data: DispensedMedicationData): Promise<IDispensedMedication> {
    return await fetchJson<IDispensedMedication>('/api/dispensed-medications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async getByPatientId(patientId: string): Promise<IPopulatedDispensedMedication[]> {
    return await fetchJson<IPopulatedDispensedMedication[]>(
      `/api/dispensed-medications/patient/${patientId}`
    );
  },
  async delete(id: string): Promise<void> {
    return await fetchJson<void>(`/api/dispensed-medications/${id}`, {
      method: 'DELETE',
    });
  },
  async update(id: string, data: DispensedMedicationData): Promise<IDispensedMedication> {
    return await fetchJson<IDispensedMedication>(`/api/dispensed-medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
}; 