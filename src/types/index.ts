/**
 * Core type definitions for the React Feedback Widget
 * 
 * This module contains all TypeScript type definitions and interfaces used throughout
 * the feedback widget system. It provides type safety and IntelliSense support for
 * developers implementing feedback collection in their applications.
 * 
 * @module types
 * @version 2.2.0
 * @author ArlindMaliqi
 * @since 1.0.0
 * 
 * @example Basic usage
 * ```typescript
 * import type { FeedbackConfig, Feedback } from 'react-feedback-report-widget';
 * 
 * const config: FeedbackConfig = {
 *   apiEndpoint: '/api/feedback',
 *   theme: 'system'
 * };
 * ```
 */
import React from 'react';

/**
 * Supported feedback categories for classification
 * 
 * @typedef {('bug'|'feature'|'improvement'|'other')} FeedbackType
 * @since 1.0.0
 */
export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

/**
 * Feedback lifecycle status states
 * 
 * @typedef {('open'|'in-progress'|'resolved'|'closed')} FeedbackStatus
 * @since 1.0.0
 */
export type FeedbackStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

/**
 * Priority levels for feedback items
 * 
 * @typedef {('low'|'medium'|'high'|'critical')} FeedbackPriority
 * @since 1.0.0
 */
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Theme preferences for the widget appearance
 * 
 * @typedef {('light'|'dark'|'system')} ThemePreference
 * @since 1.2.0
 */
export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * Submission status for offline/online synchronization
 * 
 * @typedef {('pending'|'synced'|'failed'|'submitted')} FeedbackSubmissionStatus
 * @since 1.5.0
 */
export type FeedbackSubmissionStatus = 'pending' | 'synced' | 'failed' | 'submitted';

/**
 * Supported locales for internationalization
 * 
 * @typedef {('en'|'es'|'fr'|'de'|'nl'|'ar'|'he')} SupportedLocale
 * @since 1.8.0
 */
export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'ar' | 'he';

/**
 * Basic user information interface
 * 
 * Represents a user within the feedback system with optional identification fields.
 * Used for attribution and follow-up communication purposes.
 * 
 * @interface User
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: 'user123',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   avatar: 'https://example.com/avatar.jpg'
 * };
 * ```
 */
export interface User {
  /** Unique identifier for the user */
  id?: string;
  /** Full name of the user */
  name?: string;
  /** Email address for communication */
  email?: string;
  /** URL to user's profile picture or avatar */
  avatar?: string;
}

/**
 * Extended user identity information for feedback attribution
 * 
 * Extends the base User interface with additional identification capabilities
 * for more comprehensive user tracking and communication.
 * 
 * @interface UserIdentity
 * @extends User
 * @since 1.3.0
 */
export interface UserIdentity extends User {}

/**
 * Feedback categorization system
 * 
 * Defines hierarchical categories for organizing feedback submissions.
 * Categories can contain subcategories for more granular classification.
 * 
 * @interface Category
 * @since 1.1.0
 * 
 * @example
 * ```typescript
 * const category: Category = {
 *   id: 'ui-bugs',
 *   name: 'UI Bugs',
 *   description: 'Visual and layout issues',
 *   icon: '🐛',
 *   color: '#ef4444',
 *   subcategories: [
 *     { id: 'mobile', name: 'Mobile Issues', description: 'Mobile-specific problems' }
 *   ]
 * };
 * ```
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  /** Display name of the category */
  name: string;
  /** Optional description explaining the category */
  description?: string;
  /** Optional emoji or icon representation */
  icon?: string;
  /** Optional color code for visual distinction */
  color?: string;
  /** Array of subcategories for hierarchical organization */
  subcategories?: Subcategory[];
}

/**
 * Subcategory for more specific feedback classification
 * 
 * Provides additional granularity within main categories for better
 * organization and routing of feedback items.
 * 
 * @interface Subcategory
 * @since 1.1.0
 */
export interface Subcategory {
  /** Unique identifier for the subcategory */
  id: string;
  /** Display name of the subcategory */
  name: string;
  /** Optional description explaining the subcategory */
  description?: string;
  /** Optional emoji or icon representation */
  icon?: string;
}

