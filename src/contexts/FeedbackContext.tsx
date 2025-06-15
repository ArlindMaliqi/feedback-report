/**
 * Feedback and Localization Context definitions
 * @module contexts/FeedbackContext
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.0.0
 */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { 
  FeedbackContextValue, 
  Feedback,
  FeedbackConfig
} from '../types';

/**
 * Local localization context type to avoid conflicts
 */
export interface LocalLocalizationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
  dir: 'ltr' | 'rtl';
}

/**
 * Feedback context for managing feedback state
 */
export const FeedbackContext = createContext<FeedbackContextValue | null>(null);

/**
 * Localization context for managing translations
 */
export const LocalizationContext = createContext<LocalLocalizationContextType | null>(null);

FeedbackContext.displayName = 'FeedbackContext';
LocalizationContext.displayName = 'LocalizationContext';

/**
 * FeedbackProvider component props
 */
interface LocalFeedbackProviderProps {
  children: React.ReactNode;
  config?: Record<string, any>;
}

/**
 * FeedbackProvider component for providing feedback context
 */
export const FeedbackProvider: React.FC<LocalFeedbackProviderProps> = ({ children, config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const submitFeedback = useCallback(async (
    feedbackOrMessage: Partial<Feedback> | string,
    type?: Feedback["type"],
    additionalData?: Record<string, any>
  ) => {
    setIsSubmitting(true);
    try {
      // Handle both object and string inputs
      let message: string;
      let feedbackData: Partial<Feedback>;

      if (typeof feedbackOrMessage === 'string') {
        message = feedbackOrMessage;
        feedbackData = { message, type: type || 'other', ...additionalData };
      } else {
        message = feedbackOrMessage.message || '';
        feedbackData = { type: type || 'other', ...additionalData, ...feedbackOrMessage };
      }

      const feedback: Feedback = {
        id: Date.now().toString(),
        message,
        type: feedbackData.type || 'other',
        timestamp: new Date(),
        status: 'open',
        submissionStatus: 'pending',
        ...feedbackData
      };

      if (config?.apiEndpoint) {
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedback)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      setFeedbacks(prev => [...prev, feedback]);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  }, [config?.apiEndpoint, closeModal]);

  const voteFeedback = useCallback(async (id: string, vote: 'up' | 'down') => {
    // Stub implementation
    console.log(`Vote ${vote} on feedback ${id}`);
  }, []);

  const contextValue: FeedbackContextValue = useMemo(() => ({
    // Core data
    feedback: feedbacks, // Primary property
    feedbacks, // Alias for backward compatibility
    
    // State
    isSubmitting,
    isOnline: true, // Assume online for this context
    isOffline: false,
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
    syncPendingFeedback: async () => { /* stub */ },
    syncOfflineFeedback: async () => { /* stub */ },
    clearFeedback: () => setFeedbacks([]),
    getFeedbackById: (id: string) => feedbacks.find(f => f.id === id),
    updateFeedback: (id: string, updates: Partial<Feedback>) => {
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    },
    
    // Configuration
    config: config || {},
    categories: []
  }), [
    feedbacks,
    isSubmitting,
    isOpen,
    loading,
    error,
    submitFeedback,
    voteFeedback,
    openModal,
    closeModal,
    config
  ]);

  const localizationValue: LocalLocalizationContextType = useMemo(() => ({
    t: (key: string) => key,
    locale: 'en',
    dir: 'ltr'
  }), []);

  return (
    <FeedbackContext.Provider value={contextValue}>
      <LocalizationContext.Provider value={localizationValue}>
        {children}
      </LocalizationContext.Provider>
    </FeedbackContext.Provider>
  );
};

// Export types for external use
export type { LocalLocalizationContextType as LocalizationContextType };
export type { LocalFeedbackProviderProps as FeedbackProviderProps };
