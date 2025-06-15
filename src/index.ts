/**
 * @fileoverview React Feedback Report Widget - Main entry point
 * @module react-feedback-report-widget
 * @version 2.1.3
 * @author ArlindMaliqi
 * @license MIT
 * @since 1.0.0
 */

// Main entry point for the feedback widget package
export { FeedbackProvider, useFeedback } from './components/FeedbackProvider';
export { FeedbackButton } from './components/FeedbackButton';
export { FeedbackModal } from './components/FeedbackModal';
export { OptimizedFeedbackWidget } from './components/OptimizedFeedbackWidget';

// Export all types - only export what actually exists in types
export type {
  Feedback,
  FeedbackConfig,
  AnalyticsConfig,
  WebhookConfig,
  NotificationConfig,
  IssueTrackerConfig,
  LocalizationConfig,
  AnimationConfig,
  TemplateConfig
} from './types';

// Export utility functions
export {
  processIntegrations,
  processVoteIntegrations
} from './utils/integrations';

export {
  trackFeedbackEvent,
  trackFeedbackSubmission,
  trackFeedbackVote,
  trackModalOpened
} from './utils/integrations/analytics';

export {
  showError,
  showSuccess,
  showInfo,
  showWarning,
  showNotification,
  NotificationType
} from './utils/notifications';

// Export templates
export {
  DEFAULT_TEMPLATE,
  BUG_REPORT_TEMPLATE,
  FEATURE_REQUEST_TEMPLATE,
  GENERAL_FEEDBACK_TEMPLATE,
  getTemplateById,
  getAllTemplates
} from './utils/templates';

// Export error handling
export {
  ErrorTracker,
  FeedbackErrorBoundary
} from './utils/errorTracking';

// Export animation utilities
export {
  getAnimationStyles,
  generateKeyframes,
  DEFAULT_ANIMATION
} from './utils/animations';

// Version
export const VERSION = '2.1.3';
