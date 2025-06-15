/**
 * Core type definitions for the React Feedback Report Widget
 * @module types
 */

// Core feedback data structures
export interface Feedback {
  id: string;
  message: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  category?: string;
  subcategory?: string;
  email?: string;
  name?: string;
  attachments?: FeedbackAttachment[];
  metadata?: Record<string, any>;
  timestamp: Date;
  votes?: number;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  submissionStatus?: 'pending' | 'submitted' | 'failed' | 'synced';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  url?: string;
  userAgent?: string;
  user?: UserIdentity;
  votedBy?: string[];
}

export interface UserIdentity {
  name?: string;
  email?: string;
  id?: string;
  avatar?: string;
}

export interface FeedbackCategory {
  id: string;
  name: string;
  description?: string;
  subcategories?: FeedbackSubcategory[];
  icon?: string;
  color?: string;
}

export interface FeedbackSubcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface FeedbackAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  data?: string | ArrayBuffer;
  file?: File;
  mimeType?: string;
  filename?: string;
  previewUrl?: string;
  dataUrl?: string;
}

// Configuration types
export interface FeedbackConfig {
  apiEndpoint?: string;
  enableShakeDetection?: boolean;
  theme?: 'light' | 'dark' | 'system';
  enableOfflineSupport?: boolean;
  collectUserAgent?: boolean;
  collectUrl?: boolean;
  disableNetworkRequests?: boolean;
  collectUserIdentity?: boolean;
  requiredIdentityFields?: ('name' | 'email')[];
  rememberUserIdentity?: boolean;
  maxAttachments?: number;
  allowedAttachmentTypes?: string[];
  maxFileSize?: number;
  enableVoting?: boolean;
  enableFileAttachments?: boolean;
  categories?: FeedbackCategory[];
  analytics?: AnalyticsConfig;
  issueTracker?: IssueTrackerConfig;
  webhooks?: WebhookConfig[];
  notifications?: NotificationConfig;
  localization?: LocalizationConfig;
}

// Context types
export interface FeedbackContextType {
  config: FeedbackConfig;
  submitFeedback: (message: string, type?: Feedback['type'], additionalData?: Record<string, any>) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  feedbacks?: Feedback[];
  voteFeedback?: (feedbackId: string, vote?: 'up' | 'down') => Promise<void>;
  openModal?: () => void;
  isOffline?: boolean;
  syncOfflineFeedback?: () => Promise<void>;
}

export type FeedbackContextValue = FeedbackContextType;

// Theme and styling types
export type ThemePreference = 'light' | 'dark' | 'system';
export type FeedbackTheme = ThemePreference;

export interface FeedbackModalStyles {
  overlay?: React.CSSProperties;
  modal?: React.CSSProperties;
  header?: React.CSSProperties;
  body?: React.CSSProperties;
  footer?: React.CSSProperties;
}

// Animation configuration
export interface AnimationConfig {
  enter?: 'fade' | 'slide' | 'scale' | 'none' | 'slide-up' | 'slide-down' | 'zoom' | 'fadeIn';
  exit?: 'fade' | 'slide' | 'scale' | 'none' | 'slide-up' | 'slide-down' | 'zoom' | 'fadeOut';
  duration?: number;
  easing?: string;
}

// Template system
export type FeedbackTemplate = 'default' | 'bug-report' | 'feature-request' | 'minimal' | string;

export interface TemplateField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file';
  label: string;
  required?: boolean;
  options?: { value: string; label: string; }[];
  placeholder?: string;
  helpText?: string;
  defaultValue?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  title?: string;
  description?: string;
  fields: TemplateField[];
}

// Localization types
export interface LocalizationConfig {
  locale: string;
  fallbackLocale?: string;
  rtl?: boolean;
  customTranslations?: Record<string, Record<string, string>>;
}

export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'nl';

export interface UseLocalizationOptions {
  locale?: string;
  fallbackLocale?: string;
}

// Integration types
export interface AnalyticsConfig {
  provider: 'google-analytics' | 'segment' | 'mixpanel' | 'custom';
  trackingId?: string;
  apiKey?: string;
  trackEvents?: boolean;
  trackPageViews?: boolean;
  customEndpoint?: string;
  eventName?: string;
  customEvents?: Record<string, any>;
}

export interface IssueTrackerConfig {
  provider: 'github' | 'jira' | 'gitlab' | 'azure-devops' | 'custom';
  apiToken?: string;
  owner?: string;
  repository?: string;
  project?: string;
  baseUrl?: string;
  labels?: string[];
  apiEndpoint?: string;
  headers?: Record<string, string>;
}

export type CustomIssueTrackerConfig = IssueTrackerConfig;
export type AnyIssueTrackerConfig = IssueTrackerConfig;

export interface WebhookConfig {
  url: string;
  secret?: string;
  events?: string[];
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
    title?: string;
  };
  discord?: {
    webhookUrl: string;
    username?: string;
    avatarUrl?: string;
  };
  email?: {
    smtp: {
      host: string;
      port: number;
      secure?: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    from: string;
    to: string[];
    subject?: string;
  };
}

// Theme context types
export interface ThemeContextType {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  isDark: boolean;
}

// Provider props
export interface FeedbackProviderProps {
  config: FeedbackConfig;
  children: React.ReactNode;
}

// Component prop types that re-export from other modules
export type { FeedbackButtonProps } from '../components/FeedbackButton';
export type { OptimizedFeedbackWidgetProps } from '../components/OptimizedFeedbackWidget';

// Localization context type
export interface LocalizationContextType {
  locale: string;
  dir: 'ltr' | 'rtl';
  t: (key: string, params?: Record<string, any>) => string;
}

export type LocalLocalizationContextType = LocalizationContextType;