/**
 * Main entry point for the React Feedback Report Widget
 * @module index
 */

// Core components
export { FeedbackProvider } from './contexts/FeedbackContext';
export { FeedbackButton } from './components/FeedbackButton';
export { FeedbackModal } from './components/FeedbackModal';
export { MinimalFeedbackWidget } from './components/MinimalFeedbackWidget';
export { OptimizedFeedbackWidget } from './components/OptimizedFeedbackWidget';

// Hooks
export { useFeedback } from './hooks/useFeedback';
export { useTheme } from './hooks/useTheme';
export { useFeedbackHistory } from './hooks/useFeedbackHistory';
export { useFeedbackAnalytics } from './hooks/useFeedbackAnalytics';

// Types (single export)
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
  MinimalFeedbackWidgetProps,
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
  TemplateField
} from './types';

// Import the type for use in defaultConfig
import type { FeedbackConfig } from './types';

// Default configuration - now properly typed with import
export const defaultConfig: Partial<FeedbackConfig> = {
  theme: 'system',
  enableShakeDetection: true,
  enableOfflineSupport: false,
  enableVoting: false,
  collectUserIdentity: false,
  enableFileAttachments: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

// Main widget component (alias for backward compatibility)
export { MinimalFeedbackWidget as FeedbackWidget } from './components/MinimalFeedbackWidget';

// Utilities
export { Analytics } from './integrations';
export * from './utils/notifications';
