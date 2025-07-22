import {
  DispensedMedicationData,
  IDispensedMedication,
  IPopulatedDispensedMedication,
} from '@/types/DispensedMedication';
import { fetchJson } from './base';
import { PaginatedDispensedMedications } from '@/services/dispensedMedicationService';

export const dispensedMedicationsClient = {
  async getAll(page: number, limit: number, search: string): Promise<PaginatedDispensedMedications> {
    const response = await fetch(`/api/dispensed-medications/all?page=${page}&limit=${limit}&search=${search}`);
    if (!response.ok) {
        throw new Error('Failed to fetch dispensed medications');
    }
    return response.json();
  },

  async create(data: Omit<DispensedMedicationData, 'patientName'>): Promise<IDispensedMedication> {
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
  async update(id: string, data: Omit<DispensedMedicationData, 'patientName'>): Promise<IDispensedMedication> {
    return await fetchJson<IDispensedMedication>(`/api/dispensed-medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  async getDailyDispensedStats(): Promise<{ date: string; count: number }[]> {
    const response = await fetch('/api/pharmacy/stats/dispensed-per-day');
    if (!response.ok) {
      throw new Error('Failed to fetch daily dispensed stats');
    }
    return response.json();
  }
}; 