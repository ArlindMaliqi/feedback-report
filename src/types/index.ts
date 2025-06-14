/**
 * Represents a feedback entry submitted by a user
 */
export interface Feedback {
  /** Unique identifier for the feedback */
  id: string;
  /** The feedback message content */
  message: string;
  /** When the feedback was submitted */
  timestamp: number; // Changed from Date to number
  /** Category of the feedback */
  type?: 'bug' | 'feature' | 'improvement' | 'other';
  /** User's browser user agent string (if collection is enabled) */
  userAgent?: string;
  /** URL where the feedback was submitted from (if collection is enabled) */
  url?: string;
  /** Attached files (if any) */
  attachments?: FeedbackAttachment[];
  /** User identity information (if collected) */
  user?: UserIdentity;
  /** Detailed category information */
  category?: string;
  /** Subcategory for more specific classification */
  subcategory?: string;
  /** Number of votes/upvotes this feedback has received */
  votes?: number;
  /** List of unique identifiers for users who have voted */
  voters?: string[];
  /** Submission status for tracking offline submissions */
  submissionStatus?: 'pending' | 'synced' | 'failed';
  /** Additional data captured from custom templates */
  [key: string]: any;
}

/**
 * Context type for feedback functionality
 */
export interface FeedbackContextType {
  /** Array of all submitted feedback entries */
  feedbacks: Feedback[];
  /** Whether the feedback modal is currently open */
  isOpen: boolean;
  /** Whether the feedback modal is currently open */
  isModalOpen: boolean;
  /** Function to open the feedback modal */
  openModal: () => void;
  /** Function to close the feedback modal */
  closeModal: () => void;
  /** Function to submit new feedback */
  submitFeedback: (
    message: string, 
    type?: Feedback['type'], 
    additionalData?: Record<string, any>
  ) => Promise<void>;
  /** Function to upvote existing feedback */
  voteFeedback: (id: string) => Promise<void>;
  /** Whether feedback is currently being submitted */
  isSubmitting: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Whether feedback system is in offline mode */
  isOffline: boolean;
  /** Function to attempt syncing offline feedback */
  syncOfflineFeedback: () => Promise<void>;
  /** All available feedback categories */
  categories: FeedbackCategory[];
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
  /** Theme preference override ('light', 'dark', or 'system') */
  theme?: ThemePreference;
  /** Whether to use animations for modal transitions */
  useAnimations?: boolean;
  /** Animation timing in milliseconds */
  animationDuration?: number;
  /** Template to use for feedback collection */
  template?: FeedbackTemplate;
  /** Whether to enable file attachments */
  enableAttachments?: boolean;
  /** Maximum number of attachments allowed */
  maxAttachments?: number;
  /** Maximum size of each attachment in bytes */
  maxAttachmentSize?: number;
  /** Allowed file types for attachments */
  allowedAttachmentTypes?: string[];
  /** Whether to collect user identity information */
  collectUserIdentity?: boolean;
  /** Required identity fields */
  requiredIdentityFields?: Array<keyof UserIdentity>;
  /** Whether to store identity information in local storage */
  rememberUserIdentity?: boolean;
  /** Whether to enable offline support */
  enableOfflineSupport?: boolean;
  /** Whether to enable voting on feedback items */
  enableVoting?: boolean;
  /** Whether to use expanded categories */
  useExpandedCategories?: boolean;
  /** Custom categories configuration */
  categories?: FeedbackCategory[];
  
  /** Analytics integration configuration */
  analytics?: AnalyticsConfig;
  
  /** Issue tracker integration configuration */
  issueTracker?: AnyIssueTrackerConfig;
  
  /** Webhook integration configuration */
  webhooks?: WebhookConfig[];
  
  /** Chat platform notifications configuration */
  notifications?: NotificationConfig;
  
  /** Localization configuration */
  localization?: LocalizationConfig;
  
  /** Flag to indicate test environment (not for production use) */
  isTestEnvironment?: boolean;
  
  /** Flag to disable network requests (useful for testing) */
  disableNetworkRequests?: boolean;
  
