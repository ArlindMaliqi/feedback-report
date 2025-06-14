/**
 * @fileoverview Type definitions for the React Feedback Report Widget
 * @module types
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.0.0
 */

/**
 * Supported locale codes - reduced to requested languages
 */
export type SupportedLocale = 'en' | 'de' | 'es' | 'fr' | 'nl';

/**
 * Core feedback data structure
 */
export interface Feedback {
  id: string;
  message: string;
  type: 'bug' | 'feature' | 'improvement' | 'question' | 'other';
  category?: string;
  subcategory?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  timestamp: Date;
  votes?: number;
  url?: string;
  userAgent?: string;
  user?: UserIdentity;
  attachments?: FeedbackAttachment[];
  submissionStatus?: 'pending' | 'synced' | 'failed';
  /** Array of user IDs who voted on this feedback (for voting tracking) */
  votedBy?: string[];
}

export interface UserIdentity {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface FeedbackAttachment {
  id: string;
  file: File;
  type: 'image' | 'document' | 'video' | 'other';
  url?: string;
  size: number;
  name: string;
  filename?: string;
  mimeType?: string;
  previewUrl?: string;
  dataUrl?: string;
}

export interface FeedbackCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  subcategories?: FeedbackSubcategory[];
}

export interface FeedbackSubcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

// Configuration types
export interface FeedbackConfig {
  apiEndpoint?: string;
  theme?: FeedbackTheme;
  enableShakeDetection?: boolean;
  enableOfflineSupport?: boolean;
  enableVoting?: boolean;
  collectUserIdentity?: boolean;
  enableFileAttachments?: boolean;
  maxFileSize?: number;
  maxAttachments?: number;
  allowedAttachmentTypes?: string[];
  categories?: FeedbackCategory[];
  analytics?: AnalyticsConfig;
  issueTracker?: AnyIssueTrackerConfig;
  webhooks?: WebhookConfig[];
  notifications?: NotificationConfig;
  localization?: LocalizationConfig;
  disableNetworkRequests?: boolean;
  requiredIdentityFields?: string[];
  rememberUserIdentity?: boolean;
  collectUserAgent?: boolean;
  isTestEnvironment?: boolean;
}

export type FeedbackTheme = 'light' | 'dark' | 'system';
export type ThemePreference = 'light' | 'dark' | 'system';
export type FeedbackTemplate = 'default' | 'bug-report' | 'feature-request' | 'general';

// Analytics configuration
export interface AnalyticsConfig {
  provider: 'google-analytics' | 'segment' | 'mixpanel' | 'custom';
  trackingId?: string;
  apiKey?: string;
  trackEvents?: boolean;
  trackPageViews?: boolean;
  customEvents?: Record<string, any>;
  eventName?: string;
}

// Issue tracker configuration
export interface IssueTrackerConfig {
  provider: 'github' | 'jira' | 'gitlab' | 'azure-devops';
  apiToken?: string;
  baseUrl?: string;
  projectKey?: string;
  owner?: string;
  repository?: string;
  labels?: string[];
  apiEndpoint?: string;
}

export interface CustomIssueTrackerConfig {
  provider: 'custom';
  apiEndpoint: string;
  headers?: Record<string, string>;
  transformPayload?: (feedback: Feedback) => any;
}

export type AnyIssueTrackerConfig = IssueTrackerConfig | CustomIssueTrackerConfig;

// Webhook configuration
export interface WebhookConfig {
  url: string;
  secret?: string;
  events: string[];
  headers?: Record<string, string>;
  retries?: number;
  timeout?: number;
}

// Notification configuration
export interface NotificationConfig {
  slack?: SlackConfig;
  teams?: TeamsConfig;
  discord?: DiscordConfig;
  email?: EmailConfig;
  channel?: string;
  username?: string;
  iconUrl?: string;
}

export interface SlackConfig {
  webhookUrl: string;
  channel?: string;
  mentions?: string[];
  template?: string;
}

export interface TeamsConfig {
  webhookUrl: string;
  template?: string;
}

export interface DiscordConfig {
  webhookUrl: string;
  template?: string;
}

export interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'ses' | 'custom';
  apiKey?: string;
  from: string;
  to: string[];
  template?: string;
}

/**
 * Localization configuration with bundle optimization
 * @since 2.0.0
 */
export interface LocalizationConfig {
  /** Current locale code */
  locale?: SupportedLocale;
  /** Fallback locale when translation is missing */
  fallbackLocale?: SupportedLocale;
  /** Whether to use RTL layout */
  rtl?: boolean;
  /** Custom translations organized by locale */
  customTranslations?: {
    [K in SupportedLocale]?: {
      [key: string]: string;
    };
  };
  /** Whether to lazy load translation bundles */
  lazyLoad?: boolean;
  /** Whether to automatically detect browser locale */
  autoDetect?: boolean;
}

/**
 * Localization context type - single definition
 */
export interface LocalizationContextType {
  /** Translation function that always returns string with optional params */
  t: (key: string, params?: Record<string, string | number>) => string;
  /** Text direction */
  direction: 'ltr' | 'rtl';
  /** Current locale */
  locale: string;
}

// Template field types
export interface TemplateField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  defaultValue?: string;
  helpText?: string;
}

// Context types
export interface FeedbackContextValue {
  config: FeedbackConfig;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  submitFeedback: (message: string, type?: Feedback["type"], additionalData?: Record<string, any>) => Promise<void>;
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isOffline?: boolean;
  syncOfflineFeedback?: () => Promise<void>;
  voteFeedback?: (id: string) => Promise<void>;
}

export type FeedbackContextType = FeedbackContextValue;

export interface ThemeContextType {
  theme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (newTheme: ThemePreference) => void;
}

// Provider and context types
export interface FeedbackProviderProps {
  children: React.ReactNode;
  config: FeedbackConfig;
}

// Component prop types
export interface FeedbackButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  label?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  onClick?: () => void;
}

export interface MinimalFeedbackWidgetProps {
  apiEndpoint?: string;
  onSubmit?: (feedback: any) => Promise<void>;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: FeedbackTheme;
  enableShakeDetection?: boolean;
  config?: FeedbackConfig;
}

export interface OptimizedFeedbackWidgetProps {
  config?: FeedbackConfig;
  theme?: FeedbackTheme;
  showButton?: boolean;
  enableShakeDetection?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  template?: FeedbackTemplate;
  animation?: AnimationConfig;
  styles?: FeedbackModalStyles;
}

// UI component types
export interface FeedbackModalStyles {
  overlay?: React.CSSProperties;
  modal?: React.CSSProperties;
  header?: React.CSSProperties;
  body?: React.CSSProperties;
  footer?: React.CSSProperties;
}

export interface AnimationConfig {
  enter?: string;
  exit?: string;
  duration?: number;
  easing?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  title: string;
  fields: TemplateField[];
  description?: string;
}

// Utility types
export interface FeedbackMetrics {
  totalSubmissions: number;
  averageRating: number;
  categoryBreakdown: Record<string, number>;
  timeSeriesData: Array<{ date: string; count: number }>;
}

export interface FeedbackAnalyticsOptions {
  timeRange: 'last-7-days' | 'last-30-days' | 'last-90-days' | 'custom';
  groupBy: 'category' | 'type' | 'status' | 'day' | 'week' | 'month';
  startDate?: Date;
  endDate?: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}