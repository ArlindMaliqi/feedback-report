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
  if (isSonnerAvailable()) {
    try {
      // Dynamically import Sonner to avoid bundling issues
      const sonner = require('sonner');
      sonner.toast.error(message, {
        duration: 4000,
        position: 'top-right'
      });
    } catch (e) {
      // Fall back to console if dynamic import fails
      console.error('Error notification:', message);
    }
  } else {
    // Fall back to console if Sonner is not available
    console.error('Error notification:', message);
  }
};

/**
 * Shows a success notification
 * @param message - Success message to display
 */
export const showSuccess = (message: string): void => {
  if (isSonnerAvailable()) {
    try {
      const sonner = require('sonner');
      sonner.toast.success(message, {
        duration: 3000,
        position: 'top-right'
      });
    } catch (e) {
      console.log('Success notification:', message);
    }
  } else {
    console.log('Success notification:', message);
  }
};

/**
 * Shows an info notification
 * @param message - Informational message to display
 */
export const showInfo = (message: string): void => {
  if (isSonnerAvailable()) {
    try {
      const sonner = require('sonner');
      sonner.toast(message, {
        duration: 3000,
        position: 'top-right'
      });
    } catch (e) {
      console.log('Info notification:', message);
    }
  } else {
    console.log('Info notification:', message);
  }
};
