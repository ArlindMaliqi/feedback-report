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
