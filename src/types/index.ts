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

/**
 * Styling options for the feedback modal overlay
 */
export interface FeedbackModalOverlayStyles {
  /** Background color of the overlay (default: "rgba(0, 0, 0, 0.5)") */
  backgroundColor?: string;
  /** Z-index of the overlay (default: 1000) */
  zIndex?: number;
}

/**
 * Styling options for the feedback modal content container
 */
export interface FeedbackModalContentStyles {
  /** Background color of the modal (default: "white") */
  backgroundColor?: string;
  /** Padding inside the modal (default: "2rem") */
  padding?: string;
  /** Border radius of the modal (default: "8px") */
  borderRadius?: string;
  /** Width of the modal (default: "90%") */
  width?: string;
  /** Maximum width of the modal (default: "500px") */
  maxWidth?: string;
  /** Box shadow of the modal (default: "0 4px 20px rgba(0, 0, 0, 0.15)") */
  boxShadow?: string;
  /** Font family for the modal content */
  fontFamily?: string;
}

/**
 * Styling options for form elements
 */
export interface FeedbackModalFormStyles {
  /** Input field border color (default: "#ccc") */
  inputBorderColor?: string;
  /** Input field border radius (default: "4px") */
  inputBorderRadius?: string;
  /** Input field padding (default: "0.5rem") */
  inputPadding?: string;
  /** Input field focus color */
  inputFocusColor?: string;
  /** Label color (default: inherit) */
  labelColor?: string;
  /** Label font weight (default: inherit) */
  labelFontWeight?: string;
}

/**
 * Styling options for buttons
 */
export interface FeedbackModalButtonStyles {
  /** Primary button background color (default: "#007bff") */
  primaryBackgroundColor?: string;
  /** Primary button text color (default: "white") */
  primaryTextColor?: string;
  /** Primary button hover background color */
  primaryHoverBackgroundColor?: string;
  /** Secondary button background color (default: "white") */
  secondaryBackgroundColor?: string;
  /** Secondary button text color (default: "inherit") */
  secondaryTextColor?: string;
  /** Secondary button border color (default: "#ccc") */
  secondaryBorderColor?: string;
  /** Button border radius (default: "4px") */
  buttonBorderRadius?: string;
  /** Button padding (default: "0.75rem 1.5rem") */
  buttonPadding?: string;
  /** Disabled button background color (default: "#ccc") */
  disabledBackgroundColor?: string;
  /** Disabled button text color (default: "white") */
  disabledTextColor?: string;
}

/**
 * Styling options for error messages
 */
export interface FeedbackModalErrorStyles {
  /** Error text color (default: "#d73a49") */
  textColor?: string;
  /** Error background color (default: "#ffeef0") */
  backgroundColor?: string;
  /** Error border color (default: "#fdaeb7") */
  borderColor?: string;
  /** Error border radius (default: "4px") */
  borderRadius?: string;
  /** Error padding (default: "0.75rem") */
  padding?: string;
}

/**
 * Complete styling configuration for the feedback modal
 */
export interface FeedbackModalStyles {
  /** Overlay styling options */
  overlay?: FeedbackModalOverlayStyles;
  /** Modal content styling options */
  content?: FeedbackModalContentStyles;
  /** Form elements styling options */
  form?: FeedbackModalFormStyles;
  /** Button styling options */
  buttons?: FeedbackModalButtonStyles;
  /** Error message styling options */
  error?: FeedbackModalErrorStyles;
  /** Custom CSS class name for the modal */
  className?: string;
  /** Custom CSS class name for the overlay */
  overlayClassName?: string;
}