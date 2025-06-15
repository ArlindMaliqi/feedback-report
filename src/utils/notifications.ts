/**
 * @fileoverview Utility functions for displaying notifications to users
 * with support for Sonner toast library if available
 * 
 * @module notifications
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.0.0
 */

/**
 * Notification types supported by the system
 * @enum {string}
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * Show success notification
 */
export const showSuccess = (message: string): void => {
  console.log('✅ Success:', message);
  // Can be extended to use toast libraries like react-hot-toast, sonner, etc.
};

/**
 * Show error notification
 */
export const showError = (message: string): void => {
  console.error('❌ Error:', message);
  // Can be extended to use toast libraries
};

/**
 * Show info notification
 */
export const showInfo = (message: string): void => {
  console.info('ℹ️ Info:', message);
  // Can be extended to use toast libraries
};

/**
 * Show warning notification
 */
export const showWarning = (message: string): void => {
  console.warn('⚠️ Warning:', message);
  // Can be extended to use toast libraries
};

/**
 * Generic notification function
 */
export const showNotification = (type: NotificationType, message: string): void => {
  switch (type) {
    case 'success':
      showSuccess(message);
      break;
    case 'error':
      showError(message);
      break;
    case 'info':
      showInfo(message);
      break;
    case 'warning':
      showWarning(message);
      break;
  }
};
