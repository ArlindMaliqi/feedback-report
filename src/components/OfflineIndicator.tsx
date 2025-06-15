/**
 * Offline status indicator component
 * @module components/OfflineIndicator
 */
import React from 'react';
import { useFeedback } from '../hooks/useFeedback';

/**
 * Props for the OfflineIndicator component
 */
interface OfflineIndicatorProps {
  /** Position of the indicator */
  position?: 'top' | 'bottom';
  /** Whether to show sync button */
  showSyncButton?: boolean;
  /** Custom styling */
  style?: React.CSSProperties;
}

/**
 * Component that shows offline status and pending sync count
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = 'top',
  showSyncButton = true,
  style = {}
}) => {
  const { isOffline, pendingCount, syncPendingFeedback } = useFeedback();

  if (!isOffline && pendingCount === 0) {
    return null;
  }

  const handleSync = async () => {
    try {
      await syncPendingFeedback();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 999997,
    backgroundColor: isOffline ? '#fbbf24' : '#3b82f6',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    ...(position === 'top' ? { top: '20px' } : { bottom: '20px' }),
    ...style
  };

  return (
    <div style={baseStyle}>
      <span>
        {isOffline ? '📡' : '📤'} 
        {isOffline ? ` Offline` : ''} 
        {pendingCount > 0 && ` ${pendingCount} pending`}
      </span>
      
      {showSyncButton && pendingCount > 0 && !isOffline && (
        <button
          onClick={handleSync}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Sync Now
        </button>
      )}
    </div>
  );
};

export default OfflineIndicator;
