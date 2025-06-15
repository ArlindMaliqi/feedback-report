import React from 'react';

// Basic types
export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';
export type FeedbackStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';
export type ThemePreference = 'light' | 'dark' | 'system';
export type FeedbackSubmissionStatus = 'pending' | 'synced' | 'failed' | 'submitted';
export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'ar' | 'he';

// User interfaces
export interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserIdentity extends User {}

// Category interfaces
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

// Attachment interfaces
export interface FeedbackAttachment {
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

// Core feedback interface
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
  votes?: number;
  votedBy?: string[];
  submissionStatus?: FeedbackSubmissionStatus;
  attachments?: FeedbackAttachment[];
  email?: string;
  metadata?: Record<string, any>;
}

// Template configuration
export interface TemplateField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'email' | 'checkbox' | 'radio' | 'number';
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

export interface TemplateConfig {
  id: string;
  name: string;
  title?: string;
  description?: string;
  fields: TemplateField[];
}

// Animation configuration
export interface AnimationConfig {
  enter?: 'fade' | 'slide' | 'slide-up' | 'slide-down' | 'scale' | 'zoom' | 'fadeIn' | 'none';
  exit?: 'fade' | 'slide' | 'slide-up' | 'slide-down' | 'scale' | 'zoom' | 'fadeOut' | 'none';
  duration?: number;
  easing?: string;
}

// Modal styles
export interface FeedbackModalStyles {
  overlay?: React.CSSProperties;
  modal?: React.CSSProperties;
  header?: React.CSSProperties;
  body?: React.CSSProperties;
  footer?: React.CSSProperties;
  closeButton?: React.CSSProperties;
}

// Advanced configuration interfaces
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

export interface WebhookConfig {
  url: string;
  secret?: string;
  headers?: Record<string, string>;
  events?: string[];
}

export interface IssueTrackerConfig {
  provider: 'github' | 'jira' | 'gitlab' | 'azure-devops' | 'custom';
  apiToken?: string;
  owner?: string;
  repository?: string;
  project?: string;
  labels?: string[];
  assignee?: string;
  baseUrl?: string;
  apiEndpoint?: string;
  headers?: Record<string, string>;
}

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

export interface LocalizationConfig {
  locale: SupportedLocale;
  fallbackLocale?: SupportedLocale;
  rtl?: boolean;
  customTranslations?: Record<string, Record<string, string>>;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  customCSS?: string;
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
  collectEmail?: boolean;
  enableFileAttachments?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  maxAttachments?: number;
  allowedAttachmentTypes?: string[];
  requiredIdentityFields?: string[];
  rememberUserIdentity?: boolean;
  
  // Appearance
  theme?: ThemeConfig | ThemePreference;
  animation?: AnimationConfig;
  
  // Categories and templates
  categories?: Category[];
  templates?: TemplateConfig[];
  defaultTemplate?: string;
  
  // Integrations
  analytics?: AnalyticsConfig;
  issueTracker?: IssueTrackerConfig;
  webhooks?: WebhookConfig[];
  notifications?: NotificationConfig;
  
  // Localization
  localization?: LocalizationConfig;
  
  // Privacy and security
  privacyPolicyUrl?: string;
  dataRetentionDays?: number;
  anonymizeData?: boolean;
  
  // Callbacks
  onSuccess?: (feedback: Feedback) => void;
  onError?: (error: Error) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

// Context types
export interface FeedbackContextValue {
  // Core state
  feedback: Feedback[];
  feedbacks?: Feedback[]; // Backward compatibility
  isSubmitting: boolean;
  isOnline: boolean;
  isOffline?: boolean;
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
  syncOfflineFeedback?: () => Promise<void>;
  clearFeedback: () => void;
  getFeedbackById: (id: string) => Feedback | undefined;
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
  
  // Configuration
  config: FeedbackConfig;
  categories?: Category[];
}

export interface ThemeContextType {
  theme: ThemePreference;
  systemTheme?: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
}

export interface LocalizationContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, any>) => string;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
}

// Component props
export interface FeedbackWidgetProps {
  config: FeedbackConfig;
  children?: React.ReactNode;
}

export interface FeedbackButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface FeedbackModalProps {
  template?: TemplateConfig;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (feedback: any) => Promise<void>;
  styles?: FeedbackModalStyles;
  animation?: AnimationConfig;
  config?: FeedbackConfig;
}

export interface OptimizedFeedbackWidgetProps {
  config?: FeedbackConfig;
  theme?: ThemePreference | string;
  showButton?: boolean;
  enableShakeDetection?: boolean;
  className?: string;
  children?: React.ReactNode;
  buttonProps?: FeedbackButtonProps;
  modalStyles?: FeedbackModalStyles;
  animation?: AnimationConfig;
  template?: TemplateConfig;
  showOfflineIndicator?: boolean;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

// Provider props
export interface FeedbackProviderProps {
  config: FeedbackConfig;
  children: React.ReactNode;
  _testProps?: {
    mockApiResponse?: any;
    disableNetworkRequests?: boolean;
  };
}