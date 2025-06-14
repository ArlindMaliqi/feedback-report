/**
 * @fileoverview React Feedback Report Widget - A comprehensive feedback collection system
 * 
 * This package provides a complete, enterprise-grade feedback collection system for React applications,
 * featuring shake detection, customizable UI components, powerful integrations, and full TypeScript support.
 * 
 * Key Features:
 * - 🎨 Multiple themes with automatic system preference detection
 * - ♿ WCAG 2.1 compliant accessibility
 * - 📱 Mobile-first responsive design
 * - 🚀 Tree-shakeable architecture for optimal bundle size
 * - 🔌 Extensive third-party integrations (GitHub, Jira, Slack, etc.)
 * - 🌍 Full internationalization support
 * - 📊 Built-in analytics and performance monitoring
 * - 🧪 Comprehensive testing utilities
 * 
 * @module react-feedback-report-widget
 * @version 2.0.0
 * @author ArlindMaliqi
 * @license MIT
 * @since 1.0.0
 * 
 * @example Basic Usage
 * ```tsx
 * import { FeedbackProvider, FeedbackButton } from 'react-feedback-report-widget';
 * 
 * function App() {
 *   return (
 *     <FeedbackProvider config={{ apiEndpoint: '/api/feedback' }}>
 *       <YourApp />
 *       <FeedbackButton />
 *     </FeedbackProvider>
 *   );
 * }
 * ```
 * 
 * @example Advanced Configuration
 * ```tsx
 * import { OptimizedFeedbackWidget } from 'react-feedback-report-widget';
 * 
 * const config = {
 *   apiEndpoint: '/api/feedback',
 *   enableShakeDetection: true,
 *   analytics: { provider: 'google-analytics', trackingId: 'GA_ID' },
 *   issueTracker: { provider: 'github', owner: 'user', repository: 'repo' }
 * };
 * 
 * function App() {
 *   return <OptimizedFeedbackWidget config={config} />;
 * }
 * ```
 */

// =============================================================================
// CORE COMPONENT EXPORTS (Tree-shakeable)
// =============================================================================

/**
 * Core feedback provider component
 * @since 1.0.0
 */
export { FeedbackProvider } from "./components/FeedbackProvider";

/**
 * Floating feedback button component
 * @since 1.0.0
 */
export { FeedbackButton } from "./components/FeedbackButton";

/**
 * Feedback modal dialog component
 * @since 1.0.0
 */
export { FeedbackModal } from "./components/FeedbackModal";

// =============================================================================
// OPTIMIZED COMPONENTS (Tree-shakeable)
// =============================================================================

/**
 * Performance-optimized feedback widget with lazy loading
 * @since 1.5.0
 */
export { OptimizedFeedbackWidget } from "./components/OptimizedFeedbackWidget";

/**
 * Performance-optimized provider with dynamic imports
 * @since 1.5.0
 */
export { OptimizedFeedbackProvider } from "./components/OptimizedFeedbackProvider";

/**
 * SSR-safe component wrapper
 * @since 1.5.0
 */
export { SSRSafeComponent } from "./core/SSRSafeComponent";

// =============================================================================
// CONTEXT AND HOOKS (Tree-shakeable)
// =============================================================================

/**
 * Main feedback hook for accessing feedback context
 * @since 1.0.0
 */
export { useFeedback } from "./hooks/useFeedback";

/**
 * Localization hook for i18n support
 * @since 1.2.0
 */
export { useLocalization } from "./hooks/useLocalization";

/**
 * Theme provider for dark/light mode support
 * @since 1.1.0
 */
export { ThemeProvider } from "./contexts/ThemeContext";

/**
 * Hook for accessing feedback history and management
 * @since 1.3.0
 */
export { useFeedbackHistory } from "./hooks/useFeedbackHistory";

/**
 * Hook for feedback analytics and insights
 * @since 1.4.0
 */
export { useFeedbackAnalytics } from "./hooks/useFeedbackAnalytics";

// =============================================================================
// TYPE EXPORTS (Zero runtime cost)
// =============================================================================

/**
 * Core feedback data structure
 * @since 1.0.0
 */
export type { Feedback } from "./types";

/**
 * Main configuration interface
 * @since 1.0.0
 */
export type { FeedbackConfig } from "./types";

