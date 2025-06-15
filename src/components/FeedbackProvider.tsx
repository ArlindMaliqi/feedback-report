'use client';

import React, { createContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import type { FeedbackContextValue, FeedbackConfig, Feedback, Category } from '../types';
import { generateId, validateFeedback, handleApiResponse } from '../utils';
import { createTranslator } from '../utils/localization';
import { integrationManager } from '../integrations';

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

interface FeedbackProviderProps {
  config: FeedbackConfig;
  children: ReactNode;
  _testProps?: {
    mockApiResponse?: any;
    disableNetworkRequests?: boolean;
  };
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  config,
  children,
  _testProps
}) => {
  // Enhanced state management
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  // Enhanced translator
  const t = useMemo(() => createTranslator(config.localization), [config.localization]);

  // Enhanced categories with defaults
  const categories: Category[] = useMemo(() => {
    return config.categories || [
      {
        id: 'bug',
        name: 'Bug Report',
        description: 'Report a problem or issue',
        icon: '🐛',
        subcategories: [
          { id: 'ui', name: 'User Interface', description: 'Visual or layout issues' },
          { id: 'performance', name: 'Performance', description: 'Slow or unresponsive behavior' },
          { id: 'functionality', name: 'Functionality', description: 'Feature not working as expected' }
        ]
      },
      {
        id: 'feature',
        name: 'Feature Request',
        description: 'Suggest a new feature or improvement',
        icon: '💡',
        subcategories: [
          { id: 'enhancement', name: 'Enhancement', description: 'Improve existing feature' },
          { id: 'new-feature', name: 'New Feature', description: 'Add completely new functionality' }
        ]
      },
      {
        id: 'other',
        name: 'Other',
        description: 'General feedback or questions',
        icon: '💬',
        subcategories: []
      }
    ];
  }, [config.categories]);

  // Network status detection
  useEffect(() => {
    if (config.enableOfflineSupport && typeof window !== 'undefined') {
      const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      updateOnlineStatus();
      
      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
      };
    }
  }, [config.enableOfflineSupport]);

  // Enhanced modal controls
  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(null);
    config.onOpen?.();
  }, [config]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
    config.onClose?.();
  }, [config]);

  // Enhanced feedback submission with all features
  const submitFeedback = useCallback(async (
    feedbackOrMessage: Partial<Feedback> | string,
    type: Feedback["type"] = "other",
    additionalData: Record<string, any> = {}
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Handle both string and object inputs
      let message: string;
      let feedbackData: Partial<Feedback>;

      if (typeof feedbackOrMessage === 'string') {
        message = feedbackOrMessage;
        feedbackData = { message, type, ...additionalData };
      } else {
        message = feedbackOrMessage.message || '';
        feedbackData = { type, ...additionalData, ...feedbackOrMessage };
      }

      // Create complete feedback object with all features
      const feedback: Feedback = {
        id: generateId(),
        message: message.trim(),
        type: feedbackData.type || 'other',
        status: 'open',
        timestamp: new Date(),
        priority: feedbackData.priority || 'medium',
        votes: 0,
        votedBy: [],
        submissionStatus: isOffline ? 'pending' : 'synced',
        
        // Enhanced data collection
        email: feedbackData.email || (config.collectEmail ? additionalData.email : undefined),
        userAgent: config.collectUserAgent ? navigator.userAgent : undefined,
        url: config.collectUrl ? window.location.href : undefined,
        user: config.collectUserIdentity ? feedbackData.user : undefined,
        
        // Categories and attachments
        category: feedbackData.category,
        subcategory: feedbackData.subcategory,
        attachments: feedbackData.attachments || [],
        
        // Metadata
        metadata: {
          ...feedbackData.metadata,
          timestamp: Date.now(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
          },
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      };

      // Enhanced validation
      const validation = validateFeedback(feedback);
      if (!validation.isValid) {
        const errorMsg = validation.errors?.join(', ') || validation.error || t('validation.messageRequired');
        setError(errorMsg);
        return;
      }

      // Store locally first (offline support)
      setFeedbacks(prev => [feedback, ...prev]);

      // Submit to API if online and not disabled
      if (!isOffline && !_testProps?.disableNetworkRequests && config.apiEndpoint) {
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedback)
        });

        const result = await handleApiResponse(response);
        if (!result.success) {
          throw new Error(result.error);
        }

        // Update submission status
        setFeedbacks(prev => 
          prev.map(f => f.id === feedback.id ? { ...f, submissionStatus: 'synced' } : f)
        );
      }

      // Process all integrations
      if (!_testProps?.disableNetworkRequests) {
        await integrationManager.process(feedback, config);
      }

      // Success callbacks and notifications
      config.onSuccess?.(feedback);
      
      // Show success message based on locale
      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          console.log(t('notification.success'));
        }, 100);
      }
      
      closeModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('notification.error');
      setError(errorMessage);
      config.onError?.(err instanceof Error ? err : new Error(errorMessage));
      
      // Update submission status to failed
      setFeedbacks(prev => 
        prev.map(f => 
          f.submissionStatus === 'pending' ? { ...f, submissionStatus: 'failed' } : f
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [config, closeModal, isOffline, t, _testProps]);

  // Enhanced voting system
  const voteFeedback = useCallback(async (id: string, voteType: 'up' | 'down' = 'up'): Promise<void> => {
    if (!config.enableVoting) return;
    
    const feedback = feedbacks.find(f => f.id === id);
    if (!feedback) return;

    const userId = config.collectUserIdentity ? 'current-user' : 'anonymous';
    const hasVoted = feedback.votedBy?.includes(userId);
    
    if (hasVoted) return; // Prevent duplicate votes

    const updatedFeedback = {
      ...feedback,
      votes: (feedback.votes || 0) + (voteType === 'up' ? 1 : -1),
      votedBy: [...(feedback.votedBy || []), userId]
    };

    setFeedbacks(prev => prev.map(f => f.id === id ? updatedFeedback : f));

    // Submit vote to API
    if (config.apiEndpoint && !_testProps?.disableNetworkRequests) {
      try {
        await fetch(`${config.apiEndpoint}/${id}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: voteType, userId })
        });
      } catch (error) {
        console.error('Failed to submit vote:', error);
      }
    }
  }, [config, feedbacks, _testProps]);

  // Enhanced sync functionality
  const syncPendingFeedback = useCallback(async (): Promise<void> => {
    if (!config.enableOfflineSupport || isOffline) return;
    
    const pendingFeedbacks = feedbacks.filter(f => f.submissionStatus === 'pending' || f.submissionStatus === 'failed');
    
    for (const feedback of pendingFeedbacks) {
      try {
        if (config.apiEndpoint) {
          const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedback)
          });

          if (response.ok) {
            setFeedbacks(prev => 
              prev.map(f => f.id === feedback.id ? { ...f, submissionStatus: 'synced' } : f)
            );
          }
        }
      } catch (error) {
        console.error('Failed to sync feedback:', error);
      }
    }
  }, [config, feedbacks, isOffline]);

  // Enhanced data management
  const clearFeedback = useCallback(() => {
    setFeedbacks([]);
  }, []);

  const getFeedbackById = useCallback((id: string) => {
    return feedbacks.find(f => f.id === id);
  }, [feedbacks]);

  const updateFeedback = useCallback((id: string, updates: Partial<Feedback>) => {
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  // Enhanced context value with all features
  const value: FeedbackContextValue = {
    // Core data
    feedback: feedbacks,
    feedbacks, // Backward compatibility
    
    // State
    isSubmitting,
    isOnline: !isOffline,
    isOffline,
    isOpen,
    loading,
    error,
    
    // Actions
    submitFeedback,
    voteFeedback,
    openModal,
    closeModal,
    
    // Data management
    pendingCount: feedbacks.filter(f => f.submissionStatus === 'pending').length,
    syncPendingFeedback,
    syncOfflineFeedback: syncPendingFeedback, // Alias
    clearFeedback,
    getFeedbackById,
    updateFeedback,
    
    // Configuration
    config,
    categories
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export { FeedbackContext };
