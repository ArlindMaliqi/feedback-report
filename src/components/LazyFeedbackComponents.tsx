import { lazy, ComponentType } from 'react';
import React from 'react';

// Lazy load heavy components with better error handling
export const LazyFeedbackModal = lazy(() => 
  import('./FeedbackModal').then(module => ({
    default: module.FeedbackModal
  })).catch(() => ({
    default: () => <div>Failed to load feedback modal</div>
  }))
);

export const LazyAnalyticsDashboard = lazy(() =>
  // Use a fallback component since AnalyticsDashboard doesn't exist yet
  Promise.resolve({
    default: () => React.createElement('div', null, 'Analytics Dashboard - Coming Soon')
  })
);

// Preload critical components
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload on user interaction
    const preload = () => {
      import('./FeedbackModal');
      import('./FeedbackButton');
    };

    // Preload on hover or focus
    document.addEventListener('mouseover', preload, { once: true });
    document.addEventListener('focusin', preload, { once: true });
  }
};
