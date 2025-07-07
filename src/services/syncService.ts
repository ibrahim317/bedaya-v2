import { indexedDBService } from './indexedDBService';
import { offlineService } from './offlineService';
import { cacheService } from './cacheService';
import { 
  QueuedOperation, 
  OperationType, 
  Priority, 
  SyncProgress, 
  SyncResult, 
  SyncError,
  QueueConfiguration,
  ConflictResolution,
  ResolutionStrategy,
  BatchOperation,
  BatchStatus,
  HttpMethod
} from '@/types/SyncQueue';
import { STORE_NAMES } from '@/types/IndexedDB';
import { SyncStatus } from '@/types/OfflineState';

class SyncService {
  private isProcessing = false;
  private progress: SyncProgress | null = null;
  private config: QueueConfiguration = {
    maxQueueSize: 1000,
    batchSize: 10,
    retryDelayMs: 1000,
    maxRetryDelayMs: 30000,
    concurrentOperations: 3,
    timeoutMs: 30000
  };

  async initialize(): Promise<void> {
    await indexedDBService.initialize();
    
    // Listen for online events to trigger sync
    offlineService.addEventListener('online', this.handleOnlineEvent.bind(this));
    
    // Start periodic sync when online
    this.startPeriodicSync();
  }

  private handleOnlineEvent = async (): Promise<void> => {
    if (offlineService.hasGoodConnection() && !this.isProcessing) {
      console.log('Connection restored, starting sync...');
      await this.processQueue();
    }
  };

  // Queue management
  async queueOperation(operation: Omit<QueuedOperation, 'id' | 'attempts' | 'createdAt' | 'scheduledAt' | 'lastAttemptAt' | 'error'>): Promise<string> {
    const id = this.generateOperationId();
    const now = new Date();
    
    const queuedOp: QueuedOperation = {
      id,
      ...operation,
      attempts: 0,
      createdAt: now,
      scheduledAt: now,
      lastAttemptAt: null,
      error: null
    };

    await indexedDBService.put(STORE_NAMES.OPERATIONS, {
      id,
      data: queuedOp,
      timestamp: now,
      expiresAt: null,
      dirty: false,
      version: 1,
      source: 'local' as any
    });

    offlineService.incrementPendingOperations();
    
    // Try to process immediately if online
    if (offlineService.hasGoodConnection() && !this.isProcessing) {
      setImmediate(() => this.processQueue());
    }

    return id;
  }

