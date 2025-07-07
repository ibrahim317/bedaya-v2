'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { 
  OfflineState, 
  OfflineContextType, 
  OfflineMode,
  SyncStatus 
} from '@/types/OfflineState';
import { offlineService } from '@/services/offlineService';
import { cacheService } from '@/services/cacheService';
import { syncService } from '@/services/syncService';
import { indexedDBService } from '@/services/indexedDBService';

// Create the context
const OfflineContext = createContext<OfflineContextType | null>(null);

// Hook to use the offline context
export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

interface OfflineProviderProps {
  children: ReactNode;
}

export default function OfflineProvider({ children }: OfflineProviderProps) {
  const [state, setState] = useState<OfflineState>({
    isOnline: navigator.onLine,
    isInitialized: false,
    lastOnlineAt: null,
    connectionQuality: 'offline' as any,
    syncStatus: SyncStatus.IDLE,
    pendingOperations: 0
  });
  
  const [mode, setMode] = useState<OfflineMode>(OfflineMode.CACHE_FIRST);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  // Initialize all offline services
  const initializeServices = useCallback(async () => {
    try {
      setIsInitializing(true);
      setInitializationError(null);
      console.log('Initializing offline services...');
      
      // Initialize services in order
      await indexedDBService.initialize();
      await cacheService.initialize();
      await offlineService.initialize();
      await syncService.initialize();
      
      // Set up event listeners
      offlineService.addEventListener('online', setState);
      offlineService.addEventListener('offline', setState);
      offlineService.addEventListener('quality-change', setState);
      offlineService.addEventListener('sync-status-change', setState);

      // Get initial state
      setState(offlineService.getState());
      
      console.log('Offline services initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize offline services:', error);
      setInitializationError(error as Error);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initializeServices();

    // Cleanup on unmount
    return () => {
      offlineService.destroy();
      // Clean up event listeners
      offlineService.removeEventListener('online', setState);
      offlineService.removeEventListener('offline', setState);
      offlineService.removeEventListener('quality-change', setState);
      offlineService.removeEventListener('sync-status-change', setState);
    };
  }, [initializeServices]);

  // Refresh connection manually
  const refreshConnection = async (): Promise<void> => {
    try {
      await offlineService.refreshConnection();
    } catch (error) {
      console.error('Failed to refresh connection:', error);
    }
  };

  // Clear all cached data
  const clearCache = async (): Promise<void> => {
    try {
      await cacheService.clearAllCache();
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  };

  // Force synchronization
  const forceSync = async (): Promise<void> => {
    try {
      if (!offlineService.isOnline()) {
        throw new Error('Cannot sync while offline');
      }
      
      await syncService.forceSync();
      console.log('Forced sync completed');
    } catch (error) {
      console.error('Failed to force sync:', error);
      throw error;
    }
  };

  // Update mode and propagate to offline service
  const handleSetMode = (newMode: OfflineMode): void => {
    setMode(newMode);
    offlineService.setMode(newMode);
  };

  const handleDeleteAndRetry = async () => {
    try {
      setInitializationError(null);
      setIsInitializing(true);
      await indexedDBService.deleteDatabase();
      await initializeServices();
    } catch (error) {
      console.error('Failed to delete and retry initialization:', error);
      setInitializationError(error as Error);
    } finally {
      setIsInitializing(false);
    }
  };

  const contextValue: OfflineContextType = {
    state,
    mode,
    setMode: handleSetMode,
    refreshConnection,
    clearCache,
    forceSync
  };

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing offline capabilities...</p>
        </div>
      </div>
    );
  }

  if (initializationError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Initialization Failed</h2>
          <p className="text-gray-700 mb-4">
            Could not initialize offline capabilities. The application may not function correctly.
          </p>
          <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded mb-4">
            <strong>Error:</strong> {initializationError.message}
          </p>
          <button
            onClick={initializeServices}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retry Initialization
          </button>
          <button
            onClick={handleDeleteAndRetry}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-2"
          >
            Clear Data and Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
    </OfflineContext.Provider>
  );
}

// Additional hooks for specific use cases
export const useOfflineState = () => {
  const { state } = useOffline();
  return state;
};

export const useConnectionStatus = () => {
  const { state } = useOffline();
  return {
    isOnline: state.isOnline,
    connectionQuality: state.connectionQuality,
    lastOnlineAt: state.lastOnlineAt
  };
};

export const useSyncStatus = () => {
  const { state, forceSync } = useOffline();
  return {
    syncStatus: state.syncStatus,
    pendingOperations: state.pendingOperations,
    forceSync
  };
};

export const useOfflineMode = () => {
  const { mode, setMode } = useOffline();
  return { mode, setMode };
}; 