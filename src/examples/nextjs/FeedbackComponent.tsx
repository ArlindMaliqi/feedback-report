import React from 'react';
// Fix imports by using relative paths instead of package imports for internal development
import { FeedbackWidget } from '../../index';
import type { FeedbackConfig, Feedback, CustomIssueTrackerConfig } from '../../types';

/**
 * Example configuration for Next.js applications
 */
const nextJsConfig: FeedbackConfig = {
  // API endpoint (use Next.js API route)
  apiEndpoint: '/api/feedback',
  
  // Enable offline support
  enableOfflineSupport: true,
  
  // Add environment info
  collectUserAgent: true,
  collectUrl: true,
  
  // Setup GitHub issue creation via Next.js API route - using CustomIssueTrackerConfig
  issueTracker: {
    provider: 'custom',
    apiEndpoint: '/api/create-issue',
    createIssue: async (feedback: Feedback): Promise<string> => {
      try {
        const response = await fetch('/api/create-issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedback)
        });
        
        if (!response.ok) {
          throw new Error('Failed to create issue');
        }
        
        const data = await response.json();
        return data.issueId;
      } catch (error) {
        console.error('Error creating issue:', error);
        throw error;
      }
    }
  } as CustomIssueTrackerConfig,
  
  // Additional metadata for Next.js
  additionalData: {
    nextVersion: process.env.NEXT_PUBLIC_VERSION,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT
  }
};

/**
 * Feedback component for Next.js applications
 * 
 * @returns FeedbackWidget configured for Next.js
 */
export const NextJsFeedback: React.FC = () => {
  return (
    <FeedbackWidget 
      config={nextJsConfig}
      theme="system"
      template="bug-report"
      animation={{ enter: 'zoom', exit: 'fade', duration: 300 }}
    />
  );
};

export default NextJsFeedback;
