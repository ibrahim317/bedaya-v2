import { offlineService } from '@/services/offlineService';
import { cacheService, CacheOptions } from '@/services/cacheService';
import { syncService } from '@/services/syncService';
import { fetchJson } from './base';
import { HttpMethod, OperationType, Priority } from '@/types/SyncQueue';

type OfflineClientOptions = CacheOptions & {
  // Should this operation be queued if offline?
  queueable?: boolean;
  // What priority should the queued operation have?
  priority?: Priority;
  // Maximum number of retry attempts for the queued operation
  maxAttempts?: number;
};

class OfflineClient {
  /**
   * Performs a GET request, with offline-first caching.
   * Fetches from the network if online, otherwise serves from cache.
   * Automatically caches the network response.
   */
  async get<T>(
    store: string,
    id: string,
    url: string,
    options: OfflineClientOptions = {}
  ): Promise<T | null> {
    const { forceRefresh = false, ttl } = options;

    if (offlineService.shouldUseCache() && !forceRefresh) {
      const cachedData = await cacheService.get<T>(store, id);
      if (cachedData) {
        return cachedData;
      }
    }

    // If offline and no cache, return null
    if (offlineService.isOffline()) {
      return null;
    }

    try {
      const data = await fetchJson<T>(url, { method: 'GET' });
      // Cache the response
      await cacheService.set(store, id, data, { ttl });
      return data;
    } catch (error) {
      console.error(`Failed to fetch GET ${url}:`, error);
      // Fallback to cache on error
      return cacheService.get<T>(store, id);
    }
  }

  /**
   * Performs a GET request for a list of items, with offline-first caching.
   * Similar to `get`, but for lists of data.
   */
  async getAll<T>(
    store: string,
    url: string,
    options: OfflineClientOptions = {}
  ): Promise<T[]> {
    const { forceRefresh = false, ttl } = options;

    if (offlineService.shouldUseCache() && !forceRefresh) {
      const cachedResult = await cacheService.query<T>({ store });
      if (cachedResult && cachedResult.items.length > 0) {
        return cachedResult.items;
      }
    }

    if (offlineService.isOffline()) {
      return [];
    }

    try {
      const response = await fetchJson<any>(url, { method: 'GET' });

      let items: T[];

      if (Array.isArray(response)) {
        items = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        items = response.data;
      } else if (response && response.drugs && Array.isArray(response.drugs)) {
        items = response.drugs;
      } else {
        console.warn(`Unexpected response format from ${url}. Returning empty array and attempting to use cache.`);
        const cachedResult = await cacheService.query<T>({ store });
        return cachedResult ? cachedResult.items : [];
      }
      
      await this.cacheItems(store, items, ttl);
      return items;
    } catch (error) {
      console.error(`Failed to fetch GET all from ${url}:`, error);
      const cachedResult = await cacheService.query<T>({ store });
      return cachedResult.items;
    }
  }

  /**
   * Performs a POST request.
   * If offline and the operation is `queueable`, it adds it to the sync queue.
   * If online, it performs the request and updates the cache.
   */
  async post<T>(
    store: string,
    url: string,
    body: any,
    options: OfflineClientOptions = {}
  ): Promise<T> {
    const { queueable = true, priority = Priority.NORMAL, maxAttempts = 3, ttl } = options;

    if (offlineService.isOffline() && queueable) {
      // Queue the operation
      await syncService.queueOperation({
        type: OperationType.CREATE,
        endpoint: url,
        method: HttpMethod.POST,
        data: body,
        priority,
        maxAttempts,
        metadata: {
          entityType: store,
          rollbackData: null,
        },
      });
      // Return optimistic response (e.g., the body with a temporary ID)
      return { ...body, id: `temp-${Date.now()}` } as T;
    }

    const data = await fetchJson<T>(url, { method: 'POST', body: JSON.stringify(body) });

    // Update cache with the new item
    const id = (data as any)._id || (data as any).id;
    if (id) {
      await cacheService.set(store, id, data, { ttl });
    }

    return data;
  }

  /**
   * Performs a PUT request.
   * If offline and `queueable`, it updates the local cache and queues the operation.
   * If online, it performs the request and updates the cache.
   */
  async put<T>(
    store: string,
    id: string,
    url: string,
    body: any,
    options: OfflineClientOptions = {}
  ): Promise<T> {
    const { queueable = true, priority = Priority.NORMAL, maxAttempts = 3, ttl } = options;

    if (offlineService.isOffline() && queueable) {
      // Optimistically update cache and mark as dirty
      await cacheService.set(store, id, body, { source: 'local' as any });
      await cacheService.markDirty(store, id);

      // Queue the operation
      await syncService.queueOperation({
        type: OperationType.UPDATE,
        endpoint: url,
        method: HttpMethod.PUT,
        data: body,
        priority,
        maxAttempts,
        metadata: {
          entityType: store,
          entityId: id,
          rollbackData: null, // You might store the original state here
        },
      });
      return body as T;
    }

    const data = await fetchJson<T>(url, { method: 'PUT', body: JSON.stringify(body) });

    // Update cache with the new version
    await cacheService.set(store, id, data, { ttl });

    return data;
  }

  /**
   * Performs a DELETE request.
   * If offline and `queueable`, it removes the item from the cache and queues the operation.
   * If online, it performs the request and invalidates the cache.
   */
  async delete(
    store: string,
    id: string,
    url: string,
    options: OfflineClientOptions = {}
  ): Promise<void> {
    const { queueable = true, priority = Priority.HIGH, maxAttempts = 3 } = options;

    if (offlineService.isOffline() && queueable) {
      // Optimistically delete from cache
      await cacheService.invalidate(store, id);
      
      // Queue the operation
      await syncService.queueOperation({
        type: OperationType.DELETE,
        endpoint: url,
        method: HttpMethod.DELETE,
        data: { id },
        priority,
        maxAttempts,
        metadata: {
          entityType: store,
          entityId: id,
        },
      });
      return;
    }

    await fetchJson(url, { method: 'DELETE' });
    // Invalidate cache
    await cacheService.invalidate(store, id);
  }

  private async cacheItems<T>(store: string, items: T[], ttl?: number): Promise<void> {
    for (const item of items) {
      const id = (item as any)._id || (item as any).id;
      if (id) {
        await cacheService.set(store, id, item, { ttl });
      }
    }
  }
}

export const offlineClient = new OfflineClient(); 