/**
 * File attachment information for feedback submissions
 * 
 * Represents files, images, or other media attached to feedback.
 * Supports various file types with metadata and preview capabilities.
 * 
 * @interface FeedbackAttachment
 * @since 1.4.0
 * 
 * @example
 * ```typescript
 * const attachment: FeedbackAttachment = {
 *   id: 'att_123',
 *   name: 'screenshot.png',
 *   type: 'image/png',
 *   size: 245760,
 *   filename: 'bug-screenshot.png',
 *   mimeType: 'image/png',
 *   previewUrl: 'blob:http://localhost:3000/preview'
 * };
 * ```
 */
export interface FeedbackAttachment {
  /** Unique identifier for the attachment */
  id: string;
  /** Original filename or display name */
  name: string;
  /** MIME type of the file */
  type: string;
  /** File size in bytes */
  size: number;
  /** Optional public URL for the uploaded file */
  url?: string;
  /** Optional base64 encoded file data */
  data?: string | ArrayBuffer;
  /** Optional reference to the original File object */
  file?: File;
  /** Optional normalized filename */
  filename?: string;
  /** Optional MIME type (duplicate of type for compatibility) */
  mimeType?: string;
  /** Optional URL for preview/thumbnail */
  previewUrl?: string;
  /** Optional data URL representation */
  dataUrl?: string;
}

/**
 * Core feedback data structure
 * 
 * Represents a complete feedback submission with all associated metadata,
 * categorization, and user information. This is the primary data structure
 * used throughout the feedback system.
 * 
 * @interface Feedback
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * const feedback: Feedback = {
 *   id: 'fb_123',
 *   message: 'The login button is not working on mobile',
 *   type: 'bug',
 *   category: 'ui-bugs',
 *   priority: 'high',
 *   status: 'open',
 *   timestamp: new Date(),
 *   user: { name: 'John Doe', email: 'john@example.com' },
 *   url: 'https://app.example.com/login',
 *   attachments: []
 * };
 * ```
 */
export interface Feedback {
  /** Unique identifier for the feedback item */
  id: string;
  /** The main feedback message or description */
  message: string;
  /** Type/category of feedback */
  type: FeedbackType;
  /** Optional main category ID */
  category?: string;
  /** Optional subcategory ID */
  subcategory?: string;
  /** Priority level of the feedback */
  priority?: FeedbackPriority;
  /** Current status of the feedback */
  status: FeedbackStatus;
  /** When the feedback was submitted */
  timestamp: Date;
  /** Optional user information */
  user?: User;
  /** Optional URL where feedback was submitted */
  url?: string;
  /** Optional browser user agent string */
  userAgent?: string;
  /** Number of votes/upvotes received */
  votes?: number;
  /** Array of user IDs who have voted */
  votedBy?: string[];
  /** Submission/sync status for offline support */
  submissionStatus?: FeedbackSubmissionStatus;
  /** Array of attached files */
  attachments?: FeedbackAttachment[];
  /** Optional email for follow-up */
  email?: string;
  /** Additional metadata and context */
  metadata?: Record<string, any>;
}

/**
 * Dynamic form field configuration for templates
 * 
 * Defines the structure and validation rules for form fields in feedback templates.
 * Supports various input types with customizable validation and options.
 * 
 * @interface TemplateField
 * @since 1.6.0
 * 
 * @example
 * ```typescript
 * const field: TemplateField = {
 *   id: 'severity',
 *   type: 'select',
 *   label: 'Bug Severity',
 *   required: true,
 *   options: [
 *     { value: 'low', label: 'Low Impact' },
 *     { value: 'high', label: 'High Impact' }
 *   ],
 *   helpText: 'Select the impact level of this bug'
 * };
 * ```
 */
