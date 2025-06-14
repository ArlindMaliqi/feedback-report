import React from 'react';
// Fix imports by using relative paths instead of package imports for internal development
import { FeedbackWidget } from '../../index';
import type { FeedbackConfig, Feedback, CustomIssueTrackerConfig } from '../../types';

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
    <FeedbackWidget
      apiEndpoint={nextJsConfig.apiEndpoint}
      theme="system"
      enableShakeDetection={nextJsConfig.enableShakeDetection}
      // Removed template and animation props
    />
  );
};

export default NextJsFeedback;
