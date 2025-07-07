import { 
  OfflineState, 
  ConnectionQuality, 
  SyncStatus, 
  OfflineMode,
  NetworkStatus,
  ConnectionTest
} from '@/types/OfflineState';

export type OfflineEventType = 'online' | 'offline' | 'quality-change' | 'sync-status-change';
export type OfflineEventCallback = (state: OfflineState) => void;

class OfflineService {
  private state: OfflineState = {
    isOnline: navigator.onLine,
    isInitialized: false,
    lastOnlineAt: navigator.onLine ? new Date() : null,
    connectionQuality: navigator.onLine ? ConnectionQuality.GOOD : ConnectionQuality.OFFLINE,
    syncStatus: SyncStatus.IDLE,
    pendingOperations: 0
  };

  private mode: OfflineMode = OfflineMode.CACHE_FIRST;
  private listeners: Map<OfflineEventType, Set<OfflineEventCallback>> = new Map();
  private connectionTestInterval: NodeJS.Timeout | null = null;
  private readonly testInterval = 30000; // 30 seconds
  private readonly testEndpoint = '/api/health'; // Lightweight health check endpoint
  private isMonitoring = false;

  // Initialize the offline service
  async initialize(): Promise<void> {
    if (this.state.isInitialized) {
      return;
    }

    // Set up browser event listeners
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Perform initial connection test
    await this.testConnection();
    
    // Start periodic monitoring
    this.startMonitoring();
    
    this.state.isInitialized = true;
    this.emitEvent('online');
  }

  private handleOnline = async (): Promise<void> => {
    console.log('Browser online event detected');
    
    // Verify actual connectivity with server ping
    await this.testConnection();
    
    if (this.state.isOnline) {
      this.state.lastOnlineAt = new Date();
      this.emitEvent('online');
    }
  };

  private handleOffline = (): void => {
    console.log('Browser offline event detected');
    this.updateConnectionState(false, ConnectionQuality.OFFLINE);
    this.emitEvent('offline');
  };

  private async testConnection(): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Use fetch with timeout and no-cache headers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(this.testEndpoint, {
        method: 'HEAD', // Lightweight request
        signal: controller.signal,
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      const latency = Date.now() - startTime;
      const isOnline = response.ok;
      
      if (isOnline) {
        const quality = this.calculateConnectionQuality(latency);
        this.updateConnectionState(true, quality);
        
        // Log connection test for monitoring
        const test: ConnectionTest = {
          timestamp: new Date(),
          latency,
          success: true,
          endpoint: this.testEndpoint
        };
        
        console.log('Connection test successful:', test);
      } else {
        this.updateConnectionState(false, ConnectionQuality.OFFLINE);
      }
      
    } catch (error) {
      console.log('Connection test failed:', error);
      this.updateConnectionState(false, ConnectionQuality.OFFLINE);
    }
  }

  private calculateConnectionQuality(latency: number): ConnectionQuality {
    if (latency < 100) return ConnectionQuality.EXCELLENT;
    if (latency < 300) return ConnectionQuality.GOOD;
    if (latency < 1000) return ConnectionQuality.POOR;
    return ConnectionQuality.OFFLINE;
  }

  private updateConnectionState(isOnline: boolean, quality: ConnectionQuality): void {
    const previousOnline = this.state.isOnline;
    const previousQuality = this.state.connectionQuality;
    
    this.state.isOnline = isOnline;
    this.state.connectionQuality = quality;
    
    if (isOnline && !previousOnline) {
      this.state.lastOnlineAt = new Date();
    }
    
    // Emit events for state changes
    if (previousOnline !== isOnline) {
      this.emitEvent(isOnline ? 'online' : 'offline');
    }
    
    if (previousQuality !== quality) {
      this.emitEvent('quality-change');
    }
  }

  private startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = true;
    this.connectionTestInterval = setInterval(() => {
      this.testConnection();
    }, this.testInterval);
  }

  private stopMonitoring(): void {
    if (this.connectionTestInterval) {
      clearInterval(this.connectionTestInterval);
      this.connectionTestInterval = null;
      this.isMonitoring = false;
    }
  }

  // Public API methods
  getState(): OfflineState {
    return { ...this.state };
  }

  getMode(): OfflineMode {
    return this.mode;
  }

  setMode(mode: OfflineMode): void {
    this.mode = mode;
  }

  async refreshConnection(): Promise<void> {
    await this.testConnection();
  }

  setSyncStatus(status: SyncStatus): void {
    this.state.syncStatus = status;
    this.emitEvent('sync-status-change');
  }

  setPendingOperations(count: number): void {
    this.state.pendingOperations = count;
  }

  incrementPendingOperations(): void {
    this.state.pendingOperations++;
  }

  decrementPendingOperations(): void {
    this.state.pendingOperations = Math.max(0, this.state.pendingOperations - 1);
  }

  // Event management
  addEventListener(event: OfflineEventType, callback: OfflineEventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  removeEventListener(event: OfflineEventType, callback: OfflineEventCallback): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private emitEvent(event: OfflineEventType): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(this.getState());
        } catch (error) {
          console.error(`Error in offline event callback for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  isOnline(): boolean {
    return this.state.isOnline;
  }

  isOffline(): boolean {
    return !this.state.isOnline;
  }

  hasGoodConnection(): boolean {
    return this.state.isOnline && 
           (this.state.connectionQuality === ConnectionQuality.EXCELLENT || 
            this.state.connectionQuality === ConnectionQuality.GOOD);
  }

  hasPoorConnection(): boolean {
    return this.state.isOnline && this.state.connectionQuality === ConnectionQuality.POOR;
  }

  getTimeSinceLastOnline(): number | null {
    if (!this.state.lastOnlineAt) {
      return null;
    }
    return Date.now() - this.state.lastOnlineAt.getTime();
  }

  shouldUseCache(): boolean {
    switch (this.mode) {
      case OfflineMode.FULL_OFFLINE:
        return true;
      case OfflineMode.CACHE_FIRST:
        return true; // Always prefer cache in this mode
      case OfflineMode.ONLINE_FIRST:
        return !this.hasGoodConnection();
      default:
        return !this.isOnline();
    }
  }

  shouldSyncNow(): boolean {
    return this.hasGoodConnection() && this.state.syncStatus === SyncStatus.IDLE;
  }

  // Cleanup
  destroy(): void {
    this.stopMonitoring();
    
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    this.listeners.clear();
    this.state.isInitialized = false;
  }
}

// Singleton instance
export const offlineService = new OfflineService(); 