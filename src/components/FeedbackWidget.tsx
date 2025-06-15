'use client';

import React from 'react';
import { FeedbackProvider } from './FeedbackProvider';
import { FeedbackButton } from './FeedbackButton';
import { FeedbackModal } from './FeedbackModal';
import { ThemeProvider } from '../contexts/ThemeContext';
import type { FeedbackWidgetProps, ThemePreference } from '../types';

/**
 * Complete Feedback Widget with all features
 * 
 * Features included:
 * - All template types (bug report, feature request, general)
 * - Shake detection support
 * - Offline support with sync
 * - File attachments
 * - User identity collection
 * - Voting system
 * - Analytics integration
 * - Issue tracker integration
 * - Notifications
 * - Localization
 * - Custom theming
 * - Accessibility features
 */
export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  config,
  children
}) => {
  // Merge default config with user config to preserve all features
  const mergedConfig = {
    // Core features
    enableShakeDetection: false,
    enableOfflineSupport: true,
    enableVoting: false,
    enableFileAttachments: true,
    collectUserIdentity: false,
    collectUserAgent: true,
    collectUrl: true,
    collectEmail: true,
    
    // Advanced features
    maxAttachments: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedAttachmentTypes: ['image/*', 'application/pdf', 'text/*'],
    rememberUserIdentity: true,
    
    // Theme and appearance
    theme: 'system' as ThemePreference,
    animation: {
      enter: 'fadeIn' as const,
      exit: 'fadeOut' as const,
      duration: 300
    },
    
    // Templates - use actual template configs instead of strings
    defaultTemplate: 'default',
    
    // Privacy
    dataRetentionDays: 365,
    anonymizeData: false,
    
    // Merge user config
    ...config
  };

  // Extract theme for ThemeProvider
  const themePreference = typeof mergedConfig.theme === 'string' 
    ? mergedConfig.theme as ThemePreference
    : mergedConfig.theme?.mode || 'system';

  return (
    <ThemeProvider initialTheme={themePreference}>
      <FeedbackProvider config={mergedConfig}>
        {children}
        <FeedbackButton />
        <FeedbackModal 
          isOpen={false} 
          onClose={() => {}} 
          onSubmit={async () => {}}
          config={mergedConfig}
        />
      </FeedbackProvider>
    </ThemeProvider>
  );
};

export default FeedbackWidget;
