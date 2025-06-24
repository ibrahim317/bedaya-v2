import { DrugData } from '@/services/drugService';
import { fetchJson } from './base';
import { IDrugWithId } from '@/types/Drug';

export type FormattedDrug = IDrugWithId;

export const drugsClient = {
    /**
     * Get all drugs
     */
    async getAllDrugs(): Promise<IDrugWithId[]> {
        const response = await fetch('/api/drugs?action=all');
        if (!response.ok) {
            throw new Error('Failed to fetch drugs');
        }
        const drugs: IDrugWithId[] = await response.json();
        return drugs;
    },

     /**
       * Find a drug by Id
       */
      async findById(drugId: string): Promise<IDrugWithId | null> {
        const response = await fetch(`/api/drugs?action=byId&drugId=${drugId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch drug');
        }
        const drug: IDrugWithId = await response.json();
        return drug;
      },

      /**
       * Find a drug by name
       */
      async findByName(name: string): Promise<IDrugWithId | null> {
        const response = await fetch(`/api/drugs?action=byName&name=${name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch drug');
        }
        const drug: IDrugWithId = await response.json();
        return drug;
      },
    
      /**
       * Delete a drug
       */
      async deleteDrug(drugId: string): Promise<void> {
        await fetchJson(`/api/drugs/${drugId}`, {
          method: 'DELETE',
        });
      },

      /**
         *Add a new drug to the database
         */
        async AddDrug(data: DrugData ): Promise<IDrugWithId> {
          return await fetchJson<IDrugWithId>('/api/drugs', {
            method: 'POST',
            body: JSON.stringify(data),
          });
        },
      
      /**
       * Update a drug
       */
      async updateDrug(drugId: string, data: Partial<DrugData>): Promise<IDrugWithId> {
        return await fetchJson<IDrugWithId>(`/api/drugs/${drugId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
      }
}