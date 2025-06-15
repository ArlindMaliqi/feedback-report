/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component render times
  trackRender(componentName: string, renderTime: number) {
    this.metrics.set(`render_${componentName}`, renderTime);
  }

  // Track API response times
  trackApiCall(endpoint: string, duration: number) {
    this.metrics.set(`api_${endpoint}`, duration);
  }

  // Track bundle load times
  trackBundleLoad(bundleName: string, loadTime: number) {
    this.metrics.set(`bundle_${bundleName}`, loadTime);
  }

  // Get performance report
  getReport() {
    return Object.fromEntries(this.metrics);
  }

  // Send metrics to analytics
  async sendMetrics() {
    const report = this.getReport();
    
    // Send to your analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      Object.entries(report).forEach(([metric, value]) => {
        if (window.gtag) {
          window.gtag('event', 'performance_metric', {
            custom_parameter: metric,
            value: value
          });
        }
      });
    }
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();
  
  const trackComponentRender = (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      monitor.trackRender(componentName, endTime - startTime);
    };
  };

  return { trackComponentRender, monitor };
};