  async getQueuedOperations(): Promise<QueuedOperation[]> {
    const cached = await indexedDBService.getAll<QueuedOperation>(STORE_NAMES.OPERATIONS);
    return cached
      .map(item => item.data)
      .sort((a, b) => {
        // Sort by priority (higher first), then by creation time (older first)
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }

  async removeOperation(id: string): Promise<void> {
    await indexedDBService.delete(STORE_NAMES.OPERATIONS, id);
    offlineService.decrementPendingOperations();
  }

  // Sync processing
  async processQueue(): Promise<SyncResult> {
    if (this.isProcessing) {
      throw new Error('Sync already in progress');
    }

    if (!offlineService.hasGoodConnection()) {
      throw new Error('No good connection available for sync');
    }

    this.isProcessing = true;
    offlineService.setSyncStatus(SyncStatus.SYNCING);

    const startTime = Date.now();
    const operations = await this.getQueuedOperations();
    
    this.progress = {
      total: operations.length,
      completed: 0,
      failed: 0,
      current: null,
      startedAt: new Date(),
      estimatedCompletion: null,
      errors: []
    };

    let processed = 0;
    let failed = 0;
    const errors: SyncError[] = [];

    try {
      // Process operations in batches
      for (let i = 0; i < operations.length; i += this.config.batchSize) {
        const batch = operations.slice(i, i + this.config.batchSize);
        
        for (const operation of batch) {
          this.progress.current = operation;
          
          try {
            await this.processOperation(operation);
            await this.removeOperation(operation.id);
            processed++;
            this.progress.completed++;
          } catch (error) {
            console.error(`Failed to process operation ${operation.id}:`, error);
            
            const syncError: SyncError = {
              operationId: operation.id,
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date(),
              isRecoverable: this.isRecoverableError(error),
              retryCount: operation.attempts
            };

            errors.push(syncError);
            this.progress.errors.push(syncError);
            failed++;
            this.progress.failed++;

            // Retry logic
            if (syncError.isRecoverable && operation.attempts < operation.maxAttempts) {
              await this.scheduleRetry(operation);
            } else {
              // Move to failed operations or remove
              await this.removeOperation(operation.id);
            }
          }

          // Check if connection is still good
          if (!offlineService.hasGoodConnection()) {
            console.log('Connection lost during sync, pausing...');
            break;
          }
        }
      }

    } finally {
      this.isProcessing = false;
      this.progress = null;
      
      const status = errors.length === 0 ? SyncStatus.SUCCESS : SyncStatus.ERROR;
      offlineService.setSyncStatus(status);
    }

    const result: SyncResult = {
      success: failed === 0,
      processed,
      failed,
      errors,
      completedAt: new Date(),
      duration: Date.now() - startTime
    };

    console.log('Sync completed:', result);
    return result;
  }

  private async processOperation(operation: QueuedOperation): Promise<void> {
    const { endpoint, method, data } = operation;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Include auth headers if necessary
        },
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Received non-JSON error response' }));
        throw new Error(`Sync failed for ${method} ${endpoint}: ${response.status} ${response.statusText} - ${errorData.message}`);
      }
      
      const result = await response.json();

      // After a successful API call, update the local cache with the server's response.
      await this.updateCacheFromResponse(operation, result);

    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Error during operation processing:`, error);
      // Re-throw the error to be handled by the queue processor (for retries, etc.)
      throw error;
    }
  }
  
  private async updateCacheFromResponse(operation: QueuedOperation, result: any): Promise<void> {
    const { entityType, entityId } = operation.metadata;

    if (!entityType) return;

    // The result from the server is the source of truth.
    // We need to update our local IndexedDB cache with this new data.
    const storeName = this.getStoreNameForEntityType(entityType);
    if (!storeName) return;

    switch (operation.type) {
      case OperationType.CREATE:
        // The result of a create operation should be the newly created entity.
        // The server response should contain the full object, including the new _id.
        if (result && result._id) {
          await cacheService.set(storeName, result._id, result);
        }
        break;

      case OperationType.UPDATE:
        // The result of an update should be the updated entity.
        if (result && (entityId || result._id)) {
          await cacheService.set(storeName, entityId || result._id, result);
        }
        break;

      case OperationType.DELETE:
        // After a successful delete, we remove the item from our local cache.
        if (entityId) {
          await cacheService.invalidate(storeName, entityId);
        }
        break;
      
      // Handle bulk operations if necessary
    }
  }

  private async scheduleRetry(operation: QueuedOperation): Promise<void> {
    const delay = Math.min(
      this.config.retryDelayMs * Math.pow(2, operation.attempts - 1),
      this.config.maxRetryDelayMs
    );

    operation.scheduledAt = new Date(Date.now() + delay);
    
    await indexedDBService.put(STORE_NAMES.OPERATIONS, {
      id: operation.id,
      data: operation,
      timestamp: new Date(),
      expiresAt: null,
      dirty: false,
      version: 1,
      source: 'local' as any
    });

    console.log(`Scheduled retry for operation ${operation.id} in ${delay}ms`);
  }

  private isRecoverableError(error: any): boolean {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true; // Network error
    }
    
    if (error instanceof Error && error.message.includes('timeout')) {
      return true; // Timeout error
    }

    // Check for specific HTTP status codes
    const statusMatch = error.message?.match(/HTTP (\d+)/);
    if (statusMatch) {
      const status = parseInt(statusMatch[1]);
      // Retry on server errors but not client errors
      return status >= 500 || status === 429; // 5xx or rate limit
    }

    return false;
  }

  private getStoreNameForEntityType(entityType: string): string | null {
    switch (entityType.toLowerCase()) {
      case 'patient': return STORE_NAMES.PATIENTS;
      case 'drug': return STORE_NAMES.DRUGS;
      case 'clinic': return STORE_NAMES.CLINICS;
      // ... other entity types
      default: return null;
    }
  }

  // Convenience methods for common operations
  async queuePatientCreate(patientData: any): Promise<string> {
    return this.queueOperation({
      type: OperationType.CREATE,
      endpoint: '/api/patients',
      method: HttpMethod.POST,
      data: patientData,
      priority: Priority.HIGH,
      maxAttempts: 3,
      metadata: {
        entityType: 'patient',
        rollbackData: null
      }
    });
  }

  async queuePatientUpdate(patientId: string, patientData: any): Promise<string> {
    return this.queueOperation({
      type: OperationType.UPDATE,
      endpoint: `/api/patients/${patientId}`,
      method: HttpMethod.PUT,
      data: patientData,
      priority: Priority.NORMAL,
      maxAttempts: 3,
      metadata: {
        entityType: 'patient',
        entityId: patientId,
        rollbackData: null
      }
    });
  }

  async queueDrugCreate(drugData: any): Promise<string> {
    return this.queueOperation({
      type: OperationType.CREATE,
      endpoint: '/api/drugs',
      method: HttpMethod.POST,
      data: drugData,
      priority: Priority.NORMAL,
      maxAttempts: 3,
      metadata: {
        entityType: 'drug',
        rollbackData: null
      }
    });
  }

  // Utility methods
  getSyncProgress(): SyncProgress | null {
    return this.progress;
  }

  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }

  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startPeriodicSync(): void {
    // Run sync every 5 minutes when online
    setInterval(async () => {
      if (offlineService.hasGoodConnection() && !this.isProcessing) {
        const operations = await this.getQueuedOperations();
        if (operations.length > 0) {
          console.log(`Starting periodic sync for ${operations.length} operations`);
          try {
            await this.processQueue();
          } catch (error) {
            console.error('Periodic sync failed:', error);
          }
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Manual sync trigger
  async forceSync(): Promise<SyncResult> {
    if (!offlineService.isOnline()) {
      throw new Error('Cannot sync while offline');
    }

    return this.processQueue();
  }

  // Queue statistics
  async getQueueStats() {
    const operations = await this.getQueuedOperations();
    const now = new Date();
    
    return {
      total: operations.length,
      pending: operations.filter(op => op.scheduledAt <= now).length,
      scheduled: operations.filter(op => op.scheduledAt > now).length,
      failed: operations.filter(op => op.attempts >= op.maxAttempts).length
    };
  }
}

// Singleton instance
export const syncService = new SyncService(); 