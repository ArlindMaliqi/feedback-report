/**
 * @fileoverview React Feedback Report Widget - Main entry point
 * @module react-feedback-report-widget
 * @version 2.0.0
 * @author ArlindMaliqi
 * @license MIT
 * @since 1.0.0
 */

// Core components
export { FeedbackProvider, useFeedback } from './components/FeedbackProvider';
export { FeedbackButton } from './components/FeedbackButton';
export { OptimizedFeedbackWidget } from './components/OptimizedFeedbackWidget';

// Types - export from centralized types module
export type { 
  FeedbackConfig, 
  FeedbackContextType,
  OptimizedFeedbackWidgetProps,
  FeedbackButtonProps,
  Feedback,
  FeedbackCategory,
  FeedbackAttachment,
  ThemePreference,
  FeedbackModalStyles,
  AnimationConfig,
  FeedbackTemplate,
  LocalizationConfig,
  AnalyticsConfig,
  IssueTrackerConfig,
  AnyIssueTrackerConfig,
  WebhookConfig,
  NotificationConfig,
  UserIdentity,
  FeedbackProviderProps,
  ThemeContextType,
  TemplateConfig,
  TemplateField,
  SupportedLocale
} from './types';

// Default export
export { OptimizedFeedbackWidget as default } from './components/OptimizedFeedbackWidget';
