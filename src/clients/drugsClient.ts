import { DrugData, drugService } from '@/services/drugService';
import { Document } from 'mongoose';
import { fetchJson } from './base';
import { IDrug } from '@/types/Drug';


export type FormattedDrug = Omit<IDrug, keyof Document>;

export const drugsClient = {
    /**
     * Get all drugs
     */
    async getAllDrugs(): Promise<IDrug[]> {
        const response = await fetch('/api/drugs?action=all');
        if (!response.ok) {
            throw new Error('Failed to fetch drugs');
        }
        const drugs: IDrug[] = await response.json();
        return drugs;
    },

     /**
       * Find a drug by Id
       */
      async findById(drugId: string): Promise<IDrug | null> {
        const response = await fetch(`/api/drugs?action=byId&drugId=${drugId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch drug');
        }
        const drug: IDrug = await response.json();
        return drug;
      },

      /**
       * Find a drug by name
       */
      async findByName(name: string): Promise<IDrug | null> {
        const response = await fetch(`/api/drugs?action=byName&name=${name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch drug');
        }
        const drug: IDrug = await response.json();
        return drug;
      },
    
      /**
       * Delete a drug
       */
      async deleteDrug(drugId: string): Promise<void> {
        await fetchJson('/api/drugs', {
          method: 'DELETE',
          body: JSON.stringify({ drugId }),
        });
      },

      /**
         *Add a new drug to the database
         */
        async AddDrug(data:any ): Promise<IDrug> {
          console.log('AddDrug data:', data);
          return await fetchJson<IDrug>('/api/drugs', {
            method: 'POST',
            body: JSON.stringify(data),
          });
        },
      
}