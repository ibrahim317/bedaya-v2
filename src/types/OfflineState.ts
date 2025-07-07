// Core offline state and connection types
export interface OfflineState {
  isOnline: boolean;
  isInitialized: boolean;
  lastOnlineAt: Date | null;
  connectionQuality: ConnectionQuality;
  syncStatus: SyncStatus;
  pendingOperations: number;
}

export enum ConnectionQuality {
  EXCELLENT = 'excellent',  // < 100ms ping, stable
  GOOD = 'good',           // 100-300ms ping  
  POOR = 'poor',           // 300-1000ms ping
  OFFLINE = 'offline'      // No connection
}

export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing', 
  SUCCESS = 'success',
  ERROR = 'error',
  PAUSED = 'paused'
}

export enum OfflineMode {
  FULL_OFFLINE = 'full_offline',     // Complete offline experience
  CACHE_FIRST = 'cache_first',       // Prefer cached data when available
  ONLINE_FIRST = 'online_first'      // Prefer live data with cache fallback
}

// Context and provider types
export interface OfflineContextType {
  state: OfflineState;
  mode: OfflineMode;
  setMode: (mode: OfflineMode) => void;
  refreshConnection: () => Promise<void>;
  clearCache: () => Promise<void>;
  forceSync: () => Promise<void>;
}

// Network monitoring types
export interface ConnectionTest {
  timestamp: Date;
  latency: number;
  success: boolean;
  endpoint: string;
}

export interface NetworkStatus {
  isOnline: boolean;
  quality: ConnectionQuality;
  lastTest: ConnectionTest | null;
  nextTestAt: Date;
} 