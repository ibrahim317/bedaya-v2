
import { useState, useEffect, useCallback } from 'react';
import { Spin, Alert, Empty } from 'antd';
import { useOffline } from '@/providers/OfflineProvider';

interface OfflineDataWrapperProps<T> {
  fetchData: () => Promise<T[]>;
  getCachedData: () => Promise<T[]>;
  cacheKey: string;
  children: (data: T[], loading: boolean) => React.ReactNode;
}

export default function OfflineDataWrapper<T>({
  fetchData,
  getCachedData,
  cacheKey,
  children,
}: OfflineDataWrapperProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useOffline();
  const { isOnline } = state;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isOnline) {
        const freshData = await fetchData();
        setData(freshData);
      } else {
        const cachedData = await getCachedData();
        if (cachedData.length > 0) {
          setData(cachedData);
        } else {
          setError('No cached data available. Please connect to the internet.');
        }
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      try {
        const cachedData = await getCachedData();
        if (cachedData.length > 0) {
          setData(cachedData);
        }
      } catch (cacheErr) {
        // Cache is also unavailable
      }
    } finally {
      setLoading(false);
    }
  }, [isOnline, fetchData, getCachedData, cacheKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="m-4"
      />
    );
  }
  
  if (!loading && data.length === 0) {
    return (
        <div className="p-8">
            <Empty description="No data found." />
        </div>
    );
  }

  return <>{children(data, loading)}</>;
} 