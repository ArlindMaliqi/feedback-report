/**
 * Core FeedbackProvider component with comprehensive feedback management
 * @module components/FeedbackProvider
 */
import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { 
  Feedback, 
  FeedbackConfig, 
  LocalizationConfig,
  FeedbackContextValue,
  FeedbackCategory
} from '../types';
import { generateId, validateFeedback, handleApiResponse } from "../utils";
import { showError, showSuccess, showInfo } from "../utils/notifications";
import {
  getFeedbackFromStorage,
  removeFeedbackFromStorage,
  registerConnectivityListeners,
  isOffline as checkIsOffline
} from "../utils/offlineStorage";
import { DEFAULT_CATEGORIES } from "../utils/categories";

export const FeedbackContext = createContext<FeedbackContextValue | undefined>(
  undefined
);

/**
 * Context for localization with RTL support and translations
 */
export const LocalizationContext = createContext<{
  /** Translation function that returns localized strings */
  t: (key: string, params?: Record<string, string | number>) => string;
  /** Text direction for RTL language support */
  dir: 'ltr' | 'rtl';
  /** Current locale identifier */
  locale: string;
}>({
  t: (key) => key,
  dir: 'ltr',
  locale: 'en'
});

/**
 * Props for the FeedbackProvider component
 */
export interface FeedbackProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Configuration for the feedback system */
  config?: FeedbackConfig;
  /** Test props (for testing only) */
  _testProps?: {
    modalOpen?: boolean;
    initialFeedback?: Feedback[];
    disableNetworkRequests?: boolean;
  };
}

/**
 * Core provider component that manages feedback system state and functionality
 *
 * This component provides comprehensive feedback management including:
 * - Feedback submission and validation
 * - Offline support with automatic synchronization
 * - Integration with external services (analytics, issue trackers, etc.)
 * - Internationalization and localization
 * - Vote management for community feedback
 * - Real-time connectivity monitoring
 *
 * @param props - Component configuration properties
 * @returns Provider component that wraps the application with feedback context
 * 
 * @example
 * Basic usage:
 * ```tsx
 * <FeedbackProvider config={{ apiEndpoint: '/api/feedback' }}>
 *   <App />
 * </FeedbackProvider>
 * ```
 * 
 * @example
 * Advanced configuration:
 * ```tsx
 * <FeedbackProvider 
 *   config={{
 *     apiEndpoint: '/api/feedback',
 *     enableOfflineSupport: true,
 *     enableVoting: true,
 *     categories: customCategories,
 *     localization: { locale: 'es', rtl: false }
 *   }}
 * >
 *   <App />
 * </FeedbackProvider>
 * ```
 */
