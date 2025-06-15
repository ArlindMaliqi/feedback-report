/**
 * Offline indicator component
 * @module components/OfflineIndicator
 */
import React, { useState, useEffect } from 'react';
import { useFeedback } from '../hooks/useFeedback';

interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  showSyncButton?: boolean;
}

/**
 * Component that displays an offline status indicator and sync button
 * 
 * Shows when the app is offline and allows users to manually trigger
 * synchronization of pending feedback when back online.
 * 
 * @param props - Component props
 * @param props.position - Position of the indicator, either 'top' or 'bottom'
 * @param props.showSyncButton - Whether to show the sync button
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = 'top',
  showSyncButton = true
}) => {
  const { isOffline, syncOfflineFeedback } = useFeedback();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!syncOfflineFeedback) return;
    
    setIsSyncing(true);
    try {
      await syncOfflineFeedback();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOffline) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        [position]: '10px',
        backgroundColor: '#f59e0b',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.875rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <span>📡</span>
      <span>You're offline</span>
      {showSyncButton && (
        <button
          onClick={handleSync}
          disabled={isSyncing}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            cursor: isSyncing ? 'not-allowed' : 'pointer'
          }}
        >
          {isSyncing ? 'Syncing...' : 'Sync'}
        </button>
      )}
    </div>
  );
};

export default OfflineIndicator;
