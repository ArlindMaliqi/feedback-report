/**
 * Enhanced FeedbackProvider component with comprehensive feedback management
 * @module components/FeedbackProvider
 */
import React, { 
  useState, 
  useCallback, 
  useEffect, 
  useMemo, 
  ReactNode
} from 'react';
import type { 
  Feedback, 
  FeedbackConfig, 
  FeedbackContextValue, 
  LocalizationContextType 
} from '../types';
import { FeedbackContext, LocalizationContext, type LocalLocalizationContextType } from '../contexts/FeedbackContext';
import { createTranslator, getDirection } from '../utils/localization';
import { generateId, validateFeedback, handleApiResponse } from '../utils';
import { showSuccess, showError, showInfo } from '../utils/notifications';
import { DEFAULT_CATEGORIES } from '../utils/categories';

/**
 * Props for the FeedbackProvider component
 */
export interface FeedbackProviderProps {
  /** Child components that will have access to the feedback context */
  children: ReactNode;
  /** Configuration options for the feedback system */
  config?: FeedbackConfig;
  /** Test props for mocking behavior in test environments (internal use only) */
  _testProps?: {
    mockApiResponse?: any;
    disableNetworkRequests?: boolean;
  };
}

/**
 * Enhanced FeedbackProvider with comprehensive feedback management
 */
export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ 
  children, 
  config: initialConfig = {},
  _testProps
}) => {
  // Memoize the final configuration
  const finalConfig = useMemo(() => ({
    theme: 'system' as const,
    enableShakeDetection: false,
    enableOfflineSupport: false,
    enableVoting: false,
    collectUserIdentity: false,
    enableFileAttachments: true,
    maxFileSize: 5 * 1024 * 1024,
    categories: DEFAULT_CATEGORIES,
    ...initialConfig
  }), [initialConfig]);

  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !window.navigator.onLine;
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create translator
  const t = useMemo(() => {
    return createTranslator(finalConfig.localization);
  }, [finalConfig.localization]);

  // Network status monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Opens the feedback modal
   */
  const openModal = useCallback(() => setIsOpen(true), []);
  
  /**
   * Closes the feedback modal
   */
  const closeModal = useCallback(() => setIsOpen(false), []);

  /**
   * Synchronizes offline feedback when connection is restored
   */
  const syncOfflineFeedback = useCallback(async (): Promise<void> => {
    if (isOffline || !finalConfig.apiEndpoint) return;

    const pendingFeedback = feedbacks.filter(f => f.submissionStatus === 'pending');
    
    if (pendingFeedback.length > 0) {
      showInfo(t('notification.sync', { count: pendingFeedback.length.toString() }));
      
      for (const feedback of pendingFeedback) {
        try {
          const response = await fetch(finalConfig.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedback)
          });

          const result = await handleApiResponse(response);
          
          if (result.success) {
            setFeedbacks(prev => 
              prev.map(f => 
                f.id === feedback.id 
                  ? { ...f, submissionStatus: 'synced' as const }
                  : f
              )
            );
          } else {
            showError(t('notification.error', { message: result.error || 'Unknown error' }));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          showError(t('notification.error', { message: errorMessage }));
        }
      }
      
      showSuccess(t('notification.syncComplete'));
    }
  }, [isOffline, feedbacks, finalConfig.apiEndpoint, t]);

  /**
   * Submits feedback with validation and error handling
   */
  const submitFeedback = useCallback(async (
    message: string,
    type: Feedback["type"] = "other",
    additionalData: Record<string, any> = {}
  ): Promise<void> => {
    if (!message.trim()) {
      setError(t('feedback.error.empty'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newFeedback: Feedback = {
        id: generateId(),
        message: message.trim(),
        type: type || 'other',
        timestamp: new Date(),
        priority: additionalData?.priority || 'medium',
        status: 'open',
        votes: 0,
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        submissionStatus: isOffline ? 'pending' : 'synced',
        ...additionalData
      };

      // Validate feedback
      const validation = validateFeedback(newFeedback);
      if (!validation.isValid) {
        const errorMsg = validation.errors?.join(', ') || validation.error || 'Validation failed';
        setError(errorMsg);
        showError(errorMsg);
        return;
      }

      // Submit to API if online and not disabled in tests
      if (!isOffline && !_testProps?.disableNetworkRequests && finalConfig.apiEndpoint) {
        const response = await fetch(finalConfig.apiEndpoint, {
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
      showError(t('notification.error'));
    } finally {
      setIsSubmitting(false);
    }
  }, [t, isOffline, finalConfig.apiEndpoint, closeModal, _testProps]);

  /**
   * Handles voting on feedback
   */
  const voteFeedback = useCallback(async (id: string): Promise<void> => {
    if (!finalConfig.enableVoting) return;

    try {
      if (!isOffline && finalConfig.apiEndpoint) {
        const response = await fetch(`${finalConfig.apiEndpoint}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedbackId: id })
        });

        const result = await handleApiResponse(response);
        
        if (result.success) {
          setFeedbacks(prev => 
            prev.map(feedback => 
              feedback.id === id 
                ? { ...feedback, votes: (feedback.votes || 0) + 1 }
                : feedback
            )
          );
        } else {
          showError(t('notification.error', { message: result.error || 'Unknown error' }));
        }
      } else {
        const errorMessage = 'Unable to vote while offline';
        showError(t('notification.error', { message: errorMessage }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(t('notification.error', { message: errorMessage }));
    }
    
    if (isOffline) {
      showInfo(t('notification.offline'));
    }
  }, [finalConfig.enableVoting, finalConfig.apiEndpoint, isOffline, t]);

  /**
   * Deletes feedback
   */
  const deleteFeedback = useCallback(async (id: string): Promise<void> => {
    try {
      let success = true;
      
      if (!isOffline && finalConfig.apiEndpoint) {
        const response = await fetch(`${finalConfig.apiEndpoint}/${id}`, {
          method: 'DELETE'
        });
        success = response.ok;
      }
      
      if (success) {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        showSuccess(t('notification.deleted'));
      } else {
        showError(t('notification.deleteError'));
      }
    } catch (error) {
      showError(t('notification.deleteError'));
    }
  }, [isOffline, finalConfig.apiEndpoint, t]);

  // Get categories from config
  const categories = useMemo(() => {
    return finalConfig.categories || DEFAULT_CATEGORIES || [];
  }, [finalConfig.categories]);

  // Memoized context values
  const feedbackContextValue: FeedbackContextValue = useMemo(() => ({
    config: finalConfig,
    isOpen,
    openModal,
    closeModal,
    submitFeedback,
    feedbacks,
    loading,
    error,
    isSubmitting,
    isOffline,
    syncOfflineFeedback,
    voteFeedback,
    deleteFeedback,
    categories
  }), [
    finalConfig,
    isOpen,
    openModal,
    closeModal,
    submitFeedback,
    feedbacks,
    loading,
    error,
    isSubmitting,
    isOffline,
    syncOfflineFeedback,
    voteFeedback,
    deleteFeedback,
    categories
  ]);

  const localizationContextValue: LocalLocalizationContextType = useMemo(() => ({
    t: (key: string, params?: Record<string, string | number>) => t(key, params),
    locale: finalConfig.localization?.locale || 'en',
    dir: getDirection(finalConfig.localization?.locale || 'en')
  }), [t, finalConfig.localization]);

  return (
    <LocalizationContext.Provider value={localizationContextValue}>
      <FeedbackContext.Provider value={feedbackContextValue}>
        {children}
      </FeedbackContext.Provider>
    </LocalizationContext.Provider>
  );
};

export default FeedbackProvider;