  /** Additional data to include with all feedback submissions */
  additionalData?: Record<string, any>;
}

/**
 * Analytics integration configuration
 */
export interface AnalyticsConfig {
  /** Provider to use for analytics */
  provider: 'google-analytics' | 'segment' | 'mixpanel' | 'custom';
  
  /** Track ID for Google Analytics */
  trackingId?: string;
  
  /** API key for analytics provider */
  apiKey?: string;
  
  /** Custom event name for feedback submission */
  eventName?: string;
  
  /** Additional properties to include with analytics events */
  additionalProperties?: Record<string, any>;
  
  /** Custom function for analytics tracking */
  trackEvent?: (eventName: string, eventData: any) => void;
}

/**
 * Issue tracker integration configuration
 */
export interface IssueTrackerConfig {
  /** Issue tracker provider */
  provider: 'github' | 'jira' | 'gitlab' | 'azure-devops' | 'custom';
  
  /** API endpoint for the issue tracker */
  apiEndpoint: string;
  
  /** API token or Personal Access Token */
  apiToken: string;
  
  /** Owner/organization name */
  owner?: string;
  
  /** Repository name (for GitHub, GitLab) or project key (for Jira) */
  repository?: string;
  
  /** Project ID (for some issue trackers) */
  projectId?: string;
  
  /** Default issue type to create */
  issueType?: string;
  
  /** Default labels to apply to created issues */
  labels?: string[];
  
  /** Template for issue title */
  titleTemplate?: string;
  
  /** Template for issue body */
  bodyTemplate?: string;
  
  /** Map feedback fields to issue tracker fields */
  fieldMapping?: Record<string, string>;
  
  /** Function to transform feedback data before submission */
  transformData?: (feedback: Feedback) => Record<string, any>;
  
  /** Custom function to create issues */
  createIssue?: (feedback: Feedback) => Promise<string>;
}

/**
 * Issue tracker configuration for custom providers
 * This allows custom providers to omit certain required fields
 * that aren't applicable to custom implementations
 */
export interface CustomIssueTrackerConfig extends Omit<IssueTrackerConfig, 'apiToken' | 'owner' | 'repository'> {
  provider: 'custom';
  apiToken?: string;
  owner?: string;
  repository?: string;
}

/**
 * Union type for all issue tracker configurations
 * This allows us to distinguish between different providers and their requirements
 */
export type AnyIssueTrackerConfig = IssueTrackerConfig | CustomIssueTrackerConfig;

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  /** URL to send webhook to */
  url: string;
  
  /** HTTP method to use */
  method?: 'POST' | 'PUT' | 'PATCH';
  
  /** Custom headers to include with the request */
  headers?: Record<string, string>;
  
  /** Function to transform data before sending */
  transformData?: (feedback: Feedback) => Record<string, any>;
  
  /** Whether to use this webhook for all feedback or only specific types */
  feedbackTypes?: Array<Feedback['type']>;
  
  /** Secret for signing webhook payloads (if supported) */
  secret?: string;
}

/**
 * Chat platform notification configuration
 */
export interface NotificationConfig {
  /** Chat platform to use */
  platform: 'slack' | 'teams' | 'discord' | 'custom';
  
  /** Webhook URL for the platform */
  webhookUrl: string;
  
  /** Channel or room to send notifications to */
  channel?: string;
  
  /** Username to display for notifications */
  username?: string;
  
  /** Avatar URL for notifications */
  iconUrl?: string;
  
  /** Template for notification message */
  messageTemplate?: string;
  
  /** Whether to use thread replies for updates */
  useThreads?: boolean;
  
  /** Function to transform data before sending */
  transformMessage?: (feedback: Feedback) => Record<string, any>;
  
  /** Whether to notify only for specific feedback types */
  feedbackTypes?: Array<Feedback['type']>;
}

/**
 * Localization configuration
 */
export interface LocalizationConfig {
  /** Current locale code (e.g. 'en', 'fr', 'es') */
  locale?: string;
  
  /** Default locale to fall back to */
  defaultLocale?: string;
  
  /** Translation messages by locale */
  messages?: Record<string, Record<string, string>>;
  
