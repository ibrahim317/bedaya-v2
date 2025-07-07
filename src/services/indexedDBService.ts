import { 
  DatabaseSchema, 
  StoreDefinition, 
  CachedData, 
  CachedForm,
  STORE_NAMES,
  DataSource,
  CacheQuery,
  CacheQueryResult,
  DatabaseMetadata,
  TransactionMode
} from '@/types/IndexedDB';

class IndexedDBService {
  private db: IDBDatabase | null = null;
  private dbName = 'BedayaOfflineDB';
  private dbVersion = 3;
  private isInitialized = false;

  private schema: DatabaseSchema = {
    name: this.dbName,
    version: this.dbVersion,
    stores: [
      {
        name: STORE_NAMES.PATIENTS,
        keyPath: 'id',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' },
          { name: 'dirty', keyPath: 'dirty' },
          { name: 'expiresAt', keyPath: 'expiresAt' }
        ]
      },
      {
        name: STORE_NAMES.DRUGS,
        keyPath: 'id',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' },
          { name: 'dirty', keyPath: 'dirty' }
        ]
      },
      {
        name: STORE_NAMES.CLINICS,
        keyPath: 'id',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' },
          { name: 'dirty', keyPath: 'dirty' }
        ]
      },
      {
        name: STORE_NAMES.CLINICS_SUMMARY,
        keyPath: 'id',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' }
        ]
      },
      {
        name: STORE_NAMES.DASHBOARD_STATS,
        keyPath: 'id',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp' }
        ]
      },
      {
        name: STORE_NAMES.FORMS,
        keyPath: 'id',
        indexes: [
          { name: 'type', keyPath: 'type' },
          { name: 'route', keyPath: 'route' },
          { name: 'timestamp', keyPath: 'timestamp' }
        ]
      },
      {
        name: STORE_NAMES.OPERATIONS,
        keyPath: 'id',
        indexes: [
          { name: 'priority', keyPath: 'priority' },
          { name: 'createdAt', keyPath: 'createdAt' },
          { name: 'scheduledAt', keyPath: 'scheduledAt' }
        ]
      },
      {
        name: STORE_NAMES.SYNC_STATUS,
        keyPath: 'id'
      },
      {
        name: STORE_NAMES.METADATA,
        keyPath: 'key'
      }
    ]
  };

  // Initialize the database
  async initialize(): Promise<void> {
    if (this.isInitialized && this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('IndexedDB initialization timed out after 10 seconds.'));
      }, 10000);

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to open database: ${request.error?.message}`));
      };

      request.onblocked = () => {
        clearTimeout(timeout);
        console.warn('IndexedDB upgrade is blocked by another open connection. Please close other tabs running this application.');
        reject(new Error('IndexedDB upgrade blocked.'));
      };

      request.onsuccess = () => {
        clearTimeout(timeout);
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db, event.oldVersion);
      };
    });
  }

  private createStores(db: IDBDatabase, oldVersion: number): void {
    this.schema.stores.forEach((storeDefinition) => {
      if (!db.objectStoreNames.contains(storeDefinition.name)) {
        // Create new store
        const store = db.createObjectStore(storeDefinition.name, {
          keyPath: storeDefinition.keyPath,
          autoIncrement: storeDefinition.autoIncrement || false
        });

        // Create indexes
        storeDefinition.indexes?.forEach((indexDef) => {
          store.createIndex(indexDef.name, indexDef.keyPath, {
            unique: indexDef.unique || false,
            multiEntry: indexDef.multiEntry || false
          });
        });
      }
      // Note: This simplified logic does not handle index additions/removals
      // on existing stores. A more robust migration path would be needed for that.
    });
  }

  // Generic CRUD operations
  async put<T>(storeName: string, data: CachedData<T>): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to put data: ${request.error?.message}`));
    });
  }

  async get<T>(storeName: string, id: string): Promise<CachedData<T> | null> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result && this.isDataValid(result)) {
          resolve(result);
        } else {
          if (result) {
            // If data is invalid (expired), delete it from the correct store
            this.delete(storeName, result.id).catch(err => console.error(`Failed to delete expired item:`, err));
          }
          resolve(null);
        }
      };
      request.onerror = () => reject(new Error(`Failed to get data: ${request.error?.message}`));
    });
  }

  async getAll<T>(storeName: string): Promise<CachedData<T>[]> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const validResults: CachedData<T>[] = [];
        const itemsToDelete: string[] = [];
        
        for (const item of request.result) {
          if (this.isDataValid(item)) {
            validResults.push(item);
          } else {
            itemsToDelete.push(item.id);
          }
        }
        
        resolve(validResults);

        // Asynchronously delete expired items from the correct store
        if (itemsToDelete.length > 0) {
          this.deleteMany(storeName, itemsToDelete).catch(err => console.error(`Failed to bulk delete expired items:`, err));
        }
      };
      request.onerror = () => reject(new Error(`Failed to get all data: ${request.error?.message}`));
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete data: ${request.error?.message}`));
    });
  }

  async deleteMany(storeName: string, ids: string[]): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      let count = 0;

      if (ids.length === 0) {
        return resolve();
      }

      for (const id of ids) {
        const request = store.delete(id);
        request.onsuccess = () => {
          count++;
          if (count === ids.length) {
            resolve();
          }
        };
        request.onerror = () => {
          // Log error but don't reject the whole operation
          console.error(`Failed to delete item with id ${id} from ${storeName}:`, request.error);
          count++;
          if (count === ids.length) {
            resolve(); // Still resolve
          }
        };
      }
    });
  }

  async clear(storeName: string): Promise<void> {
    await this.ensureInitialized();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear store: ${request.error?.message}`));
    });
  }

  // Query with filters and pagination
  async query<T>(query: CacheQuery<T>): Promise<CacheQueryResult<T>> {
    await this.ensureInitialized();
    
    const allData = await this.getAll<T>(query.store);
    let filteredData = allData;

    // Apply filter
    if (query.filter) {
      filteredData = allData.filter(query.filter);
    }

    // Apply sorting
    if (query.sortBy) {
      filteredData.sort((a, b) => {
        const aVal = a[query.sortBy!];
        const bVal = b[query.sortBy!];
        const order = query.sortOrder === 'desc' ? -1 : 1;
        
        // Handle null/undefined values
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1 * order;
        if (bVal == null) return -1 * order;
        
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    }

    // Apply pagination
    const total = filteredData.length;
    const offset = query.offset || 0;
    const limit = query.limit || total;
    const items = filteredData.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return { items, total, hasMore };
  }

  // Form data specific methods
  async saveForm(form: CachedForm): Promise<void> {
    return this.put(STORE_NAMES.FORMS, {
      id: form.id,
      data: form,
      timestamp: new Date(),
      expiresAt: null,
      dirty: true,
      version: 1,
      source: DataSource.LOCAL
    });
  }

  async getForm(id: string): Promise<CachedForm | null> {
    const cached = await this.get<CachedForm>(STORE_NAMES.FORMS, id);
    return cached?.data || null;
  }

  async getAllForms(): Promise<CachedForm[]> {
    const cached = await this.getAll<CachedForm>(STORE_NAMES.FORMS);
    return cached.map(item => item.data);
  }

  // Cache management
  async cleanupExpiredData(): Promise<void> {
    await this.ensureInitialized();
    
    const stores = [STORE_NAMES.PATIENTS, STORE_NAMES.DRUGS, STORE_NAMES.CLINICS];
    const now = new Date();

    for (const storeName of stores) {
      const allData = await this.getAll(storeName);
      const expiredData = allData.filter(item => 
        item.expiresAt && new Date(item.expiresAt) < now
      );

      for (const item of expiredData) {
        await this.delete(storeName, item.id);
      }
    }
  }

  async getDatabaseSize(): Promise<number> {
    await this.ensureInitialized();
    const stores = Object.values(STORE_NAMES);
    let totalSize = 0;

    for (const storeName of stores) {
      try {
        const transaction = this.db!.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const cursorReq = store.openCursor();
        let storeSize = 0;
        
        await new Promise<void>((resolve, reject) => {
          cursorReq.onsuccess = () => {
            const cursor = cursorReq.result;
            if (cursor) {
              // A more accurate way might be to stringify the data, but this is an estimate
              storeSize += new Blob([JSON.stringify(cursor.value)]).size;
              cursor.continue();
            } else {
              resolve();
            }
          };
          cursorReq.onerror = () => reject(cursorReq.error);
        });
        
        totalSize += storeSize;
      } catch (error) {
        console.warn(`Could not determine size of store ${storeName}:`, error);
      }
    }
    return totalSize;
  }
  
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || !this.db) {
      await this.initialize();
    }
  }

  private isDataValid<T>(data: CachedData<T>): boolean {
    if (!data) return false;
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      // Data has expired, the caller is now responsible for deletion
      return false;
    }
    return true;
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      console.log('IndexedDB connection closed.');
    }
  }

  async deleteDatabase(): Promise<void> {
    this.close();
    
    return new Promise((resolve, reject) => {
      console.log(`Attempting to delete database: ${this.dbName}`);
      const deleteRequest = indexedDB.deleteDatabase(this.dbName);

      deleteRequest.onsuccess = () => {
        console.log(`Database ${this.dbName} deleted successfully.`);
        this.isInitialized = false;
        this.db = null;
        resolve();
      };

      deleteRequest.onerror = (event) => {
        console.error(`Error deleting database:`, deleteRequest.error);
        reject(new Error(`Could not delete database: ${deleteRequest.error?.message}`));
      };
      
      deleteRequest.onblocked = (event) => {
        console.warn(`Database deletion blocked. Please close other tabs.`);
        reject(new Error('Database deletion is blocked by another open connection. Please close other tabs and try again.'));
      };
    });
  }

  get isReady(): boolean {
    return this.isInitialized && !!this.db;
  }
}

export const indexedDBService = new IndexedDBService(); 