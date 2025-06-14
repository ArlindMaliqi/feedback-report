/**
 * Utility functions for displaying notifications to users
 * with support for Sonner toast library if available
 * 
 * @module notifications
 */

/**
 * Checks if Sonner is available in the project
 * @returns Boolean indicating if Sonner is available
 */
export const isSonnerAvailable = (): boolean => {
  try {
    // Check if Sonner is available in the global scope
    return typeof window !== 'undefined' && 
           typeof require !== 'undefined' && 
           Boolean(require.resolve('sonner'));
  } catch (e) {
    return false;
  }
};

// Optional import for sonner
let toast: any = null;
try {
  const sonner = require('sonner');
  toast = sonner.toast;
} catch {
  // Fallback to console or custom notification
  toast = {
    success: (message: string) => console.log(`✅ ${message}`),
    error: (message: string) => console.error(`❌ ${message}`),
    info: (message: string) => console.info(`ℹ️ ${message}`),
    warning: (message: string) => console.warn(`⚠️ ${message}`)
  };
}

/**
 * Shows an error notification
 * @param message - Error message to display
 */
export const showError = (message: string): void => {
  // Simple implementation - can be enhanced with toast libraries
  console.error('Feedback Error:', message);
  
  // In a real implementation, you might use a toast library
  if (typeof window !== 'undefined') {
    // Fallback to alert for now
    window.alert(`Error: ${message}`);
  }
};

/**
 * Shows a success notification
 * @param message - Success message to display
 */
export const showSuccess = (message: string): void => {
  console.log('Feedback Success:', message);
  
  if (typeof window !== 'undefined') {
    // You can enhance this with a proper toast notification
    console.log(`Success: ${message}`);
  }
};

/**
 * Shows an info notification
 * @param message - Informational message to display
 */
export const showInfo = (message: string): void => {
  console.info('Feedback Info:', message);
  
  if (typeof window !== 'undefined') {
    console.log(`Info: ${message}`);
  }
};

/**
 * Shows a notification of any type
 * @param type - Type of the notification (success, error, info, warning)
 * @param message - Message to display
 */
export const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
  if (toast && typeof toast[type] === 'function') {
    toast[type](message);
  } else {
    // Fallback notification
    console.log(`${type.toUpperCase()}: ${message}`);
  }
};
