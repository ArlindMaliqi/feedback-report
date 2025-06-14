/**
 * Performance-optimized FeedbackProvider with lazy loading capabilities
 * @module components/OptimizedFeedbackProvider
 */
import React, { 
  useState, 
  ReactNode, 
  useCallback, 
  useEffect, 
  useMemo
} from "react";
import type { 
  FeedbackContextType, 
  Feedback, 
  FeedbackConfig
} from "../types";
import { generateId, validateFeedback, handleApiResponse } from "../utils";
import { showError, showSuccess } from "../utils/notifications";
import { defaultCategories } from "../utils/categories";
import { createTranslator, getDirection } from "../utils/localization";
import { SSRSafeComponent } from "../core/SSRSafeComponent";
import { FeedbackContext, LocalizationContext, LocalizationContextType } from "../contexts/FeedbackContext";

/**
 * Configuration properties for the OptimizedFeedbackProvider component
 * @interface OptimizedFeedbackProviderProps
 */
interface OptimizedFeedbackProviderProps {
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
 * Enhanced FeedbackProvider with performance optimizations and dynamic loading
 * 
 * This provider includes:
 * - Lazy loading of heavy components and integrations
 * - SSR compatibility for server-side rendering
 * - Bundle size optimization through dynamic imports
 * - Intelligent loading of features based on configuration
 * - Memory-efficient state management
 * 
 * @param props - Provider configuration properties
 * @returns Enhanced feedback provider with performance optimizations
 * 
 * @example
 * ```tsx
 * <OptimizedFeedbackProvider config={{ apiEndpoint: '/api/feedback' }}>
 *   <App />
 * </OptimizedFeedbackProvider>
 * ```
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
  const [isOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lazy loading state for integrations
  const [integrationsLoaded, setIntegrationsLoaded] = useState(false);
  const [integrationModules, setIntegrationModules] = useState<{
    processIntegrations?: any;
    processVoteIntegrations?: any;
  }>({});

  /**
   * Localization setup with memoized translator function
   */
  const translator = useMemo(() => createTranslator(config.localization), [config.localization]);
  const t = useCallback((key: string, values?: Record<string, any>) => 
    translator(key, values), [translator]);

  /**
   * Opens the feedback modal
   */
  const openModal = useCallback(() => setIsOpen(true), []);
  
  /**
   * Closes the feedback modal
   */
  const closeModal = useCallback(() => setIsOpen(false), []);

  /**
   * Dynamically loads integration modules when needed to optimize initial bundle size
   * @returns Promise that resolves when integrations are loaded
   */
  const loadIntegrations = useCallback(async () => {
    if (integrationsLoaded || 
        (!config.analytics && !config.issueTracker && !config.webhooks && !config.notifications)) {
      return;
    }

    try {
      const integrationsModule = await import('../utils/integrations');
      setIntegrationModules({
        processIntegrations: integrationsModule.processIntegrations,
        processVoteIntegrations: integrationsModule.processVoteIntegrations,
      });
      setIntegrationsLoaded(true);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    }
  }, [config, integrationsLoaded]);

  /**
   * Effect to load integrations when configuration changes
   */
  useEffect(() => {
    if (config.analytics || config.issueTracker || config.webhooks || config.notifications) {
      void loadIntegrations();
    }
  }, [config, loadIntegrations]);

  /**
   * Synchronizes offline feedback when connection is restored
   * @returns Promise that resolves when sync is complete
   */
  const syncOfflineFeedback = useCallback(async (): Promise<void> => {
    if (isOffline) {
      // Sync logic implementation would go here
      console.log('Syncing offline feedback...');
    }
  }, [isOffline]);

  /**
   * Gets feedback categories from configuration or uses defaults
   */
  const categories = useMemo(() => {
    return config.categories || defaultCategories || [];
  }, [config.categories]);

  /**
   * Submits feedback with validation, API integration, and error handling
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
        const errorMsg = t('validation.messageRequired');
        setError(errorMsg);
        showError(errorMsg);
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const feedback: Feedback = {
          id: generateId(),
          message: message.trim(),
          type,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          ...additionalData
        };

        // Validate feedback before submission
        const validation = validateFeedback(feedback);
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
            body: JSON.stringify(feedback)
          });

          await handleApiResponse(response);
        }

        // Update local state
        setFeedbacks(prev => [feedback, ...prev]);

        // Process integrations if loaded and configured
        if (integrationModules.processIntegrations && 
            (config.analytics || config.issueTracker || config.webhooks || config.notifications)) {
          await integrationModules.processIntegrations(feedback, config);
        }

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
    [config, closeModal, isOffline, t, integrationModules, _testProps]
  );

  /**
   * Handles voting on existing feedback with integration support
   * @param id - The ID of the feedback to vote on
   * @returns Promise that resolves when vote is processed
   */
  const voteFeedback = useCallback(
    async (id: string): Promise<void> => {
      if (!config.enableVoting) return;

      try {
        // Process vote through integrations if loaded
        if (integrationModules.processVoteIntegrations) {
          await integrationModules.processVoteIntegrations(id, config);
        }

        // Update local state optimistically
        setFeedbacks(prev => 
          prev.map(feedback => 
            feedback.id === id 
              ? { ...feedback, votes: (feedback.votes || 0) + 1 }
              : feedback
          )
        );

        showSuccess(t('notification.voted'));
      } catch (error) {
        showError(t('notification.voteError'));
      }
    },
    [config, isOffline, feedbacks, t, integrationModules]
  );

  /**
   * Memoized feedback context value to prevent unnecessary re-renders
   */
  const feedbackContextValue: FeedbackContextType = useMemo(() => ({
    feedbacks,
    isOpen,
    isModalOpen: isOpen,
    isSubmitting,
    isOffline,
    error,
    openModal,
    closeModal,
    submitFeedback,
    voteFeedback,
    syncOfflineFeedback,
    categories,
    config
  }), [feedbacks, isOpen, isSubmitting, isOffline, error, openModal, closeModal, submitFeedback, voteFeedback, syncOfflineFeedback, categories, config]);

  /**
   * Memoized localization context value with text direction support
   */
  const localizationContextValue: LocalizationContextType = useMemo(() => ({
    t,
    locale: config.localization?.locale || 'en',
    direction: getDirection(config.localization?.locale || 'en')
  }), [t, config.localization]);

  return (
    <SSRSafeComponent>
      <LocalizationContext.Provider value={localizationContextValue}>
        <FeedbackContext.Provider value={feedbackContextValue}>
          {children}
        </FeedbackContext.Provider>
      </LocalizationContext.Provider>
    </SSRSafeComponent>
  );
};

export default OptimizedFeedbackProvider;
