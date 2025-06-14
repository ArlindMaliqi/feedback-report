import React, { useEffect, useState } from 'react';
import { OptimizedFeedbackWidget } from '../../index';
import type { Feedback, CustomIssueTrackerConfig, FeedbackConfig } from '../../types';

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
    apiEndpoint: process.env.FEEDBACK_API_ENDPOINT,
    theme: 'system',
    enableShakeDetection: true,
    enableOfflineSupport: true,
    enableVoting: true,
    collectUserIdentity: true,
    enableFileAttachments: true,
    maxFileSize: 10 * 1024 * 1024,
    // Removed additionalData - not a valid config property
    
    // Use Remix's route to handle issue creation - using CustomIssueTrackerConfig
    issueTracker: {
      provider: 'custom',
      apiEndpoint: '/api/feedback/create-issue',
      headers: {
        'Content-Type': 'application/json'
      }
    } as CustomIssueTrackerConfig
  };
  
  return (
    <OptimizedFeedbackWidget
      config={remixConfig}
      theme="system"
      showButton={true}
      enableShakeDetection={remixConfig.enableShakeDetection}
    />
  );
};

export default RemixFeedback;
