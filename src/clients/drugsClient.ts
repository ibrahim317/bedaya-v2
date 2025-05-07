
import { DrugData, drugService } from '@/services/drugService';
import { fetchJson } from './base';
import { IDrug } from '@/types/Drug';


export interface FormattedDrug {
    drugId: string;
    name: string;
    Quantity: number;
    strip_count: number;
    sample: boolean;
    ExpiryDate: string;
    dailyConsumption?: number[]; // count of drugs consumed per day
    createdAt?: string;
  }

export const drugsClient = {
    /**
     * Get all drugs
     */
    async getAllDrugs(): Promise<FormattedDrug[]> {
        const response = await fetch('/api/drugs?action=all');
        if (!response.ok) {
            throw new Error('Failed to fetch drugs');
        }
        const drugs: IDrug[] = await response.json();
        return drugs.map(drug => ({
            drugId: drug.drugId.toString(),
            name: drug.name,
            Quantity: drug.Quantity,
            strip_count: drug.Quantity * drug.stripInTHeBox, // calculate the  All strip_count
            sample: drug.sample,
            ExpiryDate: new Date(drug.ExpiryDate).toLocaleDateString(),
            dailyConsumption: drug.DailyConsumption,
            createdAt: drug.createdAt ? new Date(drug.createdAt).toLocaleDateString() : 'N/A'
        }));
    },

     /**
       * Find a drug by Id
       */
      async findById(drugId: string): Promise<IDrug | null> {
        const response = await fetch(`/api/drugs?action=byId${drugId}`);
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
        const response = await fetch(`/api/drugs?action=byName${name}`);
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