export interface TemplateField {
  /** Unique identifier for the field */
  id: string;
  /** Input type for the field */
  type: 'text' | 'textarea' | 'select' | 'email' | 'checkbox' | 'radio' | 'number';
  /** Display label for the field */
  label: string;
  /** Optional placeholder text */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Optional help text or instructions */
  helpText?: string;
  /** Default value for the field */
  defaultValue?: string;
  /** Options for select/radio fields */
  options?: Array<{ value: string; label: string }>;
  /** Validation rules for the field */
  validation?: {
    /** Minimum character length */
    minLength?: number;
    /** Maximum character length */
    maxLength?: number;
    /** Regular expression pattern */
    pattern?: string;
  };
}

/**
 * Template configuration for dynamic form generation
 * 
 * Defines the structure and layout of feedback forms with customizable fields.
 * Templates allow for different feedback collection scenarios (bug reports, feature requests, etc.).
 * 
 * @interface TemplateConfig
 * @since 1.6.0
 * 
 * @example
 * ```typescript
 * const template: TemplateConfig = {
 *   id: 'bug-report',
 *   name: 'Bug Report',
 *   title: 'Report a Bug',
 *   description: 'Help us fix issues by providing detailed information',
 *   fields: [
 *     { id: 'title', type: 'text', label: 'Bug Title', required: true },
 *     { id: 'description', type: 'textarea', label: 'Description', required: true }
 *   ]
 * };
 * ```
 */
export interface TemplateConfig {
  /** Unique identifier for the template */
  id: string;
  /** Display name of the template */
  name: string;
  /** Optional title for the form */
  title?: string;
  /** Optional description or instructions */
  description?: string;
  /** Array of form fields */
  fields: TemplateField[];
}

/**
 * Animation configuration for modal transitions
 * 
 * Controls the appearance and disappearance animations of the feedback modal
 * for enhanced user experience.
 * 
 * @interface AnimationConfig
 * @since 1.7.0
 * 
 * @example
 * ```typescript
 * const animation: AnimationConfig = {
 *   enter: 'slide-up',
 *   exit: 'fade',
 *   duration: 300,
 *   easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
 * };
 * ```
 */
export interface AnimationConfig {
  /** Animation type when modal appears */
  enter?: 'fade' | 'slide' | 'slide-up' | 'slide-down' | 'scale' | 'zoom' | 'fadeIn' | 'none';
  /** Animation type when modal disappears */
  exit?: 'fade' | 'slide' | 'slide-up' | 'slide-down' | 'scale' | 'zoom' | 'fadeOut' | 'none';
  /** Animation duration in milliseconds */
  duration?: number;
  /** CSS easing function */
  easing?: string;
}

/**
 * Custom styling options for modal components
 * 
 * Allows customization of modal appearance through CSS properties.
 * Provides fine-grained control over visual aspects of the feedback modal.
 * 
 * @interface FeedbackModalStyles
 * @since 1.3.0
 * 
 * @example
 * ```typescript
 * const styles: FeedbackModalStyles = {
 *   overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
 *   modal: { borderRadius: '20px', maxWidth: '600px' },
 *   header: { backgroundColor: '#f8f9fa' }
 * };
 * ```
 */
export interface FeedbackModalStyles {
  /** Styles for the modal overlay/backdrop */
  overlay?: React.CSSProperties;
  /** Styles for the main modal container */
  modal?: React.CSSProperties;
  /** Styles for the modal header */
  header?: React.CSSProperties;
  /** Styles for the modal body content */
  body?: React.CSSProperties;
  /** Styles for the modal footer */
  footer?: React.CSSProperties;
  /** Styles for the close button */
  closeButton?: React.CSSProperties;
}

/**
 * Analytics integration configuration
 * 
 * Configures tracking and analytics for feedback events across various
 * analytics platforms like Google Analytics, Segment, etc.
 * 
 * @interface AnalyticsConfig
 * @since 1.9.0
 * 
 * @example
 * ```typescript
 * const analytics: AnalyticsConfig = {
 *   provider: 'google-analytics',
 *   trackingId: 'GA_MEASUREMENT_ID',
 *   trackEvents: true,
 *   eventName: 'feedback_submitted',
 *   customEvents: {
 *     'feedback_opened': 'modal_opened',
 *     'feedback_closed': 'modal_closed'
 *   }
 * };
 * ```
 */
