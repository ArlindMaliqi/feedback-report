/**
 * @fileoverview Feedback Report - A comprehensive React feedback widget system
 *
 * This package provides a complete feedback collection system for React applications,
 * featuring shake detection, customizable UI components, and TypeScript support.
 *
 * @author ArlindMaliqi
 * @version 1.4.0
 * @license MIT
 */

// Main exports for the feedback-report package
export { FeedbackProvider } from "./components/FeedbackProvider";
export { FeedbackButton } from "./components/FeedbackButton";
export { FeedbackModal } from "./components/FeedbackModal";
export { ShakeDetector } from "./components/ShakeDetector";
export { ThemeProvider } from "./contexts/ThemeContext";
export { FileAttachmentInput } from "./components/FileAttachmentInput";
export { UserIdentityFields } from "./components/UserIdentityFields";
export { CategorySelector } from "./components/CategorySelector";
export { OfflineIndicator } from "./components/OfflineIndicator";
export { FeedbackVoteButton } from "./components/FeedbackVoteButton";
export { FeedbackListItem } from "./components/FeedbackListItem";

// Export localization
export { 
  createTranslator, 
  getDirection, 
  DEFAULT_MESSAGES,
  TRANSLATIONS,
  ALL_MESSAGES
} from "./utils/localization";

// Export integrations
export { 
  processIntegrations, 
  processVoteIntegrations,
  trackFeedbackEvent,
  trackFeedbackSubmission,
  trackFeedbackVote,
  ANALYTICS_EVENTS
} from "./utils/integrations";
export { createIssueFromFeedback } from "./utils/integrations/issueTracker";
export { sendToWebhook, sendToWebhooks } from "./utils/integrations/webhooks";
export { sendNotification } from "./utils/integrations/notifications";

// Hooks
export { useFeedback } from "./hooks/useFeedback";
export { useShakeDetection } from "./hooks/useShakeDetection";
export { useTheme } from "./hooks/useTheme";
export { useLocalization } from "./hooks/useLocalization";

// Extended hooks
export { useFeedbackHistory } from "./hooks/useFeedbackHistory";
export { useFeedbackAnalytics } from "./hooks/useFeedbackAnalytics";

// Types
export type {
  Feedback,
  FeedbackContextType,
  FeedbackConfig,
  ApiResponse,
  FeedbackModalStyles,
  FeedbackModalOverlayStyles,
  FeedbackModalContentStyles,
  FeedbackModalFormStyles,
  FeedbackModalButtonStyles,
  FeedbackModalErrorStyles,
  ThemePreference,
  ThemeContextType,
  AnimationConfig,
  FeedbackTemplate,
  TemplateField,
  TemplateConfig,
  FeedbackAttachment,
  UserIdentity,
  FeedbackCategory,
  FeedbackSubcategory,
} from "./types";

// Utilities
export {
  formatTimestamp,
  handleApiResponse,
  generateId,
  validateFeedback,
} from "./utils";
export { getAnimationStyles, generateKeyframes } from "./utils/animations";
export { 
  getTemplateById, 
  getAllTemplates,
  defaultTemplate,
  bugReportTemplate,
  featureRequestTemplate,
  generalTemplate,
} from "./utils/templates";
export {
  validateAttachment,
  createAttachment,
  formatFileSize,
  captureScreenshot,
  DEFAULT_ALLOWED_TYPES,
  DEFAULT_MAX_SIZE,
} from "./utils/attachmentUtils";
export {
  saveFeedbackOffline,
  getFeedbackFromStorage,
  isOffline,
  registerConnectivityListeners,
} from "./utils/offlineStorage";
export {
  defaultCategories,
  getCategoryById,
  getSubcategoryById,
  mapTypeToCategory,
  getCategoryDisplayName,
} from "./utils/categories";
export {
  showError,
  showSuccess,
  showInfo,
  isSonnerAvailable
} from "./utils/notifications";

// Testing utilities
import * as TestingUtils from './testing';
export { TestingUtils };

// Examples
import * as NextJsExample from './examples/nextjs/FeedbackComponent';
import * as GatsbyExample from './examples/gatsby/FeedbackComponent';
import * as RemixExample from './examples/remix/FeedbackComponent';

export const Examples = {
  NextJs: NextJsExample,
  Gatsby: GatsbyExample,
  Remix: RemixExample
};

// Default component setup for easy integration
import React from "react";
import { FeedbackProvider } from "./components/FeedbackProvider";
import { FeedbackButton } from "./components/FeedbackButton";
import { FeedbackModal } from "./components/FeedbackModal";
import { ShakeDetector } from "./components/ShakeDetector";
import { ThemeProvider } from "./contexts/ThemeContext";
import { OfflineIndicator } from "./components/OfflineIndicator";
import type { 
  FeedbackConfig, 
  FeedbackModalStyles, 
  ThemePreference,
  AnimationConfig,
  FeedbackTemplate
} from "./types";

/**
 * Props for the FeedbackWidget component
 */
interface FeedbackWidgetProps {
  /** Configuration options for the feedback system */
  config?: FeedbackConfig;
  /** Whether to show the floating feedback button (default: true) */
  showButton?: boolean;
  /** Whether to enable shake detection (default: true) */
  enableShakeDetection?: boolean;
  /** Props to pass to the FeedbackButton component */
  buttonProps?: React.ComponentProps<typeof FeedbackButton>;
  /** Custom styling options for the modal */
  modalStyles?: FeedbackModalStyles;
  /** Initial theme preference */
  theme?: ThemePreference;
  /** Animation configuration for the modal */
  animation?: AnimationConfig;
  /** Template to use for feedback (default: 'default') */
  template?: FeedbackTemplate;
  /** Whether to show offline indicator (default: true when offline support enabled) */
  showOfflineIndicator?: boolean;
}

/**
 * All-in-one feedback widget component for easy integration
 *
 * This component combines all the feedback system components into a single,
 * easy-to-use widget. It's the recommended way to add feedback functionality
 * to your application with minimal setup.
 *
 * @param props - Widget configuration props
 */
export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  config = {},
  showButton = true,
  enableShakeDetection = true,
  buttonProps = {},
  modalStyles = {},
  theme = 'system',
  animation = { enter: 'fade', exit: 'fade', duration: 300 },
  template = 'default',
  showOfflineIndicator = config.enableOfflineSupport,
}) => {
  return (
    <ThemeProvider initialTheme={theme}>
      <FeedbackProvider config={{ ...config, theme }}>
        {enableShakeDetection && <ShakeDetector />}
        {showButton && <FeedbackButton {...buttonProps} />}
        {showOfflineIndicator && <OfflineIndicator />}
        <FeedbackModal 
          styles={modalStyles} 
          animation={animation}
          templateId={template}
        />
      </FeedbackProvider>
    </ThemeProvider>
  );
};

export default FeedbackWidget;
