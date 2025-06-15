'use client';

import React from 'react';
import { FeedbackWidget, OptimizedFeedbackWidget, MinimalFeedbackWidget } from '../../index';
import type { FeedbackConfig } from '../../types';

// Basic Next.js implementation with core features
export default function NextjsFeedback() {
  const config: FeedbackConfig = {
    apiEndpoint: '/api/feedback',
    theme: 'system',
    collectEmail: true,
    collectUserAgent: true,
    collectUrl: true,
    defaultTemplate: 'default',
    onSuccess: (feedback) => {
      console.log('Feedback submitted:', feedback);
    },
    onError: (error) => {
      console.error('Feedback error:', error);
    },
  };

  return <FeedbackWidget config={config} />;
}

// Advanced Next.js implementation with ALL features
export function NextjsAdvancedFeedback() {
  const config: FeedbackConfig = {
    // Core API
    apiEndpoint: '/api/feedback',
    
    // User Experience Features
    enableShakeDetection: true,
    enableOfflineSupport: true,
    enableVoting: true,
    enableFileAttachments: true,
    collectUserIdentity: true,
    collectUserAgent: true,
    collectUrl: true,
    collectEmail: true,
    rememberUserIdentity: true,
    
    // File Upload Configuration
    maxAttachments: 5,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedAttachmentTypes: [
      'image/png', 'image/jpeg', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/csv'
    ],
    
    // Theme and Appearance
    theme: {
      mode: 'system',
      primaryColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      borderColor: '#E5E7EB'
    },
    
    // Animation Configuration
    animation: {
      enter: 'fadeIn',
      exit: 'fadeOut',
      duration: 300,
      easing: 'ease-in-out'
    },
    
    // Templates and Categories
    defaultTemplate: 'bug-report',
    categories: [
      {
        id: 'bug',
        name: 'Bug Report',
        description: 'Report technical issues',
        icon: '🐛',
        color: '#EF4444',
        subcategories: [
          { id: 'critical', name: 'Critical Bug', description: 'Blocks core functionality' },
          { id: 'minor', name: 'Minor Bug', description: 'Small issues or cosmetic problems' }
        ]
      },
      {
        id: 'feature',
        name: 'Feature Request',
        description: 'Suggest new features',
        icon: '💡',
        color: '#10B981',
        subcategories: [
          { id: 'enhancement', name: 'Enhancement', description: 'Improve existing features' },
          { id: 'new', name: 'New Feature', description: 'Completely new functionality' }
        ]
      }
    ],
    
    // Analytics Integration
    analytics: {
      provider: 'google-analytics',
      trackingId: process.env.NEXT_PUBLIC_GA_ID,
      trackEvents: true,
      eventName: 'feedback_submitted',
      customEvents: {
        'feedback_opened': 'user_opened_feedback_modal',
        'feedback_closed': 'user_closed_feedback_modal'
      }
    },
    
    // Issue Tracker Integration (GitHub)
    issueTracker: {
      provider: 'github',
      apiToken: process.env.GITHUB_TOKEN,
      owner: 'your-username',
      repository: 'your-repo',
      labels: ['feedback', 'user-reported'],
      assignee: 'maintainer-username'
    },
    
    // Notifications
    notifications: {
      slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL!,
        channel: '#feedback',
        mentions: ['@channel']
      },
      email: {
        from: 'feedback@yourapp.com',
        to: ['team@yourapp.com'],
        subject: 'New Feedback Received'
      }
    },
    
    // Webhooks
    webhooks: [
      {
        url: 'https://your-webhook-endpoint.com/feedback',
        events: ['feedback.created', 'feedback.updated'],
        headers: {
          'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}`
        }
      }
    ],
    
    // Localization
    localization: {
      locale: 'en',
      fallbackLocale: 'en',
      customTranslations: {
        'en': {
          'feedback.title': 'Send us your feedback',
          'feedback.success': 'Thank you for your feedback!',
          'feedback.error': 'Failed to send feedback. Please try again.'
        },
        'es': {
          'feedback.title': 'Envíanos tus comentarios',
          'feedback.success': '¡Gracias por tus comentarios!',
          'feedback.error': 'Error al enviar comentarios. Inténtalo de nuevo.'
        }
      }
    },
    
    // Privacy and Security
    privacyPolicyUrl: '/privacy',
    dataRetentionDays: 365,
    anonymizeData: false,
    
    // Callbacks
    onSuccess: (feedback) => {
      // Custom success handling
      console.log('Feedback submitted successfully:', feedback);
      
      // Show custom toast notification
      if (typeof window !== 'undefined' && 'showToast' in window) {
        (window as any).showToast('Feedback sent successfully!', 'success');
      }
      
      // Track in analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'feedback_success', {
          feedback_type: feedback.type,
          feedback_id: feedback.id
        });
      }
    },
    
    onError: (error) => {
      console.error('Feedback submission failed:', error);
      
      // Custom error handling
      if (typeof window !== 'undefined' && 'showToast' in window) {
        (window as any).showToast('Failed to send feedback. Please try again.', 'error');
      }
    },
    
    onOpen: () => {
      console.log('Feedback modal opened');
      // Track modal open event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'feedback_modal_opened');
      }
    },
    
    onClose: () => {
      console.log('Feedback modal closed');
      // Track modal close event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'feedback_modal_closed');
      }
    }
  };

  return (
    <OptimizedFeedbackWidget 
      config={config}
      showButton={true}
      enableShakeDetection={true}
      showOfflineIndicator={true}
      loadingFallback={<div>Loading feedback widget...</div>}
    />
  );
}

// Minimal Next.js implementation for performance-critical apps
export function NextjsMinimalFeedback() {
  return (
    <MinimalFeedbackWidget
      apiEndpoint="/api/feedback"
      position="bottom-right"
      theme="system"
      onSubmit={async (feedback) => {
        console.log('Minimal feedback:', feedback);
      }}
    />
  );
}

// Example with custom template for bug reports
export function NextjsBugReportFeedback() {
  const config: FeedbackConfig = {
    apiEndpoint: '/api/bug-reports',
    defaultTemplate: 'bug-report',
    enableFileAttachments: true,
    maxAttachments: 3,
    allowedAttachmentTypes: ['image/*', 'video/*'],
    collectUserAgent: true,
    collectUrl: true,
    onSuccess: (feedback) => {
      console.log('Bug report submitted:', feedback);
      // Redirect to thank you page
      window.location.href = '/thank-you?type=bug-report';
    }
  };

  return <FeedbackWidget config={config} />;
}

// Example with custom categories and subcategories
export function NextjsCustomCategoriesFeedback() {
  const config: FeedbackConfig = {
    apiEndpoint: '/api/feedback',
    categories: [
      {
        id: 'product',
        name: 'Product Feedback',
        description: 'Feedback about our products',
        icon: '📦',
        subcategories: [
          { id: 'quality', name: 'Quality Issues', description: 'Problems with product quality' },
          { id: 'features', name: 'Feature Requests', description: 'New feature suggestions' },
          { id: 'pricing', name: 'Pricing Feedback', description: 'Comments about pricing' }
        ]
      },
      {
        id: 'service',
        name: 'Customer Service',
        description: 'Feedback about our service',
        icon: '🎧',
        subcategories: [
          { id: 'response-time', name: 'Response Time', description: 'Speed of our responses' },
          { id: 'helpfulness', name: 'Helpfulness', description: 'How helpful our team was' }
        ]
      }
    ],
    enableVoting: true,
    enableOfflineSupport: true
  };

  return <FeedbackWidget config={config} />;
}
