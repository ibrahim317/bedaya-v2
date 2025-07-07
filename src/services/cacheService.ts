import { indexedDBService } from './indexedDBService';
import { offlineService } from './offlineService';
import { 
  CachedData, 
  DataSource, 
  STORE_NAMES,
  CacheQuery,
  CacheQueryResult 
} from '@/types/IndexedDB';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  forceRefresh?: boolean;
  source?: DataSource;
}

export interface CacheStats {
  totalItems: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  totalSize: number;
}

export interface CacheResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

class CacheService {
  private defaultTTL = 24 * 60 * 60 * 1000; // 24 hours
  private stats = {
    hits: 0,
    misses: 0
  };

  async initialize(): Promise<void> {
    await indexedDBService.initialize();
    
    // Schedule periodic cleanup
    this.scheduleCleanup();
  }

  // Generic cache operations
  async get<T>(store: string, id: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const cached = await indexedDBService.get<T>(store, id);
      
      if (cached && !options.forceRefresh) {
        this.stats.hits++;
        return cached.data;
      } else {
        this.stats.misses++;
        return null;
      }
    } catch (error) {
      console.error(`Cache get error for ${store}:${id}:`, error);
      this.stats.misses++;
      return null;
    }
  }

  async set<T>(
    store: string, 
    id: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const now = new Date();
      const ttl = options.ttl || this.defaultTTL;
      const expiresAt = new Date(now.getTime() + ttl);

      const cacheData: CachedData<T> = {
        id,
        data,
        timestamp: now,
        expiresAt,
        dirty: false,
        version: 1,
        source: options.source || DataSource.SERVER
      };

      await indexedDBService.put(store, cacheData);
    } catch (error) {
      console.error(`Cache set error for ${store}:${id}:`, error);
      throw error;
    }
  }

  async invalidate(store: string, id?: string): Promise<void> {
    try {
      if (id) {
        await indexedDBService.delete(store, id);
      } else {
        await indexedDBService.clear(store);
      }
    } catch (error) {
      console.error(`Cache invalidate error for ${store}:`, error);
      throw error;
    }
  }

  async query<T>(query: CacheQuery<T>): Promise<CacheResult<T>> {
    try {
      const result = await indexedDBService.query(query);
      
      if (result.items.length > 0) {
        this.stats.hits += result.items.length;
      } else {
        this.stats.misses++;
      }
      
      return {
        items: result.items.map(cached => cached.data),
        total: result.total,
        hasMore: result.hasMore
      };
    } catch (error) {
      console.error(`Cache query error:`, error);
      this.stats.misses++;
      return { items: [], total: 0, hasMore: false };
    }
  }

  // Entity-specific cache methods
  async cachePatients(patients: any[]): Promise<void> {
    for (const patient of patients) {
      await this.set(STORE_NAMES.PATIENTS, patient._id || patient.id, patient);
    }
  }

  async getCachedPatients(options: CacheOptions = {}): Promise<any[]> {
    try {
      const cached = await indexedDBService.getAll(STORE_NAMES.PATIENTS);
      this.stats.hits += cached.length;
      return cached.map(item => item.data);
    } catch (error) {
      console.error('Error getting cached patients:', error);
      this.stats.misses++;
      return [];
    }
  }

  async cachePatient(patient: any): Promise<void> {
    await this.set(STORE_NAMES.PATIENTS, patient._id || patient.id, patient);
  }

  async getCachedPatient(id: string): Promise<any | null> {
    return this.get(STORE_NAMES.PATIENTS, id);
  }

  async cacheDrugs(drugs: any[]): Promise<void> {
    for (const drug of drugs) {
      await this.set(STORE_NAMES.DRUGS, drug._id || drug.id, drug);
    }
  }

  async getCachedDrugs(options: CacheOptions = {}): Promise<any[]> {
    try {
      const cached = await indexedDBService.getAll(STORE_NAMES.DRUGS);
      this.stats.hits += cached.length;
      return cached.map(item => item.data);
    } catch (error) {
      console.error('Error getting cached drugs:', error);
      this.stats.misses++;
      return [];
    }
  }

  async cacheClinics(clinics: any[]): Promise<void> {
    for (const clinic of clinics) {
      await this.set(STORE_NAMES.CLINICS, clinic._id || clinic.id, clinic);
    }
  }

  async getCachedClinics(options: CacheOptions = {}): Promise<any[]> {
    try {
      const cached = await indexedDBService.getAll(STORE_NAMES.CLINICS);
      this.stats.hits += cached.length;
      return cached.map(item => item.data);
    } catch (error) {
      console.error('Error getting cached clinics:', error);
      this.stats.misses++;
      return [];
    }
  }

  // Cache management
  async cleanup(): Promise<void> {
    try {
      await indexedDBService.cleanupExpiredData();
      console.log('Cache cleanup completed');
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }

  private scheduleCleanup(): void {
    // Run cleanup every 2 hours
    setInterval(() => {
      this.cleanup();
    }, 2 * 60 * 60 * 1000);
  }

  async getStats(): Promise<CacheStats> {
    const totalSize = await indexedDBService.getDatabaseSize();
    const totalItems = await this.getTotalItems();
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? this.stats.hits / (this.stats.hits + this.stats.misses) 
      : 0;

    return {
      totalItems,
      cacheHits: this.stats.hits,
      cacheMisses: this.stats.misses,
      hitRate,
      totalSize
    };
  }

  private async getTotalItems(): Promise<number> {
    let total = 0;
    const stores = [STORE_NAMES.PATIENTS, STORE_NAMES.DRUGS, STORE_NAMES.CLINICS];
    
    for (const store of stores) {
      try {
        const items = await indexedDBService.getAll(store);
        total += items.length;
      } catch (error) {
        console.warn(`Failed to count items in store ${store}:`, error);
      }
    }
    
    return total;
  }

  // Smart caching strategies
  async preloadEssentialData(): Promise<void> {
    if (!offlineService.isOnline()) {
      return;
    }

    try {
      // This would typically call the API to preload commonly used data
      console.log('Preloading essential data for offline use...');
      
      // Add specific preloading logic here based on your application needs
      // For example, load recent patients, commonly used drugs, etc.
      
    } catch (error) {
      console.error('Error preloading essential data:', error);
    }
  }

  async warmCache(): Promise<void> {
    // Warm the cache with frequently accessed data
    await this.preloadEssentialData();
  }

  async clearAllCache(): Promise<void> {
    const stores = [STORE_NAMES.PATIENTS, STORE_NAMES.DRUGS, STORE_NAMES.CLINICS];
    
    for (const store of stores) {
      await this.invalidate(store);
    }
    
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  // Mark data as dirty (needs sync)
  async markDirty(store: string, id: string): Promise<void> {
    try {
      const cached = await indexedDBService.get(store, id);
      if (cached) {
        cached.dirty = true;
        cached.version++;
        await indexedDBService.put(store, cached);
      }
    } catch (error) {
      console.error(`Error marking ${store}:${id} as dirty:`, error);
    }
  }

  // Get all dirty (unsynced) data
  async getDirtyData(store: string): Promise<CachedData<any>[]> {
    try {
      const query: CacheQuery = {
        store,
        filter: (item) => item.dirty === true
      };
      
      const result = await indexedDBService.query(query);
      return result.items;
    } catch (error) {
      console.error(`Error getting dirty data from ${store}:`, error);
      return [];
    }
  }
}

// Singleton instance
export const cacheService = new CacheService(); 