export interface AnalyticsConfig {
  /** Analytics service provider */
  provider: 'google-analytics' | 'segment' | 'mixpanel' | 'custom';
  /** Tracking ID or measurement ID */
  trackingId?: string;
  /** API key for the analytics service */
  apiKey?: string;
  /** Whether to track feedback events */
  trackEvents?: boolean;
  /** Whether to track page views */
  trackPageViews?: boolean;
  /** Custom event name for feedback submissions */
  eventName?: string;
  /** Custom endpoint for analytics data */
  customEndpoint?: string;
  /** Mapping of widget events to custom event names */
  customEvents?: Record<string, any>;
}

/**
 * Webhook configuration for external integrations
 * 
 * Defines webhook endpoints that receive feedback data for external processing,
 * notifications, or integrations with other systems.
 * 
 * @interface WebhookConfig
 * @since 1.8.0
 * 
 * @example
 * ```typescript
 * const webhook: WebhookConfig = {
 *   url: 'https://api.example.com/webhooks/feedback',
 *   secret: 'webhook_secret_key',
 *   headers: {
 *     'Authorization': 'Bearer token123',
 *     'Content-Type': 'application/json'
 *   },
 *   events: ['feedback.created', 'feedback.updated']
 * };
 * ```
 */
export interface WebhookConfig {
  /** Webhook endpoint URL */
  url: string;
  /** Optional secret for webhook verification */
  secret?: string;
  /** Custom headers to include in requests */
  headers?: Record<string, string>;
  /** Array of events that trigger this webhook */
  events?: string[];
}

/**
 * Issue tracker integration configuration
 * 
 * Configures automatic creation of issues in project management and
 * issue tracking systems like GitHub, Jira, GitLab, etc.
 * 
 * @interface IssueTrackerConfig
 * @since 1.10.0
 * 
 * @example
 * ```typescript
 * const issueTracker: IssueTrackerConfig = {
 *   provider: 'github',
 *   apiToken: 'ghp_xxxxxxxxxxxx',
 *   owner: 'mycompany',
 *   repository: 'my-app',
 *   labels: ['feedback', 'user-reported'],
 *   assignee: 'team-lead'
 * };
 * ```
 */
export interface IssueTrackerConfig {
  /** Issue tracking platform */
  provider: 'github' | 'jira' | 'gitlab' | 'azure-devops' | 'custom';
  /** API token or access key */
  apiToken?: string;
  /** Repository owner or organization */
  owner?: string;
  /** Repository or project name */
  repository?: string;
  /** Jira project key or similar */
  project?: string;
  /** Default labels to apply to created issues */
  labels?: string[];
  /** Default assignee for created issues */
  assignee?: string;
  /** Base URL for self-hosted instances */
  baseUrl?: string;
  /** Custom API endpoint */
  apiEndpoint?: string;
  /** Custom headers for API requests */
  headers?: Record<string, string>;
}

/**
 * Notification system configuration
 * 
 * Configures real-time notifications to various messaging platforms
 * when feedback is submitted. Supports Slack, Teams, Discord, and email.
 * 
 * @interface NotificationConfig
 * @since 1.11.0
 * 
 * @example
 * ```typescript
 * const notifications: NotificationConfig = {
 *   slack: {
 *     webhookUrl: 'https://hooks.slack.com/services/...',
 *     channel: '#feedback',
 *     mentions: ['@channel', '@dev-team']
 *   },
 *   email: {
 *     from: 'feedback@company.com',
 *     to: ['team@company.com'],
 *     subject: 'New Feedback Received'
 *   }
 * };
 * ```
 */
