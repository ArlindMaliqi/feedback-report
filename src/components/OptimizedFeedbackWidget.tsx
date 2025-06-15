/**
 * Performance-optimized feedback widget with lazy loading and code splitting
 * @module components/OptimizedFeedbackWidget
 */
import React, { 
  lazy, 
  Suspense, 
  useMemo,
  ComponentType
} from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { OptimizedFeedbackProvider } from './OptimizedFeedbackProvider';
import { SSRSafeComponent } from '../core/SSRSafeComponent';
import type { 
  FeedbackConfig, 
  FeedbackModalStyles, 
  ThemePreference,
  AnimationConfig,
  TemplateConfig
} from '../types';

/**
 * Lazy-loaded feedback button component with error boundary protection
 * @internal
 */
const LazyFeedbackButton = lazy(() => 
  import('./FeedbackButton').then(module => ({ default: module.FeedbackButton }))
) as ComponentType<any>;

/**
 * Lazy-loaded feedback modal component with error boundary protection
 * @internal
 */
const LazyFeedbackModal = lazy(() => 
  import('./FeedbackModal').then(module => ({ default: module.FeedbackModal }))
);

/**
 * Lazy-loaded shake detector component for device motion detection
 * @internal
 */
const LazyShakeDetector = lazy(() => 
  import('./ShakeDetector').then(module => ({ default: module.ShakeDetector }))
);

/**
 * Lazy-loaded offline indicator component for network status display
 * @internal
 */
const LazyOfflineIndicator = lazy(() => 
  import('./OfflineIndicator').then(module => ({ default: module.OfflineIndicator }))
);

/**
 * Configuration properties for the OptimizedFeedbackWidget component
 * @interface OptimizedFeedbackWidgetProps
 */
