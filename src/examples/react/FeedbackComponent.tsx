import React from 'react';
import { FeedbackWidget } from '../../index';
import type { FeedbackConfig } from '../../types';

// Basic React implementation
export default function ReactFeedback() {
  const config: FeedbackConfig = {
    apiEndpoint: 'https://api.example.com/feedback',
    theme: 'light',
    collectEmail: true,
    onSuccess: (feedback) => {
      alert('Thank you for your feedback!');
    },
    onError: (error) => {
      alert('Failed to send feedback. Please try again.');
    }
  };

  return <FeedbackWidget config={config} />;
}

// Feature request example
export function FeatureRequestFeedback() {
  const config: FeedbackConfig = {
    apiEndpoint: '/api/feature-requests',
    defaultTemplate: 'feature-request',
    onSuccess: (feedback) => {
      console.log('Feature request:', feedback);
    }
  };

  return <FeedbackWidget config={config} />;
}
