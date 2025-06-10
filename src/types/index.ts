/**
 * Represents a feedback entry submitted by a user
 */
export interface Feedback {
  /** Unique identifier for the feedback */
  id: string;
  /** The feedback message content */
  message: string;
  /** When the feedback was submitted */
  timestamp: Date;
  /** Category of the feedback */
  type?: 'bug' | 'feature' | 'improvement' | 'other';
  /** User's browser user agent string (if collection is enabled) */
  userAgent?: string;
  /** URL where the feedback was submitted from (if collection is enabled) */
  url?: string;
}

/**
 * Context type for the feedback system
 */
export interface FeedbackContextType {
  /** Whether the feedback modal is currently open */
  isModalOpen: boolean;
  /** Array of all submitted feedback entries */
  feedbacks: Feedback[];
  /** Function to open the feedback modal */
  openModal: () => void;
  /** Function to close the feedback modal */
  closeModal: () => void;
  /** Function to submit new feedback */
  submitFeedback: (message: string, type?: Feedback['type']) => Promise<void>;
  /** Whether feedback is currently being submitted */
  isSubmitting: boolean;
  /** Current error message, if any */
  error: string | null;
}

/**
 * Configuration options for the feedback system
 */
export interface FeedbackConfig {
  /** API endpoint to submit feedback to. If not provided, feedback is stored locally only */
  apiEndpoint?: string;
  /** Whether to enable shake detection for opening feedback modal */
  enableShakeDetection?: boolean;
  /** Sensitivity threshold for shake detection (default: 15) */
  shakeThreshold?: number;
  /** Timeout between shake detections in milliseconds (default: 1000) */
  shakeTimeout?: number;
  /** Whether to automatically collect user agent information */
  collectUserAgent?: boolean;
  /** Whether to automatically collect the current URL */
  collectUrl?: boolean;
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  /** Whether the API call was successful */
  success: boolean;
  /** Response data on success */
  data?: T;
  /** Error message on failure */
  error?: string;
  /** Additional message from the API */
  message?: string;
}