export interface OptimizedFeedbackWidgetProps {
  /** Configuration options for the feedback system */
  config?: FeedbackConfig;
  /** Whether to show the floating feedback button */
  showButton?: boolean;
  /** Whether to enable shake detection for feedback triggering */
  enableShakeDetection?: boolean;
  /** Properties to pass to the FeedbackButton component */
  buttonProps?: React.ComponentProps<typeof LazyFeedbackButton>;
  /** Custom styling options for the modal */
  modalStyles?: FeedbackModalStyles;
  /** Initial theme preference (light, dark, or system) */
  theme?: ThemePreference;
  /** Animation configuration for modal transitions */
  animation?: AnimationConfig;
  /** Template to use for feedback form layout */
  template?: TemplateConfig;
  /** Whether to show offline indicator when offline support is enabled */
  showOfflineIndicator?: boolean;
  /** Custom loading fallback component for lazy-loaded modules */
  loadingFallback?: React.ReactNode;
  /** Error boundary fallback component for handling loading failures */
  errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

/**
 * Default loading component displayed while lazy components are being loaded
 * @param props - Component properties
 * @param props.component - Name of the component being loaded
 * @returns JSX element displaying loading state
 */
const LoadingFallback: React.FC<{ component?: string }> = ({ component }) => (
  <div 
    style={{ 
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      opacity: 0.7,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    }}
    aria-live="polite"
  >
    Loading {component || 'component'}...
  </div>
);

/**
 * Error boundary component for graceful handling of lazy component loading failures
 * @class LazyComponentErrorBoundary
 * @extends React.Component
 */
class LazyComponentErrorBoundary extends React.Component<
  { 
    /** Child components to render */
    children: React.ReactNode; 
    /** Custom fallback component for error states */
    fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
    /** Name of the component for error reporting */
    componentName?: string;
  },
  { 
    /** Whether an error has occurred */
    hasError: boolean; 
    /** The error that occurred */
    error?: Error 
  }
> {
  /**
   * Creates an instance of LazyComponentErrorBoundary
   * @param props - Component properties
   */
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Static method to update state when an error occurs
   * @param error - The error that occurred
   * @returns Updated state object
   */
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called when an error is caught
   * @param error - The error that occurred
   * @param errorInfo - Additional error information
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error loading ${this.props.componentName || 'component'}:`, error, errorInfo);
  }

  /**
   * Resets the error state to retry loading the component
   */
  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  /**
   * Renders the component or error fallback
   * @returns JSX element
   */
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }
      
      return (
        <div 
          style={{ 
            padding: '0.5rem',
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#dc2626'
          }}
        >
          Failed to load {this.props.componentName || 'component'}
          <button 
            onClick={this.resetError}
            style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              border: '1px solid #dc2626',
              backgroundColor: 'transparent',
              color: '#dc2626',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * Performance-optimized feedback widget with advanced lazy loading capabilities
 * 
 * This widget provides:
 * - Code splitting for all major components to reduce initial bundle size
 * - SSR compatibility for server-side rendering frameworks
 * - Error boundaries for graceful degradation when components fail to load
 * - Loading states for better user experience during component loading
 * - Bundle size optimization through dynamic imports
 * - Theme management with system preference detection
 * - Accessibility features including ARIA labels and keyboard navigation
 * 
 * @param props - Widget configuration properties
 * @returns Optimized feedback widget component
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <OptimizedFeedbackWidget 
 *   config={{
 *     apiEndpoint: '/api/feedback',
 *     enableOfflineSupport: true
 *   }}
 * />
 * ```
 * 
 * @example
 * Advanced configuration:
 * ```tsx
 * <OptimizedFeedbackWidget 
 *   config={{
 *     apiEndpoint: '/api/feedback',
 *     enableOfflineSupport: true,
 *     analytics: { provider: 'google-analytics' }
 *   }}
 *   theme="dark"
 *   enableShakeDetection={true}
 *   loadingFallback={<CustomLoader />}
 * />
 * ```
 */
export const OptimizedFeedbackWidget: React.FC<OptimizedFeedbackWidgetProps> = ({
  config = {},
  showButton = true,
  enableShakeDetection = false,
  buttonProps,
  modalStyles,
  theme = 'system',
  animation,
  template,
  showOfflineIndicator,
  loadingFallback,
  errorFallback
}) => {
  /**
   * Optimized configuration with performance hints for internal use
   */
  const optimizedConfig = useMemo(() => ({
    ...config,
    __isOptimized: true,
    __lazyLoadingEnabled: true
  }), [config]);

  /**
   * Determines whether shake detector should be loaded based on configuration
   */
  const shouldLoadShakeDetector = enableShakeDetection && !config.disableNetworkRequests;
  
  /**
   * Determines whether offline indicator should be loaded based on configuration
   */
  const shouldLoadOfflineIndicator = showOfflineIndicator && config.enableOfflineSupport;

  return (
    <SSRSafeComponent 
      fallback={loadingFallback}
      showLoader={!loadingFallback}
    >
      <ThemeProvider initialTheme={theme}>
        <OptimizedFeedbackProvider config={optimizedConfig}>
          
          {/* Lazy-loaded Shake Detector */}
          {shouldLoadShakeDetector && (
            <LazyComponentErrorBoundary 
              componentName="ShakeDetector" 
              fallback={errorFallback}
            >
              <Suspense fallback={<LoadingFallback component="shake detector" />}>
                <LazyShakeDetector />
              </Suspense>
            </LazyComponentErrorBoundary>
          )}
          
          {/* Lazy-loaded Feedback Button */}
          {showButton && (
            <LazyComponentErrorBoundary 
              componentName="FeedbackButton" 
              fallback={errorFallback}
            >
              <Suspense fallback={<LoadingFallback component="feedback button" />}>
                <LazyFeedbackButton {...buttonProps} />
              </Suspense>
            </LazyComponentErrorBoundary>
          )}
          
          {/* Lazy-loaded Offline Indicator */}
          {shouldLoadOfflineIndicator && (
            <LazyComponentErrorBoundary 
              componentName="OfflineIndicator" 
              fallback={errorFallback}
            >
              <Suspense fallback={<LoadingFallback component="offline indicator" />}>
                <LazyOfflineIndicator />
              </Suspense>
            </LazyComponentErrorBoundary>
          )}
          
          {/* Lazy-loaded Feedback Modal */}
          <LazyComponentErrorBoundary 
            componentName="FeedbackModal" 
            fallback={errorFallback}
          >
            <Suspense fallback={<LoadingFallback component="feedback modal" />}>
              <LazyFeedbackModal 
                isOpen={false}
                onClose={() => {}}
                onSubmit={async () => {
                  // Handle submission here
                  await Promise.resolve();
                }}
                styles={modalStyles} 
                animation={animation}
                template={template}
              />
            </Suspense>
          </LazyComponentErrorBoundary>
          
        </OptimizedFeedbackProvider>
      </ThemeProvider>
    </SSRSafeComponent>
  );
};

export default OptimizedFeedbackWidget;
