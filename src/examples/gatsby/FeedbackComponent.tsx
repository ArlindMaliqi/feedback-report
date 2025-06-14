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
  apiEndpoint: process.env.GATSBY_FEEDBACK_API_ENDPOINT,
  theme: 'system',
  enableShakeDetection: true,
  enableOfflineSupport: true,
  enableVoting: false,
  collectUserIdentity: true,
  enableFileAttachments: true,
  maxFileSize: 5 * 1024 * 1024,
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
      apiEndpoint={gatsbyConfig.apiEndpoint}
      theme="system"
      enableShakeDetection={gatsbyConfig.enableShakeDetection}
    />
  );
};

export default GatsbyFeedback;
