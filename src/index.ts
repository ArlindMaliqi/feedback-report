/**
 * @fileoverview React Feedback Report Widget - Main entry point
 * @module react-feedback-report-widget
 * @version 2.0.0
 * @author ArlindMaliqi
 * @license MIT
 * @since 1.0.0
 */

// Core components
export { FeedbackProvider } from './contexts/FeedbackContext';
export { ThemeProvider } from './contexts/ThemeContext';

// Main components
export { FeedbackButton } from './components/FeedbackButton';
export { FeedbackModal } from './components/FeedbackModal';
export { OptimizedFeedbackWidget } from './components/OptimizedFeedbackWidget';

// Hooks
export { useFeedback } from './hooks/useFeedback';
export { useTheme } from './hooks/useTheme';
export { useFeedbackAnalytics } from './hooks/useFeedbackAnalytics';
export { useFeedbackHistory } from './hooks/useFeedbackHistory';
export { useShakeDetection } from './hooks/useShakeDetection';
export { useLocalization } from './hooks/useLocalization';

// Utilities
export * from './utils';
export * from './utils/validation';
export * from './utils/categories';
export * from './utils/templates';

// Types
export type * from './types';

// Integration utilities (tree-shakeable)
export { processIntegrations, processVoteIntegrations } from './utils/integrations';

// Default export for convenience
export { OptimizedFeedbackWidget as default } from './components/OptimizedFeedbackWidget';
