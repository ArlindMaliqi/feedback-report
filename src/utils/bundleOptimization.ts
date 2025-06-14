/**
 * Bundle optimization utilities and tree-shaking helpers
 * @module utils/bundleOptimization
 */

/**
 * Conditional import wrapper for tree-shaking optimization
 * 
 * This utility helps bundlers understand which modules can be safely
 * excluded when features are not used.
 * 
 * @param condition - Whether the module should be loaded
 * @param importFn - Function that returns the dynamic import
 * @returns Promise resolving to the module or null
 */
export const conditionalImport = async <T>(
  condition: boolean,
  importFn: () => Promise<T>
): Promise<T | null> => {
  if (!condition) {
    return null;
  }
  
  try {
    return await importFn();
  } catch (error) {
    console.error('Failed to load module:', error);
    return null;
  }
};

/**
 * Feature flags for tree-shaking optimization
 * These help bundlers eliminate unused code
 */
export const FEATURE_FLAGS = {
  // Core features (always included)
  CORE_FEEDBACK: true,
  
  // Optional features (can be tree-shaken)
  SHAKE_DETECTION: typeof window !== 'undefined',
  FILE_ATTACHMENTS: true,
  USER_IDENTITY: true,
  CATEGORIES: true,
  OFFLINE_SUPPORT: true,
  VOTING: true,
  THEMES: true,
  ANIMATIONS: true,
  
  // Integration features (tree-shakeable)
  ANALYTICS: false, // Only included when explicitly configured
  ISSUE_TRACKER: false, // Only included when explicitly configured
  WEBHOOKS: false, // Only included when explicitly configured
  NOTIFICATIONS: false, // Only included when explicitly configured
  
  // Development features (excluded in production)
  TESTING_UTILS: process.env.NODE_ENV !== 'production',
  STORYBOOK: process.env.STORYBOOK === 'true',
  
  // Framework examples (excluded in production)
  EXAMPLES: process.env.NODE_ENV !== 'production',
} as const;

/**
 * Check if a feature is enabled for tree-shaking purposes
 * 
 * @param feature - Feature flag to check
 * @returns Whether the feature should be included
 */
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  return FEATURE_FLAGS[feature];
};

/**
 * Tree-shakeable feature loader
 * Only loads features that are actually used
 */
export class FeatureLoader {
  private static loadedFeatures = new Set<string>();
  
  /**
   * Load a feature module conditionally
   */
  static async loadFeature<T>(
    featureName: string,
    condition: boolean,
    loader: () => Promise<T>
  ): Promise<T | null> {
    if (!condition) {
      return null;
    }
    
    if (this.loadedFeatures.has(featureName)) {
      return loader();
    }
    
    try {
      const module = await loader();
      this.loadedFeatures.add(featureName);
      return module;
    } catch (error) {
      console.warn(`Failed to load feature ${featureName}:`, error);
      return null;
    }
  }
  
  /**
   * Check if a feature is loaded
   */
  static isFeatureLoaded(featureName: string): boolean {
    return this.loadedFeatures.has(featureName);
  }
  
  /**
   * Get loaded features list
   */
  static getLoadedFeatures(): string[] {
    return Array.from(this.loadedFeatures);
  }
}

/**
 * Tree-shakeable integration loaders
 */
export const IntegrationLoaders = {
  analytics: (provider: string) => 
    FeatureLoader.loadFeature(
      `analytics-${provider}`,
      FEATURE_FLAGS.ANALYTICS,
      () => import('../utils/integrations/analytics')
    ),
    
  issueTracker: (provider: string) =>
    FeatureLoader.loadFeature(
      `issue-tracker-${provider}`,
      FEATURE_FLAGS.ISSUE_TRACKER,
      () => import('../utils/integrations/issueTracker')
    ),
    
  webhooks: () =>
    FeatureLoader.loadFeature(
      'webhooks',
      FEATURE_FLAGS.WEBHOOKS,
      () => import('../utils/integrations/webhooks')
    ),
    
  notifications: (provider: string) =>
    FeatureLoader.loadFeature(
      `notifications-${provider}`,
      FEATURE_FLAGS.NOTIFICATIONS,
      () => import('../utils/integrations/notifications')
    ),
};

/**
 * Get the estimated bundle size impact of features
 * This helps developers understand the cost of enabling features
 * 
 * @returns Bundle size estimates in KB
 */
export const getBundleSizeEstimates = () => ({
  core: 15, // Core feedback functionality
  shakeDetection: 2, // Shake.js dependency
  fileAttachments: 8, // File handling utilities
  userIdentity: 3, // User identity components
  categories: 4, // Category system
  offlineSupport: 6, // Offline storage and sync
  voting: 3, // Voting system
  themes: 4, // Theme system
  animations: 2, // Animation utilities
  analytics: 5, // Analytics integrations
  issueTracker: 12, // Issue tracker integrations
  webhooks: 4, // Webhook utilities
  notifications: 8, // Chat platform notifications
  localization: 6, // i18n support
  testing: 15, // Testing utilities (dev only)
  storybook: 10, // Storybook stories (dev only)
  examples: 20, // Framework examples (dev only)
});

/**
 * Runtime feature detection for progressive enhancement
 * 
 * @returns Object with detected capabilities
 */
