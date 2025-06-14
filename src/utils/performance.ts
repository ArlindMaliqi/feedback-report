/**
 * Performance monitoring and optimization utilities
 * @module utils/performance
 */
import React from 'react';

/**
 * Performance metrics interface
 */
interface PerformanceMetrics {
  /** Time to first paint */
  firstPaint?: number;
  /** Time to first contentful paint */
  firstContentfulPaint?: number;
  /** Largest contentful paint */
  largestContentfulPaint?: number;
  /** First input delay */
  firstInputDelay?: number;
  /** Cumulative layout shift */
  cumulativeLayoutShift?: number;
  /** Bundle load time */
  bundleLoadTime?: number;
  /** Component mount time */
  componentMountTime?: number;
}

/**
 * Performance monitor class for tracking widget performance
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers() {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    // Core Web Vitals observers
    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            this.metrics.cumulativeLayoutShift = 
              (this.metrics.cumulativeLayoutShift || 0) + entry.value;
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);

    } catch (error) {
      console.warn('Failed to initialize performance observers:', error);
    }
  }

  /**
   * Record component mount time
   */
  recordComponentMount(startTime: number) {
    this.metrics.componentMountTime = performance.now() - startTime;
  }

  /**
   * Record bundle load time
   */
  recordBundleLoad(startTime: number) {
    this.metrics.bundleLoadTime = performance.now() - startTime;
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    // Add paint timing metrics
    if (typeof window !== 'undefined' && window.performance) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      });
    }

    return { ...this.metrics };
  }

  /**
   * Report metrics to analytics (if configured)
   */
  reportMetrics(analyticsConfig?: any) {
    const metrics = this.getMetrics();
    
    if (analyticsConfig && typeof analyticsConfig.trackEvent === 'function') {
      analyticsConfig.trackEvent('feedback_widget_performance', {
        ...metrics,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Clean up observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * React hook for performance monitoring
 */
export const usePerformanceMonitor = () => {
  const [monitor] = React.useState(() => new PerformanceMonitor());
  
  React.useEffect(() => {
    return () => monitor.destroy();
  }, [monitor]);

  return monitor;
};

/**
 * Higher-order component for performance monitoring
 */
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> => {
  const WithPerformanceMonitoring: React.FC<P> = (props: P) => {
    const monitor = usePerformanceMonitor();
    const mountTime = React.useRef(performance.now());

    React.useEffect(() => {
      monitor.recordComponentMount(mountTime.current);
    }, [monitor]);

    return React.createElement(WrappedComponent, props);
  };

  WithPerformanceMonitoring.displayName = 
    `withPerformanceMonitoring(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithPerformanceMonitoring;
};
