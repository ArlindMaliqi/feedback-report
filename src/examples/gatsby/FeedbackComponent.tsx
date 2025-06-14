import React from 'react';
import { OptimizedFeedbackWidget } from '../../index';
import type { FeedbackConfig, SupportedLocale } from '../../types';

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
  apiEndpoint: process.env.GATSBY_FEEDBACK_API_ENDPOINT,
  theme: 'system',
  enableShakeDetection: true,
  enableOfflineSupport: true,
  enableVoting: false,
  collectUserIdentity: true,
  enableFileAttachments: true,
  maxFileSize: 5 * 1024 * 1024,
  localization: {
    locale: (typeof window !== 'undefined' ? 
      window.navigator.language.split('-')[0] : 'en') as SupportedLocale,
    fallbackLocale: 'en' as SupportedLocale,
    customTranslations: {
      // ...existing code...
    }
  }
};

/**
 * Feedback component for Gatsby applications
 * 
 * @returns FeedbackWidget configured for Gatsby
 */
export const GatsbyFeedback: React.FC = () => {
  return (
    <OptimizedFeedbackWidget
      config={gatsbyConfig}
      theme="system"
      showButton={true}
      enableShakeDetection={gatsbyConfig.enableShakeDetection}
    />
  );
};

export default GatsbyFeedback;
