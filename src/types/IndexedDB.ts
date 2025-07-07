// IndexedDB database schema and types
export interface DatabaseSchema {
  name: string;
  version: number;
  stores: StoreDefinition[];
}

export interface StoreDefinition {
  name: string;
  keyPath: string;
  autoIncrement?: boolean;
  indexes?: IndexDefinition[];
}

export interface IndexDefinition {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  multiEntry?: boolean;
}

// Cached data wrapper types
export interface CachedData<T = any> {
  id: string;
  data: T;
  timestamp: Date;
  expiresAt: Date | null;
  dirty: boolean;         // Has local changes not synced
  version: number;        // For conflict resolution
  source: DataSource;
}

export enum DataSource {
  SERVER = 'server',      // Original from server
  LOCAL = 'local',        // Created locally
  CACHE = 'cache'         // Cached from server
}

// Store names as constants
export const STORE_NAMES = {
  PATIENTS: 'patients',
  DRUGS: 'drugs', 
  CLINICS: 'clinics',
  CLINICS_SUMMARY: 'clinics_summary',
  DASHBOARD_STATS: 'dashboard_stats',
  FORMS: 'forms',
  OPERATIONS: 'operations',
  SYNC_STATUS: 'sync_status',
  METADATA: 'metadata'
} as const;

// Form data persistence types
export interface CachedForm {
  id: string;
  type: FormType;
  route: string;
  data: Record<string, any>;
  timestamp: Date;
  isComplete: boolean;
  userId?: string;
}

export enum FormType {
  PATIENT_CREATE = 'patient_create',
  PATIENT_UPDATE = 'patient_update', 
  DRUG_CREATE = 'drug_create',
  DRUG_UPDATE = 'drug_update',
  CLINIC_CREATE = 'clinic_create',
  VISIT_CREATE = 'visit_create',
  TREATMENT_CREATE = 'treatment_create'
}

// Metadata for database management
export interface DatabaseMetadata {
  version: string;
  lastCleanup: Date;
  totalSize: number;
  userPreferences: UserPreferences;
}

export interface UserPreferences {
  cacheRetentionDays: number;
  maxCacheSize: number; // in MB
  syncFrequency: number; // in minutes
  offlineMode: string;
}

// Transaction types
export type TransactionMode = 'readonly' | 'readwrite';

export interface DatabaseTransaction {
  stores: string[];
  mode: TransactionMode;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

// Query and filter types for cached data
export interface CacheQuery<T = any> {
  store: string;
  filter?: (item: CachedData<T>) => boolean;
  limit?: number;
  offset?: number;
  sortBy?: keyof CachedData<T>;
  sortOrder?: 'asc' | 'desc';
}

export interface CacheQueryResult<T = any> {
  items: CachedData<T>[];
  total: number;
  hasMore: boolean;
} 