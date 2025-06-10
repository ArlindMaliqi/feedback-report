import React, { createContext, useState, ReactNode, useCallback } from "react";
import type { FeedbackContextType, Feedback, FeedbackConfig } from "../types";
import { generateId, validateFeedback, handleApiResponse } from "../utils";

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
 *
 * @example
 * ```typescript
 * function App() {
 *   const feedbackConfig = {
 *     apiEndpoint: '/api/feedback',
 *     collectUserAgent: true,
 *     collectUrl: true
 *   };
 *
 *   return (
 *     <FeedbackProvider config={feedbackConfig}>
 *       <YourAppComponents />
 *       <FeedbackButton />
 *       <FeedbackModal />
 *     </FeedbackProvider>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Must be placed higher in the component tree than any components using feedback hooks
 * - Handles local state management and API communication
 * - Provides optimistic UI updates for better user experience
 */
export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  children,
  config = {},
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setModalOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setError(null);
  }, []);

  const submitFeedback = useCallback(
    async (
      message: string,
      type: Feedback["type"] = "other"
    ): Promise<void> => {
      const validation = validateFeedback(message);
      if (!validation.isValid) {
        setError(validation.error || "Invalid feedback");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      let feedback: Feedback;
      try {
        feedback = {
          id: generateId(),
          message: message.trim(),
          timestamp: new Date(),
          type,
          ...(config.collectUserAgent && { userAgent: navigator.userAgent }),
          ...(config.collectUrl && { url: window.location.href }),
        };

        // Add to local state immediately for optimistic UI
        setFeedbacks((prev) => [feedback, ...prev]);

        // Submit to API if endpoint is configured
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
            // Remove from local state if API call failed
            setFeedbacks((prev) => prev.filter((f) => f.id !== feedback.id));
            setError(result.error || "Failed to submit feedback");
            return;
          }
        }

        // Success - close modal
        closeModal();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        // Remove from local state on error
        setFeedbacks((prev) => prev.filter((f) => f.id !== feedback.id));
      } finally {
        setIsSubmitting(false);
      }
    },
    [config, closeModal]
  );

  const value: FeedbackContextType = {
    isModalOpen,
    feedbacks,
    openModal,
    closeModal,
    submitFeedback,
    isSubmitting,
    error,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
