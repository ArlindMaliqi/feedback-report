import React, { useState, useEffect } from "react";
import { useFeedback } from "../hooks/useFeedback";
import type { Feedback, FeedbackModalStyles } from "../types";

/**
 * Props for the FeedbackModal component
 */
interface FeedbackModalProps {
  /** Custom styling options for the modal */
  styles?: FeedbackModalStyles;
}

/**
 * Modal component for collecting user feedback
 *
 * This component renders a modal dialog where users can submit feedback.
 * It includes a form with feedback type selection and message input,
 * handles form validation, and provides submission feedback to the user.
 *
 * The modal automatically resets its state when closed and provides
 * real-time character counting and error display. Now fully customizable
 * with comprehensive styling options.
 *
 * @param props - Component props
 * @param props.styles - Custom styling configuration
 *
 * @example
 * ```typescript
 * // Basic usage
 * <FeedbackModal />
 *
 * // With custom styling
 * <FeedbackModal
 *   styles={{
 *     content: {
 *       backgroundColor: "#f8f9fa",
 *       borderRadius: "12px",
 *       fontFamily: "Arial, sans-serif"
 *     },
 *     buttons: {
 *       primaryBackgroundColor: "#28a745",
 *       buttonBorderRadius: "6px"
 *     }
 *   }}
 * />
 * ```
 *
 * @remarks
 * - Requires FeedbackProvider to be present in the component tree
 * - Uses portal-like behavior with customizable z-index
 * - Includes click-outside-to-close functionality
 * - Automatically prevents form submission when invalid
 * - Provides loading states during submission
 * - Fully customizable styling through props
 */