  /** Function to get a translated message */
  t?: (key: string, params?: Record<string, any>) => string;
  
  /** RTL (right-to-left) language support */
  isRtl?: boolean;
}

/**
 * Response from an issue tracker after creating an issue
 */
export interface IssueCreationResponse {
  /** Success indicator */
  success: boolean;
  
  /** Issue ID/key from the issue tracker */
  issueId?: string;
  
  /** URL to the created issue */
  issueUrl?: string;
  
  /** Error message if creation failed */
  error?: string;
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
  /** Dark mode specific styling overrides */
  darkMode?: {
    overlay?: FeedbackModalOverlayStyles;
    content?: FeedbackModalContentStyles;
    form?: FeedbackModalFormStyles;
    buttons?: FeedbackModalButtonStyles;
    error?: FeedbackModalErrorStyles;
  }
}

/**
 * Theme preference options
 */
export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * Current theme context
 */
export interface ThemeContextType {
  /** Current active theme */
  theme: 'light' | 'dark';
  /** Function to toggle between light and dark themes */
  toggleTheme?: () => void;
  /** Function to set a specific theme */
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

/**
 * Animation configuration for modal transitions
 */
export interface AnimationConfig {
  /** Type of entrance animation */
  enter?: 'fade' | 'slide-up' | 'slide-down' | 'zoom' | 'none';
  /** Type of exit animation */
  exit?: 'fade' | 'slide-up' | 'slide-down' | 'zoom' | 'none';
  /** Duration of animations in milliseconds */
  duration?: number;
  /** CSS timing function for animations */
  easing?: string;
}

/**
 * Available feedback template types
 */
export type FeedbackTemplate = 'default' | 'bug-report' | 'feature-request' | 'general';

/**
 * Structure for template fields
 */
export interface TemplateField {
  /** Field identifier */
  id: string;
  /** Display label for the field */
  label: string;
  /** Type of input field */
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';
  /** Whether the field is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Options for select, radio, etc. */
  options?: Array<{
    value: string;
    label: string;
  }>;
  /** Default value */
  defaultValue?: string | boolean | string[];
  /** Help text */
  helpText?: string;
}

/**
 * Template configuration
 */
export interface TemplateConfig {
  /** Template identifier */
  id: FeedbackTemplate;
  /** Template title */
  title: string;
  /** Template description */
  description?: string;
  /** Fields in the template */
  fields: TemplateField[];
}

/**
 * Represents a file attachment in feedback
 */
export interface FeedbackAttachment {
  /** Unique identifier for the attachment */
  id: string;
  /** Filename of the attachment */
  filename: string;
  /** MIME type of the file */
  mimeType: string;
  /** Size of the file in bytes */
  size: number;
  /** File content as Data URL or Blob URL */
  dataUrl?: string;
  /** Raw file data as Blob or File object */
  file?: Blob;
  /** Preview URL for images */
  previewUrl?: string;
  /** Upload status */
  status?: 'pending' | 'uploading' | 'uploaded' | 'failed';
  /** Upload progress (0-100) */
  progress?: number;
  /** Error message if upload failed */
  error?: string;
}

/**
 * User identity information
 */
export interface UserIdentity {
  /** User's name */
  name?: string;
  /** User's email address */
  email?: string;
  /** User's ID in the system (if authenticated) */
  userId?: string;
  /** Any additional user information */
  [key: string]: any;
}

/**
 * Feedback category with hierarchical structure
 */
export interface FeedbackCategory {
  /** Category identifier */
  id: string;
  /** Display name for the category */
  name: string;
  /** Optional description of the category */
  description?: string;
  /** Optional icon identifier */
  icon?: string;
  /** Color associated with this category */
  color?: string;
  /** Subcategories within this category */
  subcategories?: FeedbackSubcategory[];
}

/**
 * Subcategory for more detailed feedback classification
 */
export interface FeedbackSubcategory {
  /** Subcategory identifier */
  id: string;
  /** Display name for the subcategory */
  name: string;
  /** Optional description of the subcategory */
  description?: string;
}

/**
 * Localization context type
 */
export interface LocalizationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
  locale: string;
}