/**
 * Main entry point for the feedback widget package
 * @module react-feedback-report-widget
 */

// Core components (tree-shakeable)
export { FeedbackProvider, useFeedback } from './components/FeedbackProvider';
export { FeedbackButton } from './components/FeedbackButton';
export { FeedbackModal } from './components/FeedbackModal';
export { OptimizedFeedbackWidget } from './components/OptimizedFeedbackWidget';

// Essential types only
export type {
  Feedback,
  FeedbackConfig,
  FeedbackType,
  FeedbackStatus,
  FeedbackPriority,
  FeedbackContextValue,
  ThemePreference,
  Category,
  Subcategory,
  TemplateConfig,
  AnimationConfig,
  User,
  UserIdentity,
  FeedbackAttachment,
  AnalyticsConfig,
  WebhookConfig,
  NotificationConfig
} from './types';

// Essential utilities (lazy-loaded)
export { showError, showSuccess, showInfo, showWarning } from './utils/notifications';

// Version
export const VERSION = '2.1.3';
