'use client';

import React from 'react';
import { FeedbackProvider } from './FeedbackProvider';
import { FeedbackButton } from './FeedbackButton';
import { FeedbackModal } from './FeedbackModal';
import { ThemeProvider } from '../contexts/ThemeContext';
import type { FeedbackWidgetProps, ThemePreference } from '../types';
import OfflineIndicator from './OfflineIndicator';

/**
 * Complete Feedback Widget with all features
 * 
 * This is the main widget component that provides full functionality
 * including offline support, file attachments, voting, and integrations.
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
    enableVoting: true, // Enable voting by default
    enableFileAttachments: true,
    collectUserIdentity: true, // Enable identity collection
    collectUserAgent: true,
    collectUrl: true,
    collectEmail: true,
    
    // Advanced features
    maxAttachments: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedAttachmentTypes: ['image/*', 'application/pdf', 'text/*'],
    rememberUserIdentity: true, // Enable identity persistence
    
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
    
    // Localization - provide default to avoid context errors
    localization: {
      locale: 'en' as const,
      fallbackLocale: 'en' as const,
      rtl: false
    },
    
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
          config={mergedConfig}
        />
        {/* Add offline indicator */}
        {mergedConfig.enableOfflineSupport && (
          <OfflineIndicator
            position="bottom"
            showSyncButton={true}
          />
        )}
      </FeedbackProvider>
    </ThemeProvider>
  );
};

export default FeedbackWidget;
