/**
 * Performance-optimized FeedbackProvider with lazy loading capabilities
 * @module components/OptimizedFeedbackProvider
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.5.0
 */
import React, { 
  useState, 
  ReactNode, 
  useCallback, 
  useMemo
} from "react";
import type { 
  FeedbackContextValue, 
  Feedback, 
  FeedbackConfig
} from "../types";
import { generateId, validateFeedback, handleApiResponse } from "../utils";
import { showError, showSuccess } from "../utils/notifications";
import { DEFAULT_CATEGORIES } from "../utils/categories";
import { createTranslator, getDirection } from "../utils/localization";
import { FeedbackContext, LocalizationContext, LocalLocalizationContextType } from "../contexts/FeedbackContext";

/**
 * Configuration properties for the OptimizedFeedbackProvider component
 */
interface OptimizedFeedbackProviderProps {
  /** Child components that will have access to the feedback context */
  children: ReactNode;
  /** Configuration options for the feedback system */
  config?: FeedbackConfig;
  /** Test props for mocking behavior in test environments */
  _testProps?: {
    mockApiResponse?: any;
    disableNetworkRequests?: boolean;
  };
}

/**
 * Enhanced FeedbackProvider with performance optimizations and dynamic loading
 */
export const OptimizedFeedbackProvider: React.FC<OptimizedFeedbackProviderProps> = ({ 
  children, 
  config = {},
  _testProps
}) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create translator
  const t = useMemo(() => {
    return createTranslator(config.localization);
  }, [config.localization]);

  /**
   * Opens the feedback modal
   */
  const openModal = useCallback(() => setIsOpen(true), []);
  
  /**
   * Closes the feedback modal
   */
  const closeModal = useCallback(() => setIsOpen(false), []);

  /**
   * Submits feedback with validation and error handling
   */
  const submitFeedback = useCallback(
    async (
      feedbackOrMessage: Partial<Feedback> | string,
      type: Feedback["type"] = "other",
      additionalData: Record<string, any> = {}
    ): Promise<void> => {
      // Handle both object and string inputs
      let message: string;
      let feedbackData: Partial<Feedback>;

      if (typeof feedbackOrMessage === 'string') {
        message = feedbackOrMessage;
        feedbackData = { message, type, ...additionalData };
      } else {
        message = feedbackOrMessage.message || '';
        feedbackData = { type, ...additionalData, ...feedbackOrMessage };
      }

      if (!message.trim()) {
        const errorMsg = t('validation.messageRequired');
        setError(errorMsg);
        showError(errorMsg);
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const newFeedback: Feedback = {
          id: generateId(),
          message: message.trim(),
          type: feedbackData.type || 'other',
          timestamp: new Date(),
          priority: feedbackData.priority || 'medium',
          status: 'open',
          votes: 0,
          url: window.location.href,
          userAgent: navigator.userAgent,
          ...feedbackData
        };

        // Validate feedback before submission
        const validation = validateFeedback(newFeedback);
        if (!validation.isValid) {
          const errorMsg = validation.errors?.join(', ') || validation.error || 'Validation failed';
          setError(errorMsg);
          showError(errorMsg);
          return;
        }

        // Submit to API if not disabled in tests
        if (!_testProps?.disableNetworkRequests && config.apiEndpoint) {
          const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFeedback)
          });

          await handleApiResponse(response);
        }

        // Update local state
        setFeedbacks(prev => [newFeedback, ...prev]);

        showSuccess(t('notification.success'));
        closeModal();
      } catch (err) {
        const errorMsg = t('notification.error');
        setError(errorMsg);
        showError(errorMsg);
        console.error('Error submitting feedback:', err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [config, closeModal, t, _testProps]
  );

  /**
   * Handles voting on feedback (stub implementation)
   */
  const voteFeedback = useCallback(async (id: string, vote: 'up' | 'down') => {
    // Stub implementation for voting
    console.log(`Vote ${vote} on feedback ${id}`);
  }, []);

  // Get categories from configuration
  const categories = useMemo(() => {
    return config.categories || DEFAULT_CATEGORIES || [];
  }, [config.categories]);

  /**
   * Memoized feedback context value
   */
  const feedbackContextValue: FeedbackContextValue = useMemo(() => ({
    // Core data
    feedback: feedbacks, // Primary property
    feedbacks, // Alias for backward compatibility
    
    // State
    isSubmitting,
    isOnline: !isOffline,
    isOffline,
    isOpen,
    loading: false,
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
    config,
    categories
  }), [
    feedbacks, 
    isSubmitting, 
    isOffline, 
    isOpen, 
    error, 
    submitFeedback, 
    voteFeedback,
    openModal, 
    closeModal, 
    config, 
    categories
  ]);

  /**
   * Memoized localization context value
   */
  const localizationContextValue: LocalLocalizationContextType = useMemo(() => ({
    t: (key: string, params?: Record<string, string | number>) => t(key, params),
    locale: config.localization?.locale || 'en',
    dir: getDirection(config.localization?.locale || 'en')
  }), [t, config.localization]);

  return (
    <LocalizationContext.Provider value={localizationContextValue}>
      <FeedbackContext.Provider value={feedbackContextValue}>
        {children}
      </FeedbackContext.Provider>
    </LocalizationContext.Provider>
  );
};

export default OptimizedFeedbackProvider;
