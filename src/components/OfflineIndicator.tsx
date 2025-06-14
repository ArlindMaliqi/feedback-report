/**
 * Offline indicator component
 * @module components/OfflineIndicator
 */
import React, { useState, useEffect } from 'react';
import { useFeedback } from '../hooks/useFeedback';
import { useTheme } from '../hooks/useTheme';

export interface OfflineIndicatorProps {
  showWhenOnline?: boolean;
}

/**
 * Component that displays an offline status indicator and sync button
 * 
 * Shows when the app is offline and allows users to manually trigger
 * synchronization of pending feedback when back online.
 * 
 * @param props - Component props
 * @param props.showWhenOnline - Whether to show the indicator when online
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  showWhenOnline = false
}) => {
  const { isOffline, syncOfflineFeedback } = useFeedback();
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render anything if online and not explicitly told to show when online
  if (isOnline && !showWhenOnline) {
    return null;
  }

  // Base styles with theme support
  const styles = {
    container: {
      position: 'fixed' as const,
      left: '0',
      right: '0',
      top: '0',
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
      borderBottom: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
      padding: '0.5rem 1rem',
      zIndex: 998,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '0.875rem',
      color: theme === 'dark' ? '#e5e7eb' : '#4b5563',
    },
    icon: {
      marginRight: '0.5rem',
    },
    syncButton: {
      marginLeft: '0.5rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      backgroundColor: theme === 'dark' ? '#4b5563' : '#e2e8f0',
      color: theme === 'dark' ? '#e5e7eb' : '#1a202c',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.75rem',
    }
  };

  return (
    <div style={styles.container} role="status">
      <span style={styles.icon} aria-hidden="true">⚠️</span>
      <span>{isOnline ? 'You are online.' : 'You are currently offline. Feedback will be saved locally.'}</span>
      {!isOnline && 
        <button 
          style={styles.syncButton}
          onClick={syncOfflineFeedback}
          disabled={isOffline}
          aria-label="Sync feedback when online"
        >
          Sync When Online
        </button>
      }
    </div>
  );
};

export default OfflineIndicator;
