/**
 * Main entry point for the feedback widget package
 * @module react-feedback-report-widget
 */

// Core components (tree-shakeable)
export { FeedbackProvider } from './components/FeedbackProvider';
export { FeedbackWidget } from './components/FeedbackWidget';
export { useFeedback } from './hooks/useFeedback';
export { FeedbackButton } from './components/FeedbackButton';
export { FeedbackModal } from './components/FeedbackModal';
export { OptimizedFeedbackWidget } from './components/OptimizedFeedbackWidget';
export { MinimalFeedbackWidget } from './components/MinimalFeedbackWidget';

// Contexts
export { ThemeProvider } from './contexts/ThemeContext';

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
  NotificationConfig,
  FeedbackWidgetProps,
  FeedbackButtonProps,
  FeedbackModalProps,
  OptimizedFeedbackWidgetProps
} from './types';

// Essential utilities (lazy-loaded)
export { showError, showSuccess, showInfo, showWarning } from './utils/notifications';

// Localization utilities
export { createTranslator, getDirection } from './utils/localization';

// Version
export const VERSION = '2.1.6';
