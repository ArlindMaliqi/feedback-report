/**
 * React Feedback Widget - Complete Feature Set
 * @version 2.2.0
 */

// Core Components - Simple API
export { FeedbackProvider } from './components/FeedbackProvider';
export { FeedbackButton } from './components/FeedbackButton';
export { FeedbackModal } from './components/FeedbackModal';
export { FeedbackWidget } from './components/FeedbackWidget';

// Advanced Components - Full Feature Set
export { OptimizedFeedbackWidget } from './components/OptimizedFeedbackWidget';
export { OptimizedFeedbackProvider } from './components/OptimizedFeedbackProvider';
export { MinimalFeedbackWidget } from './components/MinimalFeedbackWidget';
export { LazyFeedbackModal } from './components/LazyFeedbackComponents';

// Hooks
export { useFeedback } from './hooks/useFeedback';
export { useTheme } from './hooks/useTheme';

// Contexts
export { FeedbackContext, ThemeContext, LocalizationContext } from './contexts/FeedbackContext';
export { ThemeProvider } from './contexts/ThemeContext';

// Types - Complete Set
export type {
  // Core types
  FeedbackConfig,
  Feedback,
  FeedbackType,
  FeedbackPriority,
  FeedbackStatus,
  ThemePreference,
  TemplateConfig,
  FeedbackContextValue,
  
  // Advanced types
  Category,
  Subcategory,
  FeedbackAttachment,
  UserIdentity,
  AnalyticsConfig,
  IssueTrackerConfig,
  NotificationConfig,
  WebhookConfig,
  LocalizationConfig,
  AnimationConfig,
  FeedbackModalStyles,
  
  // Component props
  FeedbackWidgetProps,
  FeedbackButtonProps,
  FeedbackModalProps,
  OptimizedFeedbackWidgetProps
} from './types';

// Templates
export {
  DEFAULT_TEMPLATE,
  BUG_REPORT_TEMPLATE,
  FEATURE_REQUEST_TEMPLATE,
  GENERAL_FEEDBACK_TEMPLATE,
  getTemplateById,
  getAllTemplates
} from './templates';

// Utilities
export { generateId, handleApiResponse, validateFeedback } from './utils';
export { showError, showSuccess, showInfo, showWarning } from './utils/notifications';
export { createTranslator, getDirection } from './utils/localization';

// Integrations
export { integrationManager, Analytics, IssueTracker } from './integrations';

// Default exports for different use cases
export { FeedbackWidget as default } from './components/FeedbackWidget';
export { OptimizedFeedbackWidget as Advanced } from './components/OptimizedFeedbackWidget';
export { MinimalFeedbackWidget as Minimal } from './components/MinimalFeedbackWidget';

export const VERSION = '2.2.0';
