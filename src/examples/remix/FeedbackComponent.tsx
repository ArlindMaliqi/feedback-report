import React, { useEffect, useState } from 'react';
// Create a mock for Remix API to avoid TS error
// In a real project, you'd use the actual Remix imports
import type { Feedback, CustomIssueTrackerConfig } from '../../types';
import { FeedbackWidget } from '../../index';
import type { FeedbackConfig } from '../../types';

// Mock the useLocation hook for demonstration
const useLocation = () => ({ pathname: '/current-path' });

// Add window.ENV type declaration
declare global {
  interface Window {
    ENV?: {
      NODE_ENV?: string;
      [key: string]: string | undefined;
    };
  }
}

/**
 * Feedback component for Remix applications
 * 
 * Integrates the feedback widget with Remix-specific features
 * 
 * @returns FeedbackWidget configured for Remix
 */
export const RemixFeedback: React.FC = () => {
  const location = useLocation();
  const [remixEnv, setRemixEnv] = useState<string>('');
  
  // Get Remix environment info
  useEffect(() => {
    // In a real app, you'd get this from Remix ENV
    setRemixEnv(window.ENV?.NODE_ENV || 'development');
  }, []);
  
  // Config for Remix
  const remixConfig: FeedbackConfig = {
    // Use Remix resource route for API
    apiEndpoint: '/resources/feedback',
    
    // Enable offline support
    enableOfflineSupport: true,
    
    // Add environment info
    collectUserAgent: true,
    collectUrl: true,
    
    // Add remix-specific data
    additionalData: {
      remixEnv,
      remixRoute: location.pathname
    },
    
    // Use Remix's route to handle issue creation - using CustomIssueTrackerConfig
    issueTracker: {
      provider: 'custom',
      apiEndpoint: '/resources/create-issue',
      createIssue: async (feedback: Feedback): Promise<string> => {
        try {
          const response = await fetch('/resources/create-issue', {
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
    } as CustomIssueTrackerConfig
  };
  
  return (
    <FeedbackWidget 
      config={remixConfig}
      theme="system"
      template="default"
      animation={{ enter: 'zoom', exit: 'fade', duration: 300 }}
    />
  );
};

export default RemixFeedback;
