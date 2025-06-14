/**
 * @fileoverview Feedback Report - A comprehensive React feedback widget system
 *
 * This package provides a complete feedback collection system for React applications,
 * featuring shake detection, customizable UI components, and TypeScript support.
 *
 * @author ArlindMaliqi
 * @version 1.5.0
 * @license MIT
 */

// Core component exports
export { FeedbackProvider } from "./components/FeedbackProvider";
export { FeedbackButton } from "./components/FeedbackButton";
export { FeedbackModal } from "./components/FeedbackModal";

// Context exports (create placeholder if missing)
export { useFeedback } from "./hooks/useFeedback";
export { useLocalization } from "./hooks/useLocalization";
export { ThemeProvider } from "./contexts/ThemeContext";

// Hook exports
export { useFeedbackHistory } from "./hooks/useFeedbackHistory";
export { useFeedbackAnalytics } from "./hooks/useFeedbackAnalytics";

// Type exports
export type {
  Feedback,
  FeedbackConfig,
  FeedbackContextType,
  FeedbackCategory,
  FeedbackAttachment,
  LocalizationConfig,
  ThemePreference,
  AnimationConfig,
  FeedbackTemplate,
  FeedbackModalStyles,
  IssueTrackerConfig,
  AnyIssueTrackerConfig,
  AnalyticsConfig,
  WebhookConfig,
  NotificationConfig,
  IssueCreationResponse
} from "./types";

// Utility exports
export { 
  generateId, 
  validateFeedback, 
  handleApiResponse
} from "./utils";

// Tree-shakeable exports (conditionally included based on usage)
export { FEATURE_FLAGS, isFeatureEnabled, FeatureLoader, IntegrationLoaders } from "./utils/bundleOptimization";

// Performance-optimized components (tree-shakeable)
export { OptimizedFeedbackWidget } from "./components/OptimizedFeedbackWidget";
export { OptimizedFeedbackProvider } from "./components/OptimizedFeedbackProvider";
export { SSRSafeComponent } from "./core/SSRSafeComponent";

// Performance utilities (tree-shakeable)
export { 
  PerformanceMonitor, 
  usePerformanceMonitor, 
  withPerformanceMonitoring 
} from "./utils/performance";

// Bundle optimization utilities (tree-shakeable)
export { 
  conditionalImport,
  getBundleSizeEstimates, 
  detectRuntimeCapabilities
} from "./utils/bundleOptimization";

// Lazy components for advanced use cases (tree-shakeable)
export * from "./core/lazyComponents";

// Default optimized widget for most use cases
export { OptimizedFeedbackWidget as default } from "./components/OptimizedFeedbackWidget";

// Legacy export for backward compatibility
export { OptimizedFeedbackWidget as FeedbackWidget } from "./components/OptimizedFeedbackWidget";