export const detectRuntimeCapabilities = () => ({
  // Browser capabilities
  hasLocalStorage: typeof Storage !== 'undefined',
  hasIndexedDB: typeof indexedDB !== 'undefined',
  hasWebWorkers: typeof Worker !== 'undefined',
  hasServiceWorker: 'serviceWorker' in navigator,
  hasNotifications: 'Notification' in window,
  hasClipboard: navigator.clipboard !== undefined,
  hasShare: navigator.share !== undefined,
  
  // Device capabilities
  hasDeviceMotion: typeof DeviceMotionEvent !== 'undefined',
  hasVibration: navigator.vibrate !== undefined,
  hasCamera: navigator.mediaDevices !== undefined,
  hasTouch: 'ontouchstart' in window,
  
  // Network capabilities
  hasOnlineDetection: 'onLine' in navigator,
  hasConnectionAPI: 'connection' in navigator,
  hasFetch: typeof fetch !== 'undefined',
  
  // Performance APIs
  hasPerformanceAPI: typeof performance !== 'undefined',
  hasIntersectionObserver: typeof IntersectionObserver !== 'undefined',
  hasResizeObserver: typeof ResizeObserver !== 'undefined',
});

/**
 * Tree-shakeable exports configuration
 * This helps bundlers understand what can be safely removed
 */
export const TreeShakeableExports = {
  // Core exports (always included)
  core: () => import('../components/FeedbackProvider'),
  
  // Optional feature exports
  shakeDetection: () => FEATURE_FLAGS.SHAKE_DETECTION ? import('../components/ShakeDetector') : null,
  fileAttachments: () => FEATURE_FLAGS.FILE_ATTACHMENTS ? import('../components/FileAttachmentInput') : null,
  userIdentity: () => FEATURE_FLAGS.USER_IDENTITY ? import('../components/UserIdentityFields') : null,
  categories: () => FEATURE_FLAGS.CATEGORIES ? import('../components/CategorySelector') : null,
  offlineSupport: () => FEATURE_FLAGS.OFFLINE_SUPPORT ? import('../components/OfflineIndicator') : null,
  themes: () => FEATURE_FLAGS.THEMES ? import('../contexts/ThemeContext') : null,
  
  // Integration exports
  analytics: () => FEATURE_FLAGS.ANALYTICS ? import('../utils/integrations/analytics') : null,
  issueTracker: () => FEATURE_FLAGS.ISSUE_TRACKER ? import('../utils/integrations/issueTracker') : null,
  webhooks: () => FEATURE_FLAGS.WEBHOOKS ? import('../utils/integrations/webhooks') : null,
  notifications: () => FEATURE_FLAGS.NOTIFICATIONS ? import('../utils/integrations/notifications') : null,
  
  // Development exports (excluded in production) - use Promise.resolve(null) for missing modules
  testing: () => FEATURE_FLAGS.TESTING_UTILS ? Promise.resolve(null) : null,
  storybook: () => FEATURE_FLAGS.STORYBOOK ? Promise.resolve(null) : null,
  examples: () => FEATURE_FLAGS.EXAMPLES ? Promise.resolve(null) : null,
};

/**
 * Bundle analyzer helper
 * Provides insights into what features are being used
 */
export const BundleAnalyzer: {
  analyzeUsage: (config: any) => { used: string[]; unused: string[]; size: number };
  getOptimizationRecommendations: (analysis: { used: string[]; unused: string[]; size: number }) => string[];
} = {
  /**
   * Analyze which features are actually being used
   */
  analyzeUsage(config: any): { used: string[]; unused: string[]; size: number } {
    const used: string[] = [];
    const unused: string[] = [];
    let estimatedSize = getBundleSizeEstimates().core;
    
    // Check each feature
    Object.entries(FEATURE_FLAGS).forEach(([feature, enabled]) => {
      if (enabled) {
        used.push(feature);
        const sizeEstimate = getBundleSizeEstimates()[feature as keyof ReturnType<typeof getBundleSizeEstimates>];
        if (sizeEstimate) {
          estimatedSize += sizeEstimate;
        }
      } else {
        unused.push(feature);
      }
    });
    
    // Check config-based features
    if (config?.analytics) {
      used.push('analytics');
      estimatedSize += getBundleSizeEstimates().analytics;
    }
    if (config?.issueTracker) {
      used.push('issueTracker');
      estimatedSize += getBundleSizeEstimates().issueTracker;
    }
    if (config?.webhooks) {
      used.push('webhooks');
      estimatedSize += getBundleSizeEstimates().webhooks;
    }
    if (config?.notifications) {
      used.push('notifications');
      estimatedSize += getBundleSizeEstimates().notifications;
    }
    
    return { used, unused, size: estimatedSize };
  },
  
  /**
   * Get recommendations for bundle optimization
   */
  getOptimizationRecommendations(analysis: { used: string[]; unused: string[]; size: number }) {
    const recommendations: string[] = [];
    
    if (analysis.size > 50) {
      recommendations.push('Consider using OptimizedFeedbackWidget for better code splitting');
    }
    
    if (analysis.unused.length > 0) {
      recommendations.push(`Remove unused features: ${analysis.unused.join(', ')}`);
    }
    
    if (analysis.used.includes('EXAMPLES') || analysis.used.includes('STORYBOOK')) {
      recommendations.push('Development features detected - ensure these are excluded in production');
    }
    
    return recommendations;
  }
};
