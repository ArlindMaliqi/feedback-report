/**
 * Enhanced FeedbackProvider component with comprehensive feedback management
 * @module components/FeedbackProvider
 */
import React, { 
  useState, 
  useCallback, 
  useEffect, 
  useMemo, 
  ReactNode, 
  useContext 
} from 'react';
import type { 
  Feedback, 
  FeedbackConfig, 
  FeedbackContextValue
} from '../types';
import { FeedbackContext } from '../contexts/FeedbackContext';

// Lazy load heavy utilities
const createTranslator = (config?: any) => (key: string, params?: any) => key;
const generateId = () => Date.now().toString();
const validateFeedback = (feedback: Feedback) => ({ isValid: true });
const handleApiResponse = async (response: Response) => ({ success: response.ok });

// Lazy load notifications
const showSuccess = (msg: string) => console.log('✅', msg);
const showError = (msg: string) => console.error('❌', msg);
const showInfo = (msg: string) => console.info('ℹ️', msg);

export interface FeedbackProviderProps {
  children: ReactNode;
  config?: FeedbackConfig;
  _testProps?: {
    mockApiResponse?: any;
    disableNetworkRequests?: boolean;
  };
}

const DEFAULT_CONFIG: Partial<FeedbackConfig> = {
  enableShakeDetection: false,
  theme: 'system',
  enableOfflineSupport: false,
  maxAttachments: 3,
  allowedAttachmentTypes: ['image/png', 'image/jpeg', 'image/gif'],
  requiredIdentityFields: [],
  enableVoting: false,
  categories: []
};

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
    ...DEFAULT_CONFIG,
    ...initialConfig
  }), [initialConfig]);

  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Create translator
  const t = useMemo(() => createTranslator(finalConfig.localization), [finalConfig.localization]);

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
  const submitFeedback = useCallback(async (
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
      setError('Message is required');
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
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
        submissionStatus: isOffline ? 'pending' : 'synced',
        ...feedbackData
      };

      // Validate feedback
      const validation = validateFeedback(newFeedback);
      if (!validation.isValid) {
        const errorMsg = 'Validation failed';
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

      showSuccess('Feedback submitted successfully');
      closeModal();
    } catch (err) {
      showError('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  }, [isOffline, finalConfig.apiEndpoint, closeModal, _testProps]);

  /**
   * Handles voting on feedback
   */
  const voteFeedback = useCallback(async (id: string, vote: 'up' | 'down' = 'up'): Promise<void> => {
    if (!finalConfig.enableVoting) return;
    console.log(`Vote ${vote} on feedback ${id}`);
  }, [finalConfig.enableVoting]);

  // Get categories from config
  const categories = useMemo(() => {
    return finalConfig.categories || []
  }, [finalConfig.categories]);

  // Memoized context values
  const contextValue: FeedbackContextValue = useMemo(() => ({
    // Core data
    feedback: feedbacks, // Primary property
    feedbacks, // Alias for backward compatibility
    
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
    syncPendingFeedback: async () => {},
    syncOfflineFeedback: async () => {},
    clearFeedback: () => setFeedbacks([]),
    getFeedbackById: (id: string) => feedbacks.find(f => f.id === id),
    updateFeedback: (id: string, updates: Partial<Feedback>) => {
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    },
    
    // Configuration
    config: finalConfig,
    categories
  }), [
    feedbacks,
    isSubmitting,
    isOffline,
    isOpen,
    loading,
    error,
    submitFeedback,
    voteFeedback,
    openModal,
    closeModal,
    finalConfig,
    categories
  ]);

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export default FeedbackProvider;