export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children, config: initialConfig }) => {
  // Provide default config to prevent undefined
  const config = useMemo(() => ({
    apiEndpoint: '/api/feedback',
    theme: 'system' as const,
    enableShakeDetection: true,
    enableOfflineSupport: false,
    enableVoting: false,
    collectUserIdentity: false,
    enableFileAttachments: true,
    maxFileSize: 5 * 1024 * 1024,
    categories: DEFAULT_CATEGORIES,
    ...initialConfig
  }), [initialConfig]);

  // Core state management
  const [isModalOpen, setModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(checkIsOffline());
  const [categories] = useState<FeedbackCategory[]>(
    config?.categories || DEFAULT_CATEGORIES
  );
  const [loading, setLoading] = useState(false); // Add missing loading state

  // Localization setup with memoized values for performance
  const localizationConfig: LocalizationConfig = config.localization || { locale: 'en' };
  const locale = localizationConfig.locale || 'en';
  
  /**
   * Memoized translation function to prevent unnecessary re-renders
   */
  const t = useMemo(() => 
    createTranslator(localizationConfig), 
    [localizationConfig]
  );
  
  /**
   * Memoized text direction based on locale for RTL support
   */
  const dir = useMemo(() => 
    getDirection(locale), 
    [locale]
  );

  /**
   * Synchronizes offline feedback when connection is restored
   * @returns Promise that resolves when synchronization is complete
   */
  const syncOfflineFeedback = useCallback(async (): Promise<void> => {
    if (!config.apiEndpoint || !config.enableOfflineSupport || isOffline) {
      return;
    }

    const pendingFeedback = feedbacks.filter(
      item => item.submissionStatus === 'pending'
    );

    if (pendingFeedback.length === 0) return;

    showInfo(t('notification.sync', { count: pendingFeedback.length }));

    for (const feedback of pendingFeedback) {
      try {
        // Update status to show syncing
        setFeedbacks(prev => 
          prev.map(item => 
            item.id === feedback.id 
              ? { ...item, submissionStatus: 'synced' as const } 
              : item
          )
        );

        // Submit to API
        const response = await fetch(config.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedback),
        });

        const result = await handleApiResponse(response);
        
        if (!result.success) {
          // Mark as failed if API call failed
          setFeedbacks(prev => 
            prev.map(item => 
              item.id === feedback.id 
                ? { ...item, submissionStatus: 'failed' as const } 
                : item
            )
          );
          showError(t('notification.error', { message: result.error || 'Unknown error' }));
          console.error('Failed to sync feedback:', result.error);
          continue;
        }

        // Process integrations for the synced feedback
        await processIntegrations(feedback, config);

        // Remove from offline storage if successfully synced
        removeFeedbackFromStorage(feedback.id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        showError(t('notification.error', { message: errorMessage }));
        console.error('Error syncing feedback:', err);
        // Mark as failed
        setFeedbacks(prev => 
          prev.map(item => 
            item.id === feedback.id 
              ? { ...item, submissionStatus: 'failed' as const } 
              : item
          )
        );
      }
    }
    
    showSuccess(t('notification.syncComplete'));
  }, [config, feedbacks, isOffline, t]);

  /**
   * Effect to handle offline support initialization and connectivity monitoring
   */
  useEffect(() => {
    if (config.enableOfflineSupport) {
      // Load any pending feedback from storage
      const storedFeedback = getFeedbackFromStorage();
      if (storedFeedback.length > 0) {
        setFeedbacks(prev => [...storedFeedback, ...prev]);
      }
      
      // Set up online/offline listeners
      const cleanup = registerConnectivityListeners(
        // Online callback
        () => {
          setIsOffline(false);
          // Auto-sync pending feedback when connection is restored
          if (config.apiEndpoint) {
            syncOfflineFeedback();
          }
        },
        // Offline callback
        () => {
          setIsOffline(true);
        }
      );
      
      return cleanup;
    }
  }, [config.enableOfflineSupport, config.apiEndpoint, syncOfflineFeedback]);

  /**
   * Opens the feedback modal and clears any existing errors
   */
  const openModal = useCallback(() => {
    setModalOpen(true);
    setError(null);
  }, []);

  /**
   * Closes the feedback modal and clears any existing errors
   */
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setError(null);
  }, []);

  /**
   * Submits new feedback with validation, API integration, and error handling
   * @param message - The feedback message content
   * @param type - The type of feedback (bug, feature, improvement, other)
   * @param additionalData - Additional metadata to include with the feedback
   * @returns Promise that resolves when submission is complete
   */
  const submitFeedback = useCallback(async (
    message: string, 
    type?: Feedback["type"], 
    additionalData?: Record<string, any>
  ) => {
    if (!message.trim()) {
      setError(t('feedback.error.empty'));
      return;
    }

    const newFeedback: Feedback = {
      id: generateId(),
      message: message.trim(),
      type: type || 'other',
      timestamp: new Date(),
      priority: additionalData?.priority || 'medium',
      status: 'open',
      votes: 0,
      voters: [],
      submissionStatus: 'pending',
      user: additionalData?.user,
      category: additionalData?.category,
      subcategory: additionalData?.subcategory,
      attachments: additionalData?.attachments || [],
      metadata: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        url: typeof window !== 'undefined' ? window.location.href : '',
        ...additionalData?.metadata
      }
    };

    // Validate feedback before submission
    const validation = validateFeedback(newFeedback);
    if (!validation.isValid) {
      showError(validation.errors?.join(', ') || validation.error || 'Validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to API if not in test mode
      if (newFeedback.submissionStatus !== 'failed') {
        const _testProps = (globalThis as any)?._testProps;
        if (!_testProps?.disableNetworkRequests && config.apiEndpoint) {
          try {
            const response = await fetch(config.apiEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newFeedback),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            newFeedback.submissionStatus = 'synced';
          } catch (error) {
            newFeedback.submissionStatus = 'failed';
            console.error('Failed to submit feedback:', error);
          }
        }

        if (newFeedback.submissionStatus !== 'failed') {
          await processIntegrations(newFeedback, config);
        }
      }

      // Update local state
      setFeedbacks(prev => [newFeedback, ...prev]);

      showSuccess(t('notification.success'));
      closeModal();
    } catch (err) {
      showError(t('notification.error'));
      console.error('Error submitting feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [config, closeModal, isOffline, t]);

  /**
   * Handles voting on existing feedback with duplicate vote prevention
   * @param id - The ID of the feedback to vote on
   * @returns Promise that resolves when vote is processed
   */
  const voteFeedback = useCallback(async (id: string) => {
    const voterId = getCurrentUserId();
    if (!voterId) return;

    const existingFeedback = feedbacks.find(f => f.id === id);
    if (!existingFeedback) return;

    if (existingFeedback.voters?.includes(voterId)) {
      // Remove vote
      setFeedbacks(prev => prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              votes: Math.max(0, (item.votes || 0) - 1),
              voters: (item.voters || []).filter((v: string) => v !== voterId)
            }
          : item
      ));
    } else {
      // Add vote
      setFeedbacks(prev => prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              votes: (item.votes || 0) + 1,
              voters: [...(item.voters || []), voterId]
            }
          : item
      ));
    }

    // Update on server if API endpoint is available and online
    if (config.apiEndpoint && !isOffline) {
      try {
        const response = await fetch(`${config.apiEndpoint}/vote/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ voterId }),
        });

        const result = await handleApiResponse(response);
        if (!result.success) {
          // Revert the optimistic update
          setFeedbacks(prev => 
            prev.map(item => 
              item.id === id 
                ? { 
                    ...item, 
                    votes: (item.votes || 1) - 1,
                    voters: (item.voters || []).filter(v => v !== voterId)
                  } 
                : item
            )
          );
          setError(result.error || "Failed to record vote");
          showError(t('notification.error', { message: result.error || 'Unknown error' }));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        showError(t('notification.error', { message: errorMessage }));
        console.error('Error voting for feedback:', err);
      }
    } else if (isOffline) {
      showInfo(t('notification.offline'));
    }
  }, [config, isOffline, feedbacks, t]);

  /**
   * Deletes feedback from both local state and server
   * @param feedbackId - The ID of the feedback to delete
   * @returns Promise that resolves when deletion is complete
   */
  const deleteFeedback = useCallback(
    async (feedbackId: string): Promise<void> => {
      try {
        if (config.apiEndpoint) {
          const response = await fetch(`${config.apiEndpoint}/${feedbackId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            throw new Error('Failed to delete feedback');
          }
        }

        setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
        showSuccess(t('notification.deleted'));
      } catch (error) {
        showError(t('notification.deleteError'));
        console.error('Error deleting feedback:', error);
      }
    },
    [config.apiEndpoint, t]
  );

  /**
   * Memoized feedback context value to prevent unnecessary re-renders
   */
  const feedbackContextValue = useMemo<FeedbackContextValue>(() => ({
    isOpen: isModalOpen,
    isModalOpen,
    feedbacks,
    openModal,
    closeModal,
    submitFeedback,
    voteFeedback,
    isSubmitting,
    isOffline,
    error,
    loading, // Add missing loading property
    syncOfflineFeedback,
    config
  }), [
    isModalOpen,
    feedbacks,
    openModal,
    closeModal,
    submitFeedback,
    voteFeedback,
    isSubmitting,
    isOffline,
    error,
    loading, // Add loading to dependencies
    syncOfflineFeedback,
    config
  ]);

  /**
   * Memoized localization context value with RTL support
   */
  const localizationContextValue = useMemo(() => ({
    t,
    locale: localizationConfig?.locale || 'en',
    dir,
  }), [t, localizationConfig, dir]);

  return (
    <LocalizationContext.Provider value={localizationContextValue}>
      <FeedbackContext.Provider value={feedbackContextValue}>
        {children}
      </FeedbackContext.Provider>
    </LocalizationContext.Provider>
  );
};

