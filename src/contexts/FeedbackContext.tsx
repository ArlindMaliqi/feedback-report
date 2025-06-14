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
    message: string, 
    type?: Feedback["type"], 
    additionalData?: Record<string, any>
  ) => {
    setIsSubmitting(true);
    try {
      const feedback: Feedback = {
        id: Date.now().toString(),
        message,
        type: type || 'other',
        timestamp: new Date(),
        status: 'open', // Add missing status property
        submissionStatus: 'pending',
        ...additionalData
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

  const contextValue: FeedbackContextValue = useMemo(() => ({
    config: config || {},
    isOpen,
    openModal,
    closeModal,
    submitFeedback,
    feedbacks,
    loading,
    error,
    isSubmitting
  }), [config, isOpen, openModal, closeModal, submitFeedback, feedbacks, loading, error, isSubmitting]);

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