export interface NotificationConfig {
  /** Slack integration configuration */
  slack?: {
    /** Slack webhook URL */
    webhookUrl: string;
    /** Target channel name */
    channel?: string;
    /** Users or groups to mention */
    mentions?: string[];
  };
  /** Microsoft Teams integration configuration */
  teams?: {
    /** Teams webhook URL */
    webhookUrl: string;
    /** Users to mention */
    mentions?: string[];
  };
  /** Discord integration configuration */
  discord?: {
    /** Discord webhook URL */
    webhookUrl: string;
    /** Users or roles to mention */
    mentions?: string[];
  };
  /** Email notification configuration */
  email?: {
    /** SMTP server configuration */
    smtp?: {
      /** SMTP server hostname */
      host: string;
      /** SMTP server port */
      port: number;
      /** Whether to use secure connection */
      secure: boolean;
      /** Authentication credentials */
      auth: {
        /** SMTP username */
        user: string;
        /** SMTP password */
        pass: string;
      };
    };
    /** Sender email address */
    from: string;
    /** Recipient email address(es) */
    to: string | string[];
    /** Email subject template */
    subject?: string;
  };
}

/**
 * Internationalization and localization configuration
 * 
 * Configures language support, RTL layout, and custom translations
 * for the feedback widget interface.
 * 
 * @interface LocalizationConfig
 * @since 1.8.0
 * 
 * @example
 * ```typescript
 * const localization: LocalizationConfig = {
 *   locale: 'es',
 *   fallbackLocale: 'en',
 *   rtl: false,
 *   customTranslations: {
 *     'es': {
 *       'feedback.title': 'Enviar comentarios',
 *       'feedback.submit': 'Enviar'
 *     }
 *   }
 * };
 * ```
 */
export interface LocalizationConfig {
  /** Primary locale/language code */
  locale: SupportedLocale;
  /** Fallback locale if translation is missing */
  fallbackLocale?: SupportedLocale;
  /** Whether to use right-to-left layout */
  rtl?: boolean;
  /** Custom translation overrides */
  customTranslations?: Record<string, Record<string, string>>;
}

/**
 * Theme and appearance configuration
 * 
 * Configures the visual appearance of the feedback widget including
 * colors, styling, and custom CSS overrides.
 * 
 * @interface ThemeConfig
 * @since 1.2.0
 * 
 * @example
 * ```typescript
 * const theme: ThemeConfig = {
 *   mode: 'dark',
 *   primaryColor: '#007bff',
 *   backgroundColor: '#1a1a1a',
 *   textColor: '#ffffff',
 *   borderColor: '#333333',
 *   customCSS: '.feedback-modal { border-radius: 16px; }'
 * };
 * ```
 */
export interface ThemeConfig {
  /** Theme mode preference */
  mode: 'light' | 'dark' | 'system';
  /** Primary accent color */
  primaryColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Border color */
  borderColor?: string;
  /** Custom CSS overrides */
  customCSS?: string;
}

/**
 * Main configuration interface for the feedback widget
 * 
 * Central configuration object that controls all aspects of the feedback widget
 * behavior, appearance, and integrations. This is the primary interface developers
 * use to customize the widget for their specific needs.
 * 
 * @interface FeedbackConfig
 * @since 1.0.0
 * 
 * @example Complete configuration
 * ```typescript
 * const config: FeedbackConfig = {
 *   // Core settings
 *   apiEndpoint: '/api/feedback',
 *   enableShakeDetection: true,
 *   enableOfflineSupport: true,
 *   
 *   // User experience
 *   collectUserIdentity: true,
 *   enableFileAttachments: true,
 *   maxFileSize: 10 * 1024 * 1024,
 *   
 *   // Appearance
 *   theme: { mode: 'system', primaryColor: '#007bff' },
 *   
 *   // Integrations
 *   analytics: { provider: 'google-analytics', trackingId: 'GA_ID' },
 *   notifications: {
 *     slack: { webhookUrl: 'https://hooks.slack.com/...' }
 *   },
 *   
 *   // Callbacks
 *   onSuccess: (feedback) => console.log('Feedback submitted:', feedback),
 *   onError: (error) => console.error('Submission failed:', error)
 * };
 * ```
 */
export interface FeedbackConfig {
  // Core settings
  /** API endpoint for submitting feedback */
  apiEndpoint?: string;
  /** Enable shake gesture detection for mobile devices */
  enableShakeDetection?: boolean;
  /** Enable offline support with local storage */
  enableOfflineSupport?: boolean;
  /** Enable voting/upvoting on feedback items */
  enableVoting?: boolean;
  /** Disable network requests for testing */
  disableNetworkRequests?: boolean;
  