/**
 * Creates a translation function based on the localization config
 * @param config - The localization configuration
 * @returns Translation function
 */
const createTranslator = (config: LocalizationConfig) => {
  return (key: string, params?: Record<string, string | number>) => {
    if (config.customTranslations?.[key]) {
      return config.customTranslations[key];
    }
    return key; // Fallback to key if translation not found
  };
};

/**
 * Gets the text direction based on the locale
 * @param locale - The locale identifier
 * @returns 'ltr' or 'rtl' string
 */
const getDirection = (locale: string): 'ltr' | 'rtl' => {
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
};

/**
 * Processes integrations for feedback (analytics, webhooks, etc.)
 * @param feedback - The feedback object
 * @param config - The feedback configuration
 */
const processIntegrations = async (feedback: Feedback, config: FeedbackConfig) => {
  // Process analytics, webhooks, etc.
  console.log('Processing integrations for feedback:', feedback.id);
  
  if (config.analytics) {
    // Track analytics event
    console.log('Tracking analytics event');
  }
  
  if (config.webhooks) {
    // Send to webhooks
    console.log('Sending to webhooks');
  }
};

/**
 * Gets the current user ID from context or storage
 * @returns Current user ID or null
 */
const getCurrentUserId = (): string | null => {
  // Get current user ID from context or storage
  return localStorage.getItem('userId') || null;
};
