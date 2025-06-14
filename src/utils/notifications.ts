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
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

/**
 * Configuration options for notifications
 * @interface NotificationOptions
 */
export interface NotificationOptions {
  /** Duration in milliseconds before auto-dismiss */
  duration?: number;
  /** Whether the notification can be dismissed by user */
  dismissible?: boolean;
  /** Position of the notification */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Custom CSS classes */
  className?: string;
}

/**
 * Toast provider interface for abstraction
 * @interface ToastProvider
 */
interface ToastProvider {
  success: (message: string, options?: NotificationOptions) => void;
  error: (message: string, options?: NotificationOptions) => void;
  info: (message: string, options?: NotificationOptions) => void;
  warning: (message: string, options?: NotificationOptions) => void;
}

/**
 * Lazy-loaded toast provider with fallback
 * @private
 */
let toastProvider: ToastProvider | null = null;

/**
 * Gets the toast provider instance (lazy-loaded for tree-shaking)
 * @returns {ToastProvider} Toast provider instance
 * @private
 */
const getToastProvider = (): ToastProvider => {
  if (toastProvider) return toastProvider;

  // Try to load Sonner dynamically
  try {
    const sonner = require('sonner');
    toastProvider = {
      success: (message: string, options?: NotificationOptions) => 
        sonner.toast.success(message, options),
      error: (message: string, options?: NotificationOptions) => 
        sonner.toast.error(message, options),
      info: (message: string, options?: NotificationOptions) => 
        sonner.toast.info(message, options),
      warning: (message: string, options?: NotificationOptions) => 
        sonner.toast.warning(message, options)
    };
  } catch {
    // Fallback to console/custom notification
    toastProvider = {
      success: (message: string) => console.log(`✅ ${message}`),
      error: (message: string) => console.error(`❌ ${message}`),
      info: (message: string) => console.info(`ℹ️ ${message}`),
      warning: (message: string) => console.warn(`⚠️ ${message}`)
    };
  }

  return toastProvider;
};

/**
 * Shows an error notification
 * @param {string} message - Error message to display
 * @param {NotificationOptions} [options] - Notification options
 * @since 1.0.0
 */
export const showError = (message: string, options?: NotificationOptions): void => {
  const provider = getToastProvider();
  provider.error(message, options);
};

/**
 * Shows a success notification
 * @param {string} message - Success message to display
 * @param {NotificationOptions} [options] - Notification options
 * @since 1.0.0
 */
export const showSuccess = (message: string, options?: NotificationOptions): void => {
  const provider = getToastProvider();
  provider.success(message, options);
};

/**
 * Shows an info notification
 * @param {string} message - Informational message to display
 * @param {NotificationOptions} [options] - Notification options
 * @since 1.0.0
 */
export const showInfo = (message: string, options?: NotificationOptions): void => {
  const provider = getToastProvider();
  provider.info(message, options);
};

/**
 * Shows a warning notification
 * @param {string} message - Warning message to display
 * @param {NotificationOptions} [options] - Notification options
 * @since 1.0.0
 */
export const showWarning = (message: string, options?: NotificationOptions): void => {
  const provider = getToastProvider();
  provider.warning(message, options);
};

/**
 * Shows a notification of any type
 * @param {NotificationType} type - Type of the notification
 * @param {string} message - Message to display
 * @param {NotificationOptions} [options] - Notification options
 * @since 1.0.0
 */
export const showNotification = (
  type: NotificationType, 
  message: string, 
  options?: NotificationOptions
): void => {
  const provider = getToastProvider();
  
  switch (type) {
    case NotificationType.SUCCESS:
      provider.success(message, options);
      break;
    case NotificationType.ERROR:
      provider.error(message, options);
      break;
    case NotificationType.INFO:
      provider.info(message, options);
      break;
    case NotificationType.WARNING:
      provider.warning(message, options);
      break;
    default:
      provider.info(message, options);
  }
};
