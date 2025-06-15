/**
 * Comprehensive type definitions for the feedback widget
 * @module types
 */

// Basic feedback types
export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';
export type FeedbackStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackSubmissionStatus = 'pending' | 'synced' | 'failed' | 'submitted';

// Theme types
export type ThemePreference = 'light' | 'dark' | 'system';
export type FeedbackTheme = ThemePreference;

// Supported locales
export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'ar' | 'he';

// User information
export interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

// User identity for forms
export interface UserIdentity {
  name?: string;
  email?: string;
  id?: string;
  avatar?: string;
}

// Categories and subcategories
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Legacy category interfaces for backward compatibility
export interface FeedbackCategory extends Category {}
export interface FeedbackSubcategory extends Subcategory {}

// File attachments
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  data?: string | ArrayBuffer;
  file?: File;
  filename?: string;
  mimeType?: string;
  previewUrl?: string;
  dataUrl?: string;
}

// Legacy attachment interface for backward compatibility
export interface FeedbackAttachment extends Attachment {}

// Main feedback interface
export interface Feedback {
  id: string;
  message: string;
  type: FeedbackType;
  category?: string;
  subcategory?: string;
  priority?: FeedbackPriority;
  status: FeedbackStatus;
  timestamp: Date;
  user?: User;
  url?: string;
  userAgent?: string;
  attachments?: Attachment[];
  votes?: number;
  votedBy?: string[];
  metadata?: Record<string, any>;
  submissionStatus?: FeedbackSubmissionStatus;
  email?: string; // For backward compatibility
}

// Analytics configuration
export interface AnalyticsConfig {
  provider: 'google-analytics' | 'segment' | 'mixpanel' | 'custom';
  trackingId?: string;
  apiKey?: string;
  trackEvents?: boolean;
  trackPageViews?: boolean;
  eventName?: string;
  customEndpoint?: string;
  customEvents?: Record<string, any>;
}

// Webhook configuration
export interface WebhookConfig {
  url: string;
  secret?: string;
  headers?: Record<string, string>;
  events?: string[];
}

// Issue tracker configuration
export interface IssueTrackerConfig {
  provider: 'github' | 'jira' | 'gitlab' | 'azure-devops' | 'custom';
  apiToken?: string; // Make optional for custom providers
  owner?: string;
  repository?: string;
  project?: string;
  labels?: string[];
  assignee?: string;
  baseUrl?: string;
  apiEndpoint?: string;
  headers?: Record<string, string>;
}

// Custom issue tracker config for backward compatibility
export interface CustomIssueTrackerConfig extends IssueTrackerConfig {
  provider: 'custom';
  apiEndpoint: string;
}

// Notification configuration
export interface NotificationConfig {
  slack?: {
    webhookUrl: string;
    channel?: string;
    mentions?: string[];
  };
  teams?: {
    webhookUrl: string;
    mentions?: string[];
  };
  discord?: {
    webhookUrl: string;
    mentions?: string[];
  };
  email?: {
    smtp?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
    to: string | string[];
    subject?: string;
  };
}

// Localization configuration
export interface LocalizationConfig {
  locale: string;
  fallbackLocale?: string;
  rtl?: boolean;
  customTranslations?: Record<string, Record<string, string>>;
}

// Theme configuration
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  customCSS?: string;
}

// Animation configuration
export interface AnimationConfig {
  enter?: 'fade' | 'slide' | 'slide-up' | 'slide-down' | 'scale' | 'zoom' | 'fadeIn' | 'none';
  exit?: 'fade' | 'slide' | 'slide-up' | 'slide-down' | 'scale' | 'zoom' | 'fadeOut' | 'none';
  duration?: number;
  easing?: string;
}