  // User experience
  /** Collect user identity information */
  collectUserIdentity?: boolean;
  /** Collect browser user agent string */
  collectUserAgent?: boolean;
  /** Collect current page URL */
  collectUrl?: boolean;
  /** Collect user email address */
  collectEmail?: boolean;
  /** Enable file attachment uploads */
  enableFileAttachments?: boolean;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Deprecated: use allowedAttachmentTypes */
  allowedFileTypes?: string[];
  /** Maximum number of attachments */
  maxAttachments?: number;
  /** Allowed MIME types for attachments */
  allowedAttachmentTypes?: string[];
  /** Required user identity fields */
  requiredIdentityFields?: string[];
  /** Remember user identity between sessions */
  rememberUserIdentity?: boolean;
  
  // Appearance
  /** Theme configuration */
  theme?: ThemeConfig | ThemePreference;
  /** Animation configuration */
  animation?: AnimationConfig;
  
  // Categories and templates
  /** Available feedback categories */
  categories?: Category[];
  /** Available form templates */
  templates?: TemplateConfig[];
  /** Default template to use */
  defaultTemplate?: string;
  
  // Integrations
  /** Analytics tracking configuration */
  analytics?: AnalyticsConfig;
  /** Issue tracker integration */
  issueTracker?: IssueTrackerConfig;
  /** Webhook configurations */
  webhooks?: WebhookConfig[];
  /** Notification configurations */
  notifications?: NotificationConfig;
  
  // Localization
  /** Internationalization settings */
  localization?: LocalizationConfig;
  
  // Privacy and security
  /** URL to privacy policy */
  privacyPolicyUrl?: string;
  /** Data retention period in days */
  dataRetentionDays?: number;
  /** Whether to anonymize collected data */
  anonymizeData?: boolean;
  
  // Callbacks
  /** Called when feedback is successfully submitted */
  onSuccess?: (feedback: Feedback) => void;
  /** Called when feedback submission fails */
  onError?: (error: Error) => void;
  /** Called when feedback modal is opened */
  onOpen?: () => void;
  /** Called when feedback modal is closed */
  onClose?: () => void;
}

/**
 * Context value interface for the feedback provider
 * 
 * Defines the shape of the context value provided by FeedbackProvider
 * and consumed by feedback components throughout the application.
 * 
 * @interface FeedbackContextValue
 * @since 1.0.0
 */
export interface FeedbackContextValue {
  // Core state
  /** Array of feedback items */
  feedback: Feedback[];
  /** Backward compatibility alias for feedback */
  feedbacks?: Feedback[];
  /** Whether a submission is in progress */
  isSubmitting: boolean;
  /** Whether the app is online */
  isOnline: boolean;
  /** Whether the app is offline */
  isOffline?: boolean;
  /** Whether the modal is open */
  isOpen?: boolean;
  /** Whether data is loading */
  loading?: boolean;
  /** Current error message */
  error?: string | null;
  
  // Actions
  /** Submit new feedback */
  submitFeedback: (
    feedbackOrMessage: Partial<Feedback> | string, 
    type?: FeedbackType, 
    additionalData?: Record<string, any>
  ) => Promise<void>;
  /** Vote on feedback item */
  voteFeedback: (id: string, type: 'up' | 'down') => Promise<void>;
  /** Open the feedback modal */
  openModal?: () => void;
  /** Close the feedback modal */
  closeModal?: () => void;
  
  // Data management
  /** Number of pending offline submissions */
  pendingCount: number;
  /** Sync pending feedback to server */
  syncPendingFeedback: () => Promise<void>;
  /** Alias for syncPendingFeedback */
  syncOfflineFeedback?: () => Promise<void>;
  /** Clear all local feedback data */
  clearFeedback: () => void;
  /** Get feedback by ID */
  getFeedbackById: (id: string) => Feedback | undefined;
  /** Update existing feedback */
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
  