export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  styles = {},
}) => {
  const {
    isModalOpen,
    closeModal,
    submitFeedback,
    isSubmitting,
    error: submitError,
  } = useFeedback();
  const [message, setMessage] = useState("");
  const [type, setType] = useState<Feedback["type"]>("other");

  // Destructure styles with proper defaults
  const {
    overlay: overlayStyles = {},
    content: contentStyles = {},
    form: formStyles = {},
    buttons: buttonStyles = {},
    error: errorStyles = {},
    className = "",
    overlayClassName = "",
  } = styles;

  // All hooks must be called before any early returns
  useEffect(() => {
    if (!isModalOpen) {
      setMessage("");
      setType("other");
    }
  }, [isModalOpen]);

  // Memoized style objects for better performance - moved before early return
  const overlayStyle = React.useMemo(
    () => ({
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: overlayStyles.backgroundColor || "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: overlayStyles.zIndex || 1000,
    }),
    [overlayStyles]
  );

  const contentStyle = React.useMemo(
    () => ({
      backgroundColor: contentStyles.backgroundColor || "white",
      padding: contentStyles.padding || "2rem",
      borderRadius: contentStyles.borderRadius || "8px",
      width: contentStyles.width || "90%",
      maxWidth: contentStyles.maxWidth || "500px",
      boxShadow: contentStyles.boxShadow || "0 4px 20px rgba(0, 0, 0, 0.15)",
      fontFamily: contentStyles.fontFamily || "inherit",
    }),
    [contentStyles]
  );

  const errorDisplayStyle = React.useMemo(
    () => ({
      color: errorStyles.textColor || "#d73a49",
      backgroundColor: errorStyles.backgroundColor || "#ffeef0",
      padding: errorStyles.padding || "0.75rem",
      borderRadius: errorStyles.borderRadius || "4px",
      marginBottom: "1rem",
      border: `1px solid ${errorStyles.borderColor || "#fdaeb7"}`,
    }),
    [errorStyles]
  );

  const labelStyle = React.useMemo(
    () => ({
      color: formStyles.labelColor || "inherit",
      fontWeight: formStyles.labelFontWeight || "inherit",
    }),
    [formStyles]
  );

  const inputBaseStyle = React.useMemo(
    () => ({
      width: "100%",
      marginTop: "0.25rem",
      border: `1px solid ${formStyles.inputBorderColor || "#ccc"}`,
      borderRadius: formStyles.inputBorderRadius || "4px",
      fontFamily: "inherit",
    }),
    [formStyles]
  );

  const selectStyle = React.useMemo(
    () => ({
      ...inputBaseStyle,
      padding: formStyles.inputPadding || "0.5rem",
    }),
    [inputBaseStyle, formStyles]
  );

  const textareaStyle = React.useMemo(
    () => ({
      ...inputBaseStyle,
      minHeight: "120px",
      padding: formStyles.inputPadding || "0.75rem",
      resize: "vertical" as const,
    }),
    [inputBaseStyle, formStyles]
  );

  const cancelButtonStyle = React.useMemo(
    () => ({
      padding: buttonStyles.buttonPadding || "0.75rem 1.5rem",
      border: `1px solid ${buttonStyles.secondaryBorderColor || "#ccc"}`,
      backgroundColor: buttonStyles.secondaryBackgroundColor || "white",
      color: buttonStyles.secondaryTextColor || "inherit",
      borderRadius: buttonStyles.buttonBorderRadius || "4px",
      cursor: isSubmitting ? "not-allowed" : "pointer",
      fontFamily: "inherit",
    }),
    [buttonStyles, isSubmitting]
  );

  const submitButtonStyle = React.useMemo(
    () => ({
      padding: buttonStyles.buttonPadding || "0.75rem 1.5rem",
      border: "none",
      backgroundColor:
        isSubmitting || !message.trim()
          ? buttonStyles.disabledBackgroundColor || "#ccc"
          : buttonStyles.primaryBackgroundColor || "#007bff",
      color:
        isSubmitting || !message.trim()
          ? buttonStyles.disabledTextColor || "white"
          : buttonStyles.primaryTextColor || "white",
      borderRadius: buttonStyles.buttonBorderRadius || "4px",
      cursor: isSubmitting || !message.trim() ? "not-allowed" : "pointer",
      fontFamily: "inherit",
    }),
    [buttonStyles, isSubmitting, message]
  );

  const handleInputFocus = React.useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      if (formStyles.inputFocusColor) {
        e.target.style.borderColor = formStyles.inputFocusColor;
      }
    },
    [formStyles.inputFocusColor]
  );

  const handleInputBlur = React.useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      e.target.style.borderColor = formStyles.inputBorderColor || "#ccc";
    },
    [formStyles.inputBorderColor]
  );

  const handleSubmitButtonMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (
        !isSubmitting &&
        message.trim() &&
        buttonStyles.primaryHoverBackgroundColor
      ) {
        e.currentTarget.style.backgroundColor =
          buttonStyles.primaryHoverBackgroundColor;
      }
    },
    [isSubmitting, message, buttonStyles.primaryHoverBackgroundColor]
  );

  const handleSubmitButtonMouseLeave = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isSubmitting && message.trim()) {
        e.currentTarget.style.backgroundColor =
          buttonStyles.primaryBackgroundColor || "#007bff";
      }
    },
    [isSubmitting, message, buttonStyles.primaryBackgroundColor]
  );

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await submitFeedback(message, type);
    },
    [submitFeedback, message, type]
  );

  // Early return AFTER all hooks have been called
  if (!isModalOpen) return null;

  return (
    <div
      className={`feedback-modal-overlay ${overlayClassName}`.trim()}
      style={overlayStyle}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div
        className={`feedback-modal-content ${className}`.trim()}
        style={contentStyle}
      >
        <h2 style={{ marginTop: 0 }}>Send Feedback</h2>
        {submitError && <div style={errorDisplayStyle}>{submitError}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="feedback-type" style={labelStyle}>
              Type:
            </label>
            <select
              id="feedback-type"
              value={type}
              onChange={(e) => setType(e.target.value as Feedback["type"])}
              style={selectStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            >
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="feedback-message" style={labelStyle}>
              Message:
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your feedback..."
              required
              disabled={isSubmitting}
              style={textareaStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <small style={{ color: "#666" }}>
              {message.length}/1000 characters
            </small>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              style={submitButtonStyle}
              onMouseEnter={handleSubmitButtonMouseEnter}
              onMouseLeave={handleSubmitButtonMouseLeave}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
