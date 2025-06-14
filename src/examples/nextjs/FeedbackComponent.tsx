import React from 'react';
import { OptimizedFeedbackWidget } from '../../index';
import type { FeedbackConfig, CustomIssueTrackerConfig } from '../../types';

/**
 * Example configuration for Next.js applications
 */
const nextJsConfig: FeedbackConfig = {
  apiEndpoint: process.env.NEXT_PUBLIC_FEEDBACK_API_ENDPOINT,
  theme: 'system',
  enableShakeDetection: true,
  enableOfflineSupport: true,
  enableVoting: true,
  collectUserIdentity: true,
  enableFileAttachments: true,
  maxFileSize: 10 * 1024 * 1024,
  // Removed additionalData - not a valid config property
  // Setup GitHub issue creation via Next.js API route - using CustomIssueTrackerConfig
  issueTracker: {
    provider: 'custom',
    apiEndpoint: '/api/github-issues',
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  } as CustomIssueTrackerConfig,
};

/**
 * Feedback component for Next.js applications
 * 
 * @returns FeedbackWidget configured for Next.js
 */
export const NextJsFeedback: React.FC = () => {
  return (
    <OptimizedFeedbackWidget
      config={nextJsConfig}
      theme="system"
      showButton={true}
      enableShakeDetection={nextJsConfig.enableShakeDetection}
    />
  );
};

export default NextJsFeedback;
