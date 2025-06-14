/**
 * Core FeedbackProvider component with comprehensive feedback management
 * @module components/FeedbackProvider
 */
import React, { createContext, useState, ReactNode, useCallback, useEffect, useMemo } from "react";
import type { 
  FeedbackContextType, 
  Feedback, 
  FeedbackConfig, 
  FeedbackCategory, 
  LocalizationConfig 
} from "../types";
import { generateId, validateFeedback, handleApiResponse } from "../utils";
import { showError, showSuccess, showInfo } from "../utils/notifications";
import { 
  saveFeedbackOffline, 
  getFeedbackFromStorage, 
  removeFeedbackFromStorage,
  registerConnectivityListeners,
  isOffline as checkIsOffline
} from "../utils/offlineStorage";
import { defaultCategories } from "../utils/categories";
import { createTranslator, getDirection } from "../utils/localization";
import { processIntegrations, processVoteIntegrations } from "../utils/integrations";

/**
 * Context for feedback system functionality with type safety
 */
export const FeedbackContext = createContext<FeedbackContextType | undefined>(
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
 * Configuration properties for the FeedbackProvider component
 * @interface FeedbackProviderProps
 */
interface FeedbackProviderProps {
  /** Child components that will have access to the feedback context */
  children: ReactNode;
  /** Configuration options for the feedback system */
  config?: FeedbackConfig;
  /** Test-only properties for mocking behavior in test environments */
  _testProps?: {
    /** Initial feedback data for testing */
    initialFeedback?: Feedback[];
    /** Whether the modal should be open initially */
    modalOpen?: boolean;
    /** Disable network requests for testing */
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
export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  children,
  config = {},
  _testProps
}) => {
  // Core state management
  const [isModalOpen, setModalOpen] = useState(_testProps?.modalOpen || false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(_testProps?.initialFeedback || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(checkIsOffline());
  const [categories, setCategories] = useState<FeedbackCategory[]>(
    config.categories || defaultCategories
  );

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
  }, [config.enableOfflineSupport, config.apiEndpoint]);

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

  // Localization setup with memoized values for performance
  const localizationConfig: LocalizationConfig = config.localization || {};
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
   * Submits new feedback with validation, API integration, and error handling
   * @param message - The feedback message content
   * @param type - The type of feedback (bug, feature, improvement, other)
   * @param additionalData - Additional metadata to include with the feedback
   * @returns Promise that resolves when submission is complete
   */
  const submitFeedback = useCallback(
    async (
      message: string,
      type: Feedback["type"] = "other",
      additionalData: Record<string, any> = {}
    ): Promise<void> => {
      if (!message.trim()) {
        showError(t('validation.messageRequired'));
        return;
      }

      setIsSubmitting(true);

      try {
        const newFeedback: Feedback = {
          id: generateId(),
          message: message.trim(),
          type,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          ...additionalData
        };

        // Validate feedback before submission
        const validation = validateFeedback(newFeedback);
        if (!validation.isValid) {
          showError(validation.errors?.join(', ') || validation.error || 'Validation failed');
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

        // Process integrations if configured
        if (config.analytics || config.issueTracker || config.webhooks || config.notifications) {
          await processIntegrations(newFeedback, config);
        }

        showSuccess(t('notification.success'));
        closeModal();
      } catch (err) {
        showError(t('notification.error'));
        console.error('Error submitting feedback:', err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [config, closeModal, isOffline, t, _testProps]
  );

  /**
   * Handles voting on existing feedback with duplicate vote prevention
   * @param id - The ID of the feedback to vote on
   * @returns Promise that resolves when vote is processed
   */
  const voteFeedback = useCallback(
    async (id: string): Promise<void> => {
      if (!config.enableVoting) return;

      // Generate a simple voter ID if none exists
      const voterId = localStorage.getItem('feedback-voter-id') || 
        `voter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Store voter ID
      localStorage.setItem('feedback-voter-id', voterId);

      // Check if user has already voted
      const existingFeedback = feedbacks.find(f => f.id === id);
      if (!existingFeedback) return;
      
      if (existingFeedback.voters?.includes(voterId)) {
        setError(t('vote.alreadyVoted'));
        showInfo(t('vote.alreadyVoted'));
        return;
      }

      // Update local state optimistically
      setFeedbacks(prev => 
        prev.map(item => 
          item.id === id 
            ? { 
                ...item, 
                votes: (item.votes || 0) + 1,
                voters: [...(item.voters || []), voterId]
              } 
            : item
        )
      );

      // Process vote through integrations (e.g., analytics)
      processVoteIntegrations(id, config);

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
    },
    [config, isOffline, feedbacks, t]
  );

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
  const feedbackContextValue = useMemo<FeedbackContextType>(() => ({
    isOpen: isModalOpen,
    isModalOpen,
    feedbacks,
    openModal,
    closeModal,
    submitFeedback,
    isSubmitting,
    error,
    isOffline,
    syncOfflineFeedback,
    voteFeedback,
    categories,
    config
  }), [
    isModalOpen, 
    feedbacks, 
    openModal, 
    closeModal, 
    submitFeedback, 
    isSubmitting, 
    error, 
    isOffline, 
    syncOfflineFeedback, 
    voteFeedback, 
    categories,
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
