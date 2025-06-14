import React from 'react';
// Fix imports by using relative paths
import { FeedbackWidget } from '../../index';
import type { FeedbackConfig } from '../../types';

// Add type declaration for window.gatsbyAnalytics
declare global {
  interface Window {
    gatsbyAnalytics?: {
      trackEvent: (event: {
        eventCategory: string;
        eventAction: string;
        eventValue?: string;
        [key: string]: any;
      }) => void;
    };
  }
}

/**
 * Example configuration for Gatsby applications
 */
const gatsbyConfig: FeedbackConfig = {
  // Example using Gatsby Functions (serverless functions)
  apiEndpoint: '/.netlify/functions/feedback',
  
  // Enable offline support
  enableOfflineSupport: true,
  
  // Add Gatsby-specific metadata
  collectUserAgent: true,
  collectUrl: true,
  
  // Analytics integration
  analytics: {
    provider: 'custom',
    trackEvent: (eventName: string, eventData: Record<string, any>) => {
      // Example integration with Gatsby's analytics API
      if (typeof window !== 'undefined' && window.gatsbyAnalytics) {
        window.gatsbyAnalytics.trackEvent({
          eventCategory: 'Feedback',
          eventAction: eventName,
          eventValue: JSON.stringify(eventData)
        });
      }
    }
  },
  
  // Add localization
  localization: {
    locale: typeof window !== 'undefined' ? window.navigator.language : 'en'
  }
};

/**
 * Feedback component for Gatsby applications
 * 
 * @returns FeedbackWidget configured for Gatsby
 */
export const GatsbyFeedback: React.FC = () => {
  return (
    <FeedbackWidget 
      config={gatsbyConfig}
      theme="system"
      animation={{ enter: 'slide-up', exit: 'fade', duration: 300 }}
    />
  );
};

export default GatsbyFeedback;
