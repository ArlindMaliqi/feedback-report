/**
 * @fileoverview React Feedback Report Widget - Main entry point
 * @module react-feedback-report-widget
 * @version 2.0.0
 * @author ArlindMaliqi
 * @license MIT
 * @since 1.0.0
 */

// Core components
export { FeedbackProvider } from './components/FeedbackProvider';
export { FeedbackButton } from './components/FeedbackButton';
export { FeedbackModal } from './components/FeedbackModal';
export { OptimizedFeedbackWidget } from './components/OptimizedFeedbackWidget';

// Hooks
export { useFeedback } from './hooks/useFeedback';
export { useLocalization } from './hooks/useLocalization';
export { useFeedbackHistory } from './hooks/useFeedbackHistory';
export { useFeedbackAnalytics } from './hooks/useFeedbackAnalytics';

// Types
export type {
  Feedback,
  FeedbackConfig,
  FeedbackTheme,
  FeedbackTemplate,
  FeedbackCategory,
  FeedbackSubcategory,
  UserIdentity,
  FeedbackAttachment,
  FeedbackButtonProps,
  OptimizedFeedbackWidgetProps,
  FeedbackProviderProps,
  AnalyticsConfig,
  IssueTrackerConfig,
  WebhookConfig,
  NotificationConfig,
  LocalizationConfig,
  ThemePreference,
  AnyIssueTrackerConfig,
  FeedbackContextValue,
  ThemeContextType,
  TemplateField,
  SupportedLocale
} from './types';

// Utilities
export { 
  showSuccess, 
  showError, 
  showInfo, 
  showWarning,
  NotificationType
} from './utils/notifications';

// Export missing components
export { OptimizedFeedbackWidget as MinimalFeedbackWidget } from "./components/OptimizedFeedbackWidget";

// Utility exports
export { 
  generateId, 
  validateFeedback, 
  handleApiResponse,
  formatTimestamp
} from "./utils";

// Default configuration
import type { FeedbackConfig } from './types';

export const defaultConfig: Partial<FeedbackConfig> = {
  theme: 'system',
  enableShakeDetection: true,
  enableOfflineSupport: false,
  enableVoting: false,
  collectUserIdentity: false,
  enableFileAttachments: true,
  maxFileSize: 5 * 1024 * 1024,
};

// Main widget component (alias for backward compatibility)
export { OptimizedFeedbackWidget as FeedbackWidget } from './components/OptimizedFeedbackWidget';

// Default export
export { OptimizedFeedbackWidget as default } from './components/OptimizedFeedbackWidget';

// Package metadata
export const VERSION = '2.0.0';
