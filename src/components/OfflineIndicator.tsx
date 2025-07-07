'use client';

import React from 'react';
import { Badge, Tooltip, Button } from 'antd';
import { 
  WifiOutlined, 
  DisconnectOutlined, 
  SyncOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useOffline, useConnectionStatus, useSyncStatus } from '@/providers/OfflineProvider';
import { ConnectionQuality, SyncStatus } from '@/types/OfflineState';

interface OfflineIndicatorProps {
  showDetails?: boolean;
  size?: 'small' | 'default' | 'large';
  style?: React.CSSProperties;
}

export default function OfflineIndicator({ 
  showDetails = false, 
  size = 'default',
  style = {}
}: OfflineIndicatorProps) {
  const { refreshConnection } = useOffline();
  const { isOnline, connectionQuality, lastOnlineAt } = useConnectionStatus();
  const { syncStatus, pendingOperations, forceSync } = useSyncStatus();

  // Get connection status info
  const getConnectionInfo = () => {
    if (!isOnline) {
      return {
        icon: <DisconnectOutlined />,
        color: '#ff4d4f',
        status: 'error' as const,
        text: 'Offline',
        description: lastOnlineAt 
          ? `Last online: ${formatTimeAgo(lastOnlineAt)}`
          : 'No connection'
      };
    }

    switch (connectionQuality) {
      case ConnectionQuality.EXCELLENT:
        return {
          icon: <WifiOutlined />,
          color: '#52c41a',
          status: 'success' as const,
          text: 'Excellent',
          description: 'Fast, stable connection'
        };
      case ConnectionQuality.GOOD:
        return {
          icon: <WifiOutlined />,
          color: '#1890ff',
          status: 'processing' as const,
          text: 'Good',
          description: 'Stable connection'
        };
      case ConnectionQuality.POOR:
        return {
          icon: <WifiOutlined />,
          color: '#faad14',
          status: 'warning' as const,
          text: 'Poor',
          description: 'Slow connection'
        };
      default:
        return {
          icon: <DisconnectOutlined />,
          color: '#ff4d4f',
          status: 'error' as const,
          text: 'Offline',
          description: 'No connection'
        };
    }
  };

  // Get sync status info
  const getSyncInfo = () => {
    switch (syncStatus) {
      case SyncStatus.SYNCING:
        return {
          icon: <LoadingOutlined spin />,
          color: '#1890ff',
          text: 'Syncing...',
          description: 'Synchronizing data'
        };
      case SyncStatus.SUCCESS:
        return {
          icon: <CheckCircleOutlined />,
          color: '#52c41a',
          text: 'Synced',
          description: 'All data synchronized'
        };
      case SyncStatus.ERROR:
        return {
          icon: <ExclamationCircleOutlined />,
          color: '#ff4d4f',
          text: 'Sync Error',
          description: 'Failed to sync some data'
        };
      case SyncStatus.PAUSED:
        return {
          icon: <ExclamationCircleOutlined />,
          color: '#faad14',
          text: 'Paused',
          description: 'Sync paused'
        };
      default:
        return {
          icon: <SyncOutlined />,
          color: '#8c8c8c',
          text: 'Ready',
          description: 'Ready to sync'
        };
    }
  };

  const connectionInfo = getConnectionInfo();
  const syncInfo = getSyncInfo();

  const handleRefresh = async () => {
    try {
      await refreshConnection();
    } catch (error) {
      console.error('Failed to refresh connection:', error);
    }
  };

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (error) {
      console.error('Failed to force sync:', error);
    }
  };

  if (showDetails) {
    return (
      <div style={style} className="flex items-center space-x-2">
        {/* Connection Status */}
        <Tooltip title={connectionInfo.description}>
          <Badge 
            status={connectionInfo.status} 
            text={
              <span style={{ color: connectionInfo.color, fontSize: size === 'small' ? '12px' : '14px' }}>
                {connectionInfo.icon} {connectionInfo.text}
              </span>
            }
          />
        </Tooltip>

        {/* Sync Status */}
        {isOnline && (
          <Tooltip title={syncInfo.description}>
            <Badge 
              status={syncStatus === SyncStatus.SUCCESS ? 'success' : 'processing'}
              text={
                <span style={{ color: syncInfo.color, fontSize: size === 'small' ? '12px' : '14px' }}>
                  {syncInfo.icon} {syncInfo.text}
                </span>
              }
            />
          </Tooltip>
        )}

        {/* Pending Operations */}
        {pendingOperations > 0 && (
          <Tooltip title={`${pendingOperations} operations pending`}>
            <Badge count={pendingOperations} size="small">
              <SyncOutlined style={{ color: '#faad14' }} />
            </Badge>
          </Tooltip>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-1">
          <Tooltip title="Refresh connection">
            <Button 
              type="text" 
              size="small" 
              icon={<WifiOutlined />} 
              onClick={handleRefresh}
            />
          </Tooltip>
          
          {isOnline && pendingOperations > 0 && (
            <Tooltip title="Force sync">
              <Button 
                type="text" 
                size="small" 
                icon={<SyncOutlined />} 
                onClick={handleForceSync}
              />
            </Tooltip>
          )}
        </div>
      </div>
    );
  }

  // Simple indicator
  return (
    <Tooltip 
      title={
        <div>
          <div>{connectionInfo.description}</div>
          {isOnline && pendingOperations > 0 && (
            <div>{pendingOperations} operations pending</div>
          )}
        </div>
      }
    >
      <div style={style} className="flex items-center">
        <Badge 
          status={connectionInfo.status}
          dot={size === 'small'}
        >
          {size !== 'small' && (
            <span style={{ 
              color: connectionInfo.color, 
              fontSize: size === 'large' ? '16px' : '14px' 
            }}>
              {connectionInfo.icon}
            </span>
          )}
        </Badge>
        
        {pendingOperations > 0 && (
          <Badge 
            count={pendingOperations} 
            size="small" 
            style={{ marginLeft: '8px' }}
          />
        )}
      </div>
    </Tooltip>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
} 