// Field configuration for templates
export interface FieldConfig {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'email' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  defaultValue?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// Template field for backward compatibility
export interface TemplateField extends FieldConfig {}

// Template configuration
export interface TemplateConfig {
  id: string;
  name: string;
  title?: string;
  description?: string;
  fields: FieldConfig[];
}

// Template for backward compatibility
export interface FeedbackTemplate extends TemplateConfig {}

// Modal styles configuration
export interface FeedbackModalStyles {
  overlay?: React.CSSProperties;
  modal?: React.CSSProperties;
  header?: React.CSSProperties;
  body?: React.CSSProperties;
  footer?: React.CSSProperties;
  closeButton?: React.CSSProperties;
}

// Main feedback configuration
export interface FeedbackConfig {
  // Core settings
  apiEndpoint?: string;
  enableShakeDetection?: boolean;
  enableOfflineSupport?: boolean;
  enableVoting?: boolean;
  disableNetworkRequests?: boolean;
  
  // User experience
  collectUserIdentity?: boolean;
  collectUserAgent?: boolean;
  collectUrl?: boolean;
  enableFileAttachments?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  maxAttachments?: number;
  allowedAttachmentTypes?: string[];
  requiredIdentityFields?: string[];
  rememberUserIdentity?: boolean;
  
  // Appearance
  theme?: ThemeConfig | string; // Allow both for backward compatibility
  animation?: AnimationConfig;
  
  // Categories
  categories?: Category[];
  
  // Templates
  templates?: TemplateConfig[];
  defaultTemplate?: string;
  
  // Integrations
  analytics?: AnalyticsConfig;
  issueTracker?: IssueTrackerConfig;
  webhooks?: WebhookConfig[];
  notifications?: NotificationConfig;
  
  // Localization
  localization?: LocalizationConfig;
  
  // Privacy
  privacyPolicyUrl?: string;
  dataRetentionDays?: number;
  anonymizeData?: boolean;
}

// Context types - Updated with more flexible interfaces
export interface FeedbackContextValue {
  // Core feedback data
  feedback: Feedback[];
  feedbacks?: Feedback[]; // Add alias for backward compatibility
  
  // State management
  isSubmitting: boolean;
  isOnline: boolean;
  isOffline?: boolean; // Add alias
  isOpen?: boolean;
  loading?: boolean;
  error?: string | null;
  
  // Actions
  submitFeedback: (
    feedbackOrMessage: Partial<Feedback> | string, 
    type?: FeedbackType, 
    additionalData?: Record<string, any>
  ) => Promise<void>;
  voteFeedback: (id: string, type: 'up' | 'down') => Promise<void>;
  openModal?: () => void;
  closeModal?: () => void;
  
  // Data management
  pendingCount: number;
  syncPendingFeedback: () => Promise<void>;
  syncOfflineFeedback?: () => Promise<void>; // Add alias
  clearFeedback: () => void;
  getFeedbackById: (id: string) => Feedback | undefined;
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
  
  // Configuration
  config: FeedbackConfig;
  categories?: Category[];
}

export interface FeedbackContextType extends FeedbackContextValue {}

export interface ThemeContextType {
  theme: ThemePreference;
  systemTheme?: ThemePreference; // Add optional system theme
  setTheme: (theme: ThemePreference) => void;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
}

export interface LocalizationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isRTL: boolean;
}

// Provider props
export interface FeedbackProviderProps {
  config: FeedbackConfig;
  children: React.ReactNode;
}

// Component props for legacy compatibility
export interface OptimizedFeedbackWidgetProps {
  config?: FeedbackConfig;
  theme?: ThemePreference | string;
  showButton?: boolean;
  enableShakeDetection?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Template utilities types
export interface TemplateRegistry {
  [key: string]: TemplateConfig;
  default: TemplateConfig;
}

// Enhanced submitFeedback function signature options
export type SubmitFeedbackFunction = {
  // Option 1: Single object parameter
  (feedback: Partial<Feedback>): Promise<void>;
  // Option 2: Legacy three-parameter format
  (message: string, type?: FeedbackType, additionalData?: Record<string, any>): Promise<void>;
};