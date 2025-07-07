import { DrugData } from '@/services/drugService';
import { fetchJson } from './base';
import { IDrugWithId } from '@/types/Drug';
import { offlineClient } from './offlineClient';
import { STORE_NAMES } from '@/types/IndexedDB';

export type PaginatedDrugs = {
    drugs: IDrugWithId[];
    total: number;
    page: number;
    limit: number;
};

export type FormattedDrug = IDrugWithId;

export const drugsClient = {
    /**
     * Get all drugs
     */
    async getDrugs(page: number, limit: number, search: string): Promise<PaginatedDrugs> {
        const url = `/api/drugs?action=all&page=${page}&limit=${limit}&search=${search}`;
        // Using getAll, but the response is paginated, so we can't just rely on the simple getAll.
        // For now, we fetch online, but a more advanced implementation would cache pages.
        const data = await offlineClient.getAll<IDrugWithId>(STORE_NAMES.DRUGS, url);
        return {
            drugs: data,
            total: data.length, // This is incorrect for pagination, but a limitation for now.
            page,
            limit
        };
    },

     /**
       * Find a drug by Id
       */
      async findById(drugId: string): Promise<IDrugWithId | null> {
        const url = `/api/drugs?action=byId&drugId=${drugId}`;
        return offlineClient.get<IDrugWithId>(STORE_NAMES.DRUGS, drugId, url);
      },

      /**
       * Find a drug by name
       */
      async findByName(name: string): Promise<IDrugWithId | null> {
        const url = `/api/drugs?action=byName&name=${name}`;
        // Name is not the ID, so caching by name is tricky. We'll fetch directly.
        // A better cache would index by name.
        const results = await offlineClient.getAll<IDrugWithId>(STORE_NAMES.DRUGS, url, { forceRefresh: true });
        return results.length > 0 ? results[0] : null;
      },
    
      /**
       * Delete a drug
       */
      async deleteDrug(drugId: string): Promise<void> {
        const url = `/api/drugs/${drugId}`;
        return offlineClient.delete(STORE_NAMES.DRUGS, drugId, url);
      },

      /**
         *Add a new drug to the database
         */
        async AddDrug(data: DrugData ): Promise<IDrugWithId> {
          const url = '/api/drugs';
          return offlineClient.post<IDrugWithId>(STORE_NAMES.DRUGS, url, data);
        },
      
      /**
       * Update a drug
       */
      async updateDrug(drugId: string, data: Partial<DrugData>): Promise<IDrugWithId> {
        const url = `/api/drugs/${drugId}`;
        return offlineClient.put<IDrugWithId>(STORE_NAMES.DRUGS, drugId, url, data);
      }
}