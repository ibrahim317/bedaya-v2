'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Table, Spin, Alert, Empty } from 'antd';
import { TableProps } from 'antd/lib/table';
import { useConnectionStatus } from '@/providers/OfflineProvider';

// Custom props for the OfflineTable
interface OfflineTableProps<T extends object> extends TableProps<T> {
  // Function to fetch data from the network
  fetchData: () => Promise<T[]>;
  // Function to get cached data from IndexedDB
  getCachedData: () => Promise<T[]>;
  // A unique key for this table's data in the cache
  cacheKey: string;
}

const OfflineTable = <T extends object>({
  fetchData,
  getCachedData,
  cacheKey,
  ...rest
}: OfflineTableProps<T>) => {
  const { isOnline } = useConnectionStatus();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isOnline) {
          // If online, fetch from network
          const networkData = await fetchData();
          setData(networkData);
        } else {
          // If offline, load from cache
          const cachedData = await getCachedData();
          setData(cachedData);
          if (cachedData.length === 0) {
            // If cache is empty, show a specific message
            setError("You are offline and no cached data is available.");
          }
        }
      } catch (e) {
        // If fetch fails, try to fall back to cache
        console.error("Failed to fetch data, falling back to cache:", e);
        try {
          const cachedData = await getCachedData();
          setData(cachedData);
          setError("Network request failed. Displaying cached data.");
        } catch (cacheError) {
          console.error("Failed to load data from cache:", cacheError);
          setError("Failed to fetch data and no cached data is available.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOnline, fetchData, getCachedData, cacheKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  const tableContent = () => {
    if (data.length > 0) {
      return <Table<T> className="overflow-x-auto" dataSource={data} {...rest} />;
    }
    if (error && !isOnline) {
        return (
            <div className="p-8 text-center">
                <Empty
                    image={<svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636a9 9 0 1112.728 0M12 1v2.928m-4.072 1.072l-2.072 2.072m0 5.856l2.072 2.072M12 21v-2.928m4.072-1.072l2.072-2.072m0-5.856l-2.072-2.072M12 12a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>}
                    description={
                    <span>
                        <strong>No Connection</strong>
                        <p>No cached data available. Please connect to the internet to view this information.</p>
                    </span>
                    }
                />
            </div>
        )
    }
    return <Empty description="No data available." />;
  };

  return (
    <div>
      {error && isOnline && (
        <Alert
          message="Displaying Cached Data"
          description={error}
          type="warning"
          showIcon
          closable
          className="mb-4"
        />
      )}
      {tableContent()}
    </div>
  );
};

export default OfflineTable; 