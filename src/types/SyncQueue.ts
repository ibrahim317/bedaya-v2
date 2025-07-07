// Sync queue and operation management types
export interface QueuedOperation {
  id: string;
  type: OperationType;
  endpoint: string;
  method: HttpMethod;
  data: any;
  priority: Priority;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledAt: Date;
  lastAttemptAt: Date | null;
  error: string | null;
  userId?: string;
  metadata: OperationMetadata;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update', 
  DELETE = 'delete',
  BULK_CREATE = 'bulk_create',
  BULK_UPDATE = 'bulk_update',
  BULK_DELETE = 'bulk_delete'
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export enum Priority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  CRITICAL = 4
}

export interface OperationMetadata {
  entityType: string;     // 'patient', 'drug', 'clinic', etc.
  entityId?: string;      // For updates/deletes
  dependencies?: string[]; // IDs of operations this depends on
  conflicts?: string[];   // Operations that conflict with this one
  rollbackData?: any;     // Data needed to rollback the operation
}

// Sync status and progress tracking
export interface SyncProgress {
  total: number;
  completed: number;
  failed: number;
  current: QueuedOperation | null;
  startedAt: Date;
  estimatedCompletion: Date | null;
  errors: SyncError[];
}

export interface SyncError {
  operationId: string;
  error: string;
  timestamp: Date;
  isRecoverable: boolean;
  retryCount: number;
}

export interface SyncResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: SyncError[];
  completedAt: Date;
  duration: number; // in milliseconds
}

// Conflict resolution types
export interface ConflictResolution {
  operationId: string;
  strategy: ResolutionStrategy;
  resolvedData: any;
  resolvedAt: Date;
  resolvedBy: string; // user or system
}

export enum ResolutionStrategy {
  USE_LOCAL = 'use_local',       // Keep local changes
  USE_REMOTE = 'use_remote',     // Use server version
  MERGE = 'merge',               // Merge both versions
  MANUAL = 'manual',             // User resolves manually
  SKIP = 'skip'                  // Skip this operation
}

// Queue management and configuration
export interface QueueConfiguration {
  maxQueueSize: number;
  batchSize: number;            // Number of operations to process at once
  retryDelayMs: number;         // Base delay between retries
  maxRetryDelayMs: number;      // Maximum delay for exponential backoff
  concurrentOperations: number; // Max simultaneous sync operations
  timeoutMs: number;           // Operation timeout
}

export interface QueueStatistics {
  totalOperations: number;
  pendingOperations: number;
  failedOperations: number;
  averageProcessingTime: number;
  lastSyncAt: Date | null;
  nextScheduledSync: Date | null;
  errorRate: number;
}

// Batch processing types
export interface BatchOperation {
  id: string;
  operations: QueuedOperation[];
  priority: Priority;
  createdAt: Date;
  status: BatchStatus;
}

export enum BatchStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PARTIALLY_FAILED = 'partially_failed'
}

// Event types for sync monitoring
export interface SyncEvent {
  type: SyncEventType;
  operationId?: string;
  data?: any;
  timestamp: Date;
}

export enum SyncEventType {
  QUEUE_STARTED = 'queue_started',
  QUEUE_COMPLETED = 'queue_completed',
  OPERATION_STARTED = 'operation_started',
  OPERATION_COMPLETED = 'operation_completed',
  OPERATION_FAILED = 'operation_failed',
  CONFLICT_DETECTED = 'conflict_detected',
  BATCH_PROCESSED = 'batch_processed'
} 