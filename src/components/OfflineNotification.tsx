'use client';

import { useEffect, useRef } from 'react';
import { App } from 'antd';
import { WifiOutlined, DisconnectOutlined } from '@ant-design/icons';

export default function OfflineNotification() {
  const { notification } = App.useApp();
  const notificationKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      // Close the offline notification if it exists
      if (notificationKeyRef.current) {
        notification.destroy(notificationKeyRef.current);
        notificationKeyRef.current = null;
      }
      
      // Show a brief "back online" notification
      notification.success({
        message: 'Connection Restored',
        description: 'You are back online!',
        icon: <WifiOutlined style={{ color: '#52c41a' }} />,
        duration: 3,
      });
    };

    const handleOffline = () => {
      // Generate a unique key for this notification
      const key = `offline-${Date.now()}`;
      notificationKeyRef.current = key;
      
      // Show persistent offline notification
      notification.warning({
        key,
        message: 'No Internet Connection',
        description: 'You are currently offline. Some features may not work properly.',
        icon: <DisconnectOutlined style={{ color: '#faad14' }} />,
        duration: 0, // Persistent - won't auto close
        btn: (
          <button
            onClick={() => {
              notification.destroy(key);
              notificationKeyRef.current = null;
            }}
            className="ant-btn ant-btn-sm ant-btn-text"
          >
            Dismiss
          </button>
        ),
      });
    };

    // Check initial status
    if (!navigator.onLine) {
      handleOffline();
    }

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Clean up any remaining notification
      if (notificationKeyRef.current) {
        notification.destroy(notificationKeyRef.current);
      }
    };
  }, [notification]);

  // This component doesn't render anything visible
  return null;
} 