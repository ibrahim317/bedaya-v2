'use client';

import { useSyncStatus } from '@/providers/OfflineProvider';
import { SyncOutlined, UploadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip, Badge } from 'antd';
import { SyncStatus } from '@/types/OfflineState';

export default function SyncProgress() {
  const { syncStatus, pendingOperations, forceSync } = useSyncStatus();

  const getIcon = () => {
    switch (syncStatus) {
      case SyncStatus.SYNCING:
        return <SyncOutlined spin />;
      case SyncStatus.SUCCESS:
        return <CheckCircleOutlined className="text-green-500" />;
      case SyncStatus.ERROR:
        return <ExclamationCircleOutlined className="text-red-500" />;
      case SyncStatus.IDLE:
      default:
        return <UploadOutlined />;
    }
  };

  const getTooltipTitle = () => {
    if (pendingOperations === 0 && syncStatus !== SyncStatus.SYNCING) {
      return 'All changes are synced.';
    }
    switch (syncStatus) {
      case SyncStatus.SYNCING:
        return `Syncing ${pendingOperations} changes...`;
      case SyncStatus.ERROR:
        return `${pendingOperations} changes pending. Last sync failed.`;
      case SyncStatus.IDLE:
      case SyncStatus.SUCCESS:
      default:
        return `${pendingOperations} changes pending sync.`;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Tooltip title={getTooltipTitle()}>
        <Badge count={pendingOperations}>
          <Button
            type="primary"
            shape="circle"
            icon={getIcon()}
            size="large"
            onClick={forceSync}
            loading={syncStatus === SyncStatus.SYNCING}
            disabled={pendingOperations === 0 && syncStatus !== SyncStatus.SYNCING}
          />
        </Badge>
      </Tooltip>
    </div>
  );
} 