  // Configuration
  /** Current widget configuration */
  config: FeedbackConfig;
  /** Available categories */
  categories?: Category[];
}

/**
 * Theme context interface for theme management
 * 
 * Provides theme state and controls for the feedback widget components.
 * 
 * @interface ThemeContextType
 * @since 1.2.0
 */
export interface ThemeContextType {
  /** Current theme preference */
  theme: ThemePreference;
  /** Detected system theme */
  systemTheme?: ThemePreference;
  /** Set theme preference */
  setTheme: (theme: ThemePreference) => void;
  /** Whether dark theme is active */
  isDark: boolean;
  /** Whether light theme is active */
  isLight: boolean;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
}

/**
 * Localization context interface for i18n support
 * 
 * Provides translation functions and locale management for the widget.
 * 
 * @interface LocalizationContextType
 * @since 1.8.0
 */
export interface LocalizationContextType {
  /** Current locale */
  locale: SupportedLocale;
  /** Set locale */
  setLocale: (locale: SupportedLocale) => void;
  /** Translation function */
  t: (key: string, params?: Record<string, any>) => string;
  /** Whether current locale uses RTL layout */
  isRTL: boolean;
  /** Text direction */
  dir: 'ltr' | 'rtl';
}

/**
 * Props for the main FeedbackWidget component
 * 
 * @interface FeedbackWidgetProps
 * @since 1.0.0
 */
export interface FeedbackWidgetProps {
  /** Widget configuration */
  config: FeedbackConfig;
  /** Optional child components */
  children?: React.ReactNode;
}

/**
 * Props for the FeedbackButton component
 * 
 * @interface FeedbackButtonProps
 * @since 1.0.0
 */
export interface FeedbackButtonProps {
  /** Button position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Additional CSS class names */
  className?: string;
  /** Custom button content */
  children?: React.ReactNode;
  /** Custom click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Button size variant */
  size?: 'small' | 'medium' | 'large';
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'outline';
}

/**
 * Props for the FeedbackModal component
 * 
 * @interface FeedbackModalProps
 * @since 1.0.0
 */
export interface FeedbackModalProps {
  /** Form template to use */
  template?: TemplateConfig;
  /** Whether modal is open */
  isOpen?: boolean;
  /** Modal close handler */
  onClose?: () => void;
  /** Form submission handler */
  onSubmit?: (feedback: any) => Promise<void>;
  /** Custom modal styles */
  styles?: FeedbackModalStyles;
  /** Animation configuration */
  animation?: AnimationConfig;
  /** Widget configuration */
  config?: FeedbackConfig;
}

/**
 * Props for the OptimizedFeedbackWidget component
 * 
 * Extended props interface for the performance-optimized widget variant
 * with additional features and customization options.
 * 
 * @interface OptimizedFeedbackWidgetProps
 * @since 2.0.0
 */
export interface OptimizedFeedbackWidgetProps {
  /** Widget configuration */
  config?: FeedbackConfig;
  /** Theme preference */
  theme?: ThemePreference | string;
  /** Whether to show the feedback button */
  showButton?: boolean;
  /** Whether to enable shake detection */
  enableShakeDetection?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Custom child components */
  children?: React.ReactNode;
  /** Button configuration */
  buttonProps?: FeedbackButtonProps;
  /** Modal styling options */
  modalStyles?: FeedbackModalStyles;
  /** Animation configuration */
  animation?: AnimationConfig;
  /** Form template */
  template?: TemplateConfig;
  /** Show offline indicator */
  showOfflineIndicator?: boolean;
  /** Loading fallback component */
  loadingFallback?: React.ReactNode;
  /** Error boundary fallback */
  errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

/**
 * Props for feedback provider components
 * 
 * @interface FeedbackProviderProps
 * @since 1.0.0
 */
export interface FeedbackProviderProps {
  /** Widget configuration */
  config: FeedbackConfig;
  /** Child components */
  children: React.ReactNode;
  /** Testing utilities */
  _testProps?: {
    /** Mock API response for testing */
    mockApiResponse?: any;
    /** Disable network requests for testing */
    disableNetworkRequests?: boolean;
  };
}