/**
 * @fileoverview Feedback Report - A comprehensive React feedback widget system
 *
 * This package provides a complete feedback collection system for React applications,
 * featuring shake detection, customizable UI components, and TypeScript support.
 *
 * @author ArlindMaliqi
 * @version 1.0.0
 * @license MIT
 */

// Main exports for the feedback-report package
export { FeedbackProvider } from "./components/FeedbackProvider";
export { FeedbackButton } from "./components/FeedbackButton";
export { FeedbackModal } from "./components/FeedbackModal";
export { ShakeDetector } from "./components/ShakeDetector";

// Hooks
export { useFeedback } from "./hooks/useFeedback";
export { useShakeDetection } from "./hooks/useShakeDetection";

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
} from "./types";

// Utilities
export {
  formatTimestamp,
  handleApiResponse,
  generateId,
  validateFeedback,
} from "./utils";

// Default component setup for easy integration
import React from "react";
import { FeedbackProvider } from "./components/FeedbackProvider";
import { FeedbackButton } from "./components/FeedbackButton";
import { FeedbackModal } from "./components/FeedbackModal";
import { ShakeDetector } from "./components/ShakeDetector";
import type { FeedbackConfig, FeedbackModalStyles } from "./types";

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
}

/**
 * All-in-one feedback widget component for easy integration
 *
 * This component combines all the feedback system components into a single,
 * easy-to-use widget. It's the recommended way to add feedback functionality
 * to your application with minimal setup.
 *
 * @param props - Widget configuration props
 * @param props.config - Feedback system configuration
 * @param props.showButton - Whether to display the feedback button
 * @param props.enableShakeDetection - Whether to enable shake-to-feedback
 * @param props.buttonProps - Customization props for the feedback button
 * @param props.modalStyles - Custom styling options for the modal
 *
 * @example
 * ```typescript
 * // Minimal setup
 * function App() {
 *   return (
 *     <div>
 *       <YourAppContent />
 *       <FeedbackWidget />
 *     </div>
 *   );
 * }
 *
 * // Advanced configuration with custom styling
 * function App() {
 *   const feedbackConfig = {
 *     apiEndpoint: '/api/feedback',
 *     collectUserAgent: true,
 *     collectUrl: true
 *   };
 *
 *   const modalStyles = {
 *     content: {
 *       backgroundColor: "#f8f9fa",
 *       borderRadius: "12px",
 *       fontFamily: "Inter, sans-serif"
 *     },
 *     buttons: {
 *       primaryBackgroundColor: "#28a745",
 *       primaryHoverBackgroundColor: "#218838",
 *       buttonBorderRadius: "6px"
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <YourAppContent />
 *       <FeedbackWidget
 *         config={feedbackConfig}
 *         modalStyles={modalStyles}
 *         buttonProps={{
 *           position: "bottom-left",
 *           backgroundColor: "#ff6b6b",
 *           text: "💬"
 *         }}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Includes FeedbackProvider, so no need to wrap your app separately
 * - Automatically includes modal, button, and shake detection
 * - Highly customizable through props and configuration
 * - Perfect for quick integration with sensible defaults
 * - Supports comprehensive modal styling customization
 */
export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  config = {},
  showButton = true,
  enableShakeDetection = true,
  buttonProps = {},
  modalStyles = {},
}) => {
  return (
    <FeedbackProvider config={config}>
      {enableShakeDetection && <ShakeDetector />}
      {showButton && <FeedbackButton {...buttonProps} />}
      <FeedbackModal styles={modalStyles} />
    </FeedbackProvider>
  );
};

export default FeedbackWidget;
