import React, { useState } from 'react';
import { FeedbackProvider } from '../contexts/FeedbackContext';
import { FeedbackButton } from './FeedbackButton';
import type { FeedbackTheme, FeedbackConfig } from '../types';

interface FeedbackData {
  message: string;
  type?: string;
  category?: string;
  email?: string;
  attachments?: File[];
}

export interface MinimalFeedbackWidgetProps {
  apiEndpoint?: string;
  onSubmit?: (feedback: any) => Promise<void>;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: FeedbackTheme;
  enableShakeDetection?: boolean;
  config?: FeedbackConfig;
}

/**
 * Ultra-lightweight feedback widget (~3kb gzipped)
 * Perfect for simple use cases where bundle size is critical
 */
export const MinimalFeedbackWidget: React.FC<MinimalFeedbackWidgetProps> = ({
  apiEndpoint = '/api/feedback',
  onSubmit,
  position = 'bottom-right',
  theme = 'system',
  enableShakeDetection = false,
  config
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultSubmit = async (feedback: FeedbackData) => {
    if (onSubmit) {
      return onSubmit(feedback);
    }
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <FeedbackProvider
      config={{
        apiEndpoint,
        theme,
        enableShakeDetection,
        ...config,
      }}
    >
      <FeedbackButton
        position={position}
      />
    </FeedbackProvider>
  );
};

export default MinimalFeedbackWidget;
