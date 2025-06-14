import React from 'react';
import { useFeedback } from '../hooks/useFeedback';
import { useTheme } from '../hooks/useTheme';

/**
 * Props for the OfflineIndicator component
 */
interface OfflineIndicatorProps {
  /** Position of the indicator on screen */
  position?: "top" | "bottom";
}

/**
 * Component that displays an offline status indicator and sync button
 * 
 * Shows when the app is offline and allows users to manually trigger
 * synchronization of pending feedback when back online.
 * 
 * @param props - Component props
 * @param props.position - Where to position the indicator
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = "top"
}) => {
  const { isOffline, syncOfflineFeedback } = useFeedback();
  const { theme } = useTheme();

  // Don't render anything if online
  if (!isOffline) {
    return null;
  }

  // Base styles with theme support
  const styles = {
    container: {
      position: 'fixed' as const,
      left: '0',
      right: '0',
      [position]: '0',
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
      borderBottom: position === 'top' ? `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}` : 'none',
      borderTop: position === 'bottom' ? `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}` : 'none',
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
      <span>You are currently offline. Feedback will be saved locally.</span>
      <button 
        style={styles.syncButton}
        onClick={syncOfflineFeedback}
        disabled={isOffline}
        aria-label="Sync feedback when online"
      >
        Sync When Online
      </button>
    </div>
  );
};

export default OfflineIndicator;
