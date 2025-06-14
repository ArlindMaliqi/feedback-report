import React, { createContext, useState, ReactNode, useCallback, useEffect } from "react";
import type { FeedbackContextType, Feedback, FeedbackConfig, FeedbackCategory } from "../types";
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

export const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined
);

/**
 * Props for the FeedbackProvider component
 */
interface FeedbackProviderProps {
  /** Child components that will have access to the feedback context */
  children: ReactNode;
  /** Configuration options for the feedback system */
  config?: FeedbackConfig;
}

/**
 * Provider component that manages the feedback system state and functionality
 *
 * This component should wrap your entire application or the part of your app
 * where you want to enable feedback functionality. It provides the context
 * for all feedback-related components and hooks.
 *
 * @param props - Component props
 * @param props.children - Child components
 * @param props.config - Feedback system configuration
 */
export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  children,
  config = {},
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(checkIsOffline());
  const [categories, setCategories] = useState<FeedbackCategory[]>(
    config.categories || defaultCategories
  );

  // Load offline feedback on mount if enabled
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

  // Modal management
  const openModal = useCallback(() => {
    setModalOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setError(null);
  }, []);

  // Sync offline feedback when connection is restored
  const syncOfflineFeedback = useCallback(async (): Promise<void> => {
    if (!config.apiEndpoint || !config.enableOfflineSupport || isOffline) {
      return;
    }

    const pendingFeedback = feedbacks.filter(
      item => item.submissionStatus === 'pending'
    );

    if (pendingFeedback.length === 0) return;

    showInfo(`Syncing ${pendingFeedback.length} pending feedback items...`);

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
          showError(`Failed to sync feedback: ${result.error}`);
          console.error('Failed to sync feedback:', result.error);
          continue;
        }

        // Remove from offline storage if successfully synced
        removeFeedbackFromStorage(feedback.id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        showError(`Error syncing feedback: ${errorMessage}`);
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
    
    showSuccess('Feedback synchronization complete');
  }, [config.apiEndpoint, config.enableOfflineSupport, feedbacks, isOffline]);

  // Submit new feedback
  const submitFeedback = useCallback(
    async (
      message: string,
      type: Feedback["type"] = "other",
      additionalData: Record<string, any> = {}
    ): Promise<void> => {
      const validation = validateFeedback(message);
      if (!validation.isValid) {
        setError(validation.error || "Invalid feedback");
        showError(validation.error || "Invalid feedback");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      // Define feedback variable with proper initialization to fix TS2454 error
      const feedback: Feedback = {
        id: generateId(),
        message: message.trim(),
        timestamp: new Date(),
        type,
        ...(config.collectUserAgent && { userAgent: navigator.userAgent }),
        ...(config.collectUrl && { url: window.location.href }),
        // Include additional data from the template and attachments
        ...additionalData,
        // Set initial vote count if voting is enabled
        ...(config.enableVoting && { votes: 0, voters: [] }),
        // For expanded categorization
        ...(config.useExpandedCategories && additionalData.category && {
          category: additionalData.category,
          subcategory: additionalData.subcategory
        })
      };

      try {
        // Add to local state immediately for optimistic UI
        setFeedbacks((prev) => [feedback, ...prev]);

        // If offline and offline support is enabled, store locally
        if (isOffline && config.enableOfflineSupport) {
          const feedbackWithStatus = { 
            ...feedback, 
            submissionStatus: 'pending' as const 
          };
          saveFeedbackOffline(feedbackWithStatus);
          showInfo('Feedback saved locally and will be submitted when you\'re back online');
          closeModal();
          setIsSubmitting(false);
          return;
        }

        // Submit to API if endpoint is configured and online
        if (config.apiEndpoint) {
          const response = await fetch(config.apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(feedback),
          });

          const result = await handleApiResponse(response);
          if (!result.success) {
            // Store offline if API call failed and offline support is enabled
            if (config.enableOfflineSupport) {
              const feedbackWithStatus = { 
                ...feedback, 
                submissionStatus: 'pending' as const 
              };
              saveFeedbackOffline(feedbackWithStatus);
              showInfo('Feedback saved locally due to API error and will be submitted later');
            } else {
              // Remove from local state if API call failed and no offline support
              setFeedbacks((prev) => prev.filter((f) => f.id !== feedback.id));
              setError(result.error || "Failed to submit feedback");
              showError(result.error || "Failed to submit feedback");
              return;
            }
          } else {
            showSuccess('Feedback submitted successfully!');
          }
        } else {
          // If no API endpoint, just show success for local storage
          showSuccess('Feedback recorded successfully');
        }

        // Success - close modal
        closeModal();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        showError(errorMessage);
        
        // Store offline if error and offline support is enabled
        if (config.enableOfflineSupport) {
          const feedbackWithStatus = { 
            ...feedback, 
            submissionStatus: 'pending' as const 
          };
          saveFeedbackOffline(feedbackWithStatus);
          closeModal();
        } else {
          // Remove from local state on error if no offline support
          setFeedbacks((prev) => prev.filter((f) => f.id !== feedback.id));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [config, closeModal, isOffline]
  );

  // Vote on existing feedback
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
        setError("You have already voted for this feedback");
        showInfo("You have already voted for this feedback");
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
            showError(result.error || "Failed to record vote");
          } else {
            showSuccess('Vote recorded successfully');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
          showError(`Error voting for feedback: ${errorMessage}`);
          console.error('Error voting for feedback:', err);
          // Leave the vote in place even if API call fails
          // The vote will be in local state and can be synced later
        }
      } else if (isOffline) {
        showInfo('Your vote has been recorded locally and will sync when you\'re back online');
      }
    },
    [config.enableVoting, config.apiEndpoint, isOffline, feedbacks]
  );

  const value: FeedbackContextType = {
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
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