/**
 * Feedback context type definition
 * @since 1.0.0
 */
export type { FeedbackContextType } from "./types";

/**
 * Feedback category structure
 * @since 1.0.0
 */
export type { FeedbackCategory } from "./types";

/**
 * File attachment interface
 * @since 1.1.0
 */
export type { FeedbackAttachment } from "./types";

/**
 * Localization configuration
 * @since 1.2.0
 */
export type { LocalizationConfig } from "./types";

/**
 * Theme preference options
 * @since 1.1.0
 */
export type { ThemePreference } from "./types";

/**
 * Animation configuration
 * @since 1.3.0
 */
export type { AnimationConfig } from "./types";

/**
 * Feedback template structure
 * @since 1.3.0
 */
export type { FeedbackTemplate } from "./types";

/**
 * Modal styling interface
 * @since 1.2.0
 */
export type { FeedbackModalStyles } from "./types";

/**
 * Issue tracker configuration
 * @since 1.4.0
 */
export type { IssueTrackerConfig, AnyIssueTrackerConfig } from "./types";

/**
 * Analytics provider configuration
 * @since 1.4.0
 */
export type { AnalyticsConfig } from "./types";

/**
 * Webhook configuration
 * @since 1.4.0
 */
export type { WebhookConfig } from "./types";

/**
 * Notification system configuration
 * @since 1.4.0
 */
export type { NotificationConfig } from "./types";

// =============================================================================
// UTILITY EXPORTS (Tree-shakeable)
// =============================================================================

/**
 * Core utility functions
 * @since 1.0.0
 */
export { 
  generateId, 
  validateFeedback, 
  handleApiResponse
} from "./utils";

/**
 * Notification utilities
 * @since 1.2.0
 */
export { 
  showSuccess, 
  showError, 
  showInfo, 
  showWarning,
  NotificationType
} from "./utils/notifications";

// =============================================================================
// ADVANCED FEATURES (Tree-shakeable)
// =============================================================================

/**
 * Bundle optimization utilities
 * @since 1.5.0
 */
export { 
  FEATURE_FLAGS, 
  isFeatureEnabled, 
  FeatureLoader, 
  IntegrationLoaders 
} from "./utils/bundleOptimization";

/**
 * Performance monitoring utilities
 * @since 1.5.0
 */
export { 
  PerformanceMonitor, 
  usePerformanceMonitor, 
  withPerformanceMonitoring 
} from "./utils/performance";

/**
 * Dynamic import utilities
 * @since 1.5.0
 */
export { 
  conditionalImport,
  getBundleSizeEstimates, 
  detectRuntimeCapabilities
} from "./utils/bundleOptimization";

// =============================================================================
// LAZY COMPONENTS (Tree-shakeable)
// =============================================================================

/**
 * Lazy-loaded components for advanced use cases
 * @since 1.5.0
 */
export * from "./core/lazyComponents";

// =============================================================================
// DEFAULT AND LEGACY EXPORTS
// =============================================================================

/**
 * Default export - Optimized widget for most use cases
 * @since 1.5.0
 */
export { OptimizedFeedbackWidget as default } from "./components/OptimizedFeedbackWidget";

/**
 * Legacy export for backward compatibility
 * @deprecated Use OptimizedFeedbackWidget instead
 * @since 1.0.0
 */
export { OptimizedFeedbackWidget as FeedbackWidget } from "./components/OptimizedFeedbackWidget";

// =============================================================================
// PACKAGE METADATA (Tree-shaken in production)
// =============================================================================

/**
 * Package version for runtime checks
 * @since 1.0.0
 */
export const VERSION = '2.0.0';

/**
 * Feature flags for development
 * @since 1.5.0
 */
export const FEATURES = {
  SHAKE_DETECTION: true,
  OFFLINE_SUPPORT: true,
  ANALYTICS: true,
  INTEGRATIONS: true,
  ACCESSIBILITY: true,
  I18N: true,
  PERFORMANCE_MONITORING: true
} as const;

/**
 * Bundle information for debugging
 * @since 1.5.0
 */
export const BUNDLE_INFO = {
  name: 'react-feedback-report-widget',
  version: VERSION,
  treeshakeable: true,
  sideEffects: false,
  moduleFormat: 'esm'
} as const;
