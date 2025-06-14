import React, { useState, useEffect, useRef } from "react";
import { useFeedback } from "../hooks/useFeedback";
import { useTheme } from "../hooks/useTheme";
import { getAnimationStyles } from "../utils/animations";
import { getTemplateById } from "../utils/templates";
import { FileAttachmentInput } from "./FileAttachmentInput";
import { UserIdentityFields } from "./UserIdentityFields";
import { CategorySelector } from "./CategorySelector";
import type {
  Feedback,
  FeedbackModalStyles,
  AnimationConfig,
  TemplateField,
  FeedbackAttachment,
  UserIdentity,
} from "../types";

/**
 * Props for the FeedbackModal component
 */
interface FeedbackModalProps {
  /** Custom styling options for the modal */
  styles?: FeedbackModalStyles;
  /** Animation configuration */
  animation?: AnimationConfig;
  /** Template ID to use */
  templateId?: string;
}

/**
 * Modal component for collecting user feedback
 *
 * This component renders a modal dialog where users can submit feedback.
 * Enhanced with accessibility features, automatic theme detection, animations,
 * and customizable templates. Now includes file attachments, user identity fields,
 * category selection, and offline support.
 *
 * @param props - Component props
 * @param props.styles - Custom styling configuration
 * @param props.animation - Animation configuration
 * @param props.templateId - Template ID to use
 */
export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  styles = {},
  animation = { enter: "fade", exit: "fade", duration: 300 },
  templateId = "default",
}) => {
  const {
    isModalOpen,
    closeModal,
    submitFeedback,
    isSubmitting,
    error: submitError,
    isOffline,
    categories,
  } = useFeedback();
  const { theme } = useTheme();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [identity, setIdentity] = useState<UserIdentity>({});
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string | undefined>(undefined);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLElement | null>(null);
  const template = getTemplateById(templateId);

  // Use either dark mode styles or default styles based on theme
  const themeStyles =
    theme === "dark" && styles.darkMode ? styles.darkMode : styles;

  // Destructure styles with proper defaults
  const {
    overlay: overlayStyles = {},
    content: contentStyles = {},
    form: formStyles = {},
    buttons: buttonStyles = {},
    error: errorStyles = {},
    className = "",
    overlayClassName = "",
  } = { ...styles, ...themeStyles };

  // Initialize form data from template defaults
  useEffect(() => {
    if (isModalOpen) {
      const initialData: Record<string, any> = {};
      template.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        }
      });
      setFormData(initialData);
      setIsClosing(false);

      // Reset other state
      setAttachments([]);
      setCategory("");
      setSubcategory(undefined);
    }
  }, [isModalOpen, template]);

  // Trap focus within modal for accessibility
  useEffect(() => {
    if (!isModalOpen || !modalRef.current) return;

    // Find all focusable elements
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Set initial focus
    initialFocusRef.current = firstElement;
    setTimeout(() => {
      firstElement.focus();
    }, 50);

    // Handle tab key navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key !== "Tab") return;

      // Trap focus within modal
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  // Handle field change
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Handle category selection change
  const handleCategoryChange = (categoryId: string, subcategoryId?: string) => {
    setCategory(categoryId);
    setSubcategory(subcategoryId);
  };

  // Handle input focus
  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (formStyles.inputFocusColor) {
      e.target.style.borderColor = formStyles.inputFocusColor;
    }
  };

  // Handle input blur
  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.target.style.borderColor = formStyles.inputBorderColor || (theme === "dark" ? "#4b5563" : "#ccc");
  };

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
    }, animation.duration || 300);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract message and type for backward compatibility
    const message = formData.message || "";
    const type = formData.type || "other";

    // Prepare all data
    const additionalData: Record<string, any> = {
      ...formData,
      attachments: attachments.length > 0 ? attachments : undefined,
      user: Object.keys(identity).length > 0 ? identity : undefined,
      category: category || undefined,
      subcategory: subcategory || undefined,
    };

    // Pass all form data to submit function
    await submitFeedback(message, type as Feedback["type"], additionalData);
  };

  // Render field based on its type
  const renderField = (field: TemplateField) => {
    const value = formData[field.id] !== undefined ? formData[field.id] : "";

    const inputBaseStyle = {
      width: "100%",
      marginTop: "0.25rem",
      border: `1px solid ${formStyles.inputBorderColor || (theme === "dark" ? "#4b5563" : "#ccc")}`,
      borderRadius: formStyles.inputBorderRadius || "4px",
      padding: formStyles.inputPadding || "0.75rem",
      fontFamily: "inherit",
      backgroundColor: theme === "dark" ? "#1f2937" : "white",
      color: theme === "dark" ? "#e5e7eb" : "inherit",
    };

    const labelStyle = {
      color: formStyles.labelColor || (theme === "dark" ? "#e5e7eb" : "inherit"),
      fontWeight: formStyles.labelFontWeight || "inherit",
      display: "block",
      marginBottom: "0.25rem",
    };

    const helpTextStyle = {
      fontSize: "0.875rem",
      color: theme === "dark" ? "#9ca3af" : "#666",
      marginTop: "0.25rem",
    };

    switch (field.type) {
      case "select":
        return (
          <div style={{ marginBottom: "1rem" }} key={field.id}>
            <label htmlFor={`feedback-${field.id}`} style={labelStyle}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            <select
              id={`feedback-${field.id}`}
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              style={inputBaseStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required={field.required}
              aria-required={field.required}
              aria-describedby={
                field.helpText ? `help-${field.id}` : undefined
              }
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p id={`help-${field.id}`} style={helpTextStyle}>
                {field.helpText}
              </p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div style={{ marginBottom: "1rem" }} key={field.id}>
            <label htmlFor={`feedback-${field.id}`} style={labelStyle}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            <textarea
              id={`feedback-${field.id}`}
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isSubmitting}
              style={{
                ...inputBaseStyle,
                minHeight: "120px",
                resize: "vertical",
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              aria-required={field.required}
              aria-describedby={
                field.helpText ? `help-${field.id}` : undefined
              }
            />
            {field.id === "message" && (
              <small style={{ color: theme === "dark" ? "#9ca3af" : "#666" }}>
                {(value as string).length}/1000 characters
              </small>
            )}
            {field.helpText && (
              <p id={`help-${field.id}`} style={helpTextStyle}>
                {field.helpText}
              </p>
            )}
          </div>
        );

      case "text":
      default:
        return (
          <div style={{ marginBottom: "1rem" }} key={field.id}>
            <label htmlFor={`feedback-${field.id}`} style={labelStyle}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            <input
              type="text"
              id={`feedback-${field.id}`}
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isSubmitting}
              style={inputBaseStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              aria-required={field.required}
              aria-describedby={
                field.helpText ? `help-${field.id}` : undefined
              }
            />
            {field.helpText && (
              <p id={`help-${field.id}`} style={helpTextStyle}>
                {field.helpText}
              </p>
            )}
          </div>
        );
    }
  };

  // Style for submit button
  const submitButtonStyle = React.useMemo(
    () => {
      const isFormValid = template.fields
        .filter((field) => field.required)
        .every((field) => {
          const value = formData[field.id];
          return value !== undefined && value !== "";
        });

      return {
        padding: buttonStyles.buttonPadding || "0.75rem 1.5rem",
        border: "none",
        backgroundColor:
          isSubmitting || !isFormValid
            ? buttonStyles.disabledBackgroundColor || (theme === "dark" ? "#6b7280" : "#ccc")
            : buttonStyles.primaryBackgroundColor || (theme === "dark" ? "#3b82f6" : "#007bff"),
        color:
          isSubmitting || !isFormValid
            ? buttonStyles.disabledTextColor || "white"
            : buttonStyles.primaryTextColor || "white",
        borderRadius: buttonStyles.buttonBorderRadius || "4px",
        cursor: isSubmitting || !isFormValid ? "not-allowed" : "pointer",
        fontFamily: "inherit",
      };
    },
    [buttonStyles, isSubmitting, formData, template.fields, theme]
  );

  // Cancel button style
  const cancelButtonStyle = {
    padding: buttonStyles.buttonPadding || "0.75rem 1.5rem",
    border: `1px solid ${buttonStyles.secondaryBorderColor || (theme === "dark" ? "#4b5563" : "#ccc")}`,
    backgroundColor: buttonStyles.secondaryBackgroundColor || (theme === "dark" ? "#374151" : "white"),
    color: buttonStyles.secondaryTextColor || (theme === "dark" ? "#e5e7eb" : "inherit"),
    borderRadius: buttonStyles.buttonBorderRadius || "4px",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    fontFamily: "inherit",
  };

  // Early return if modal is not open
  if (!isModalOpen) return null;

  // Overlay style with theme and animation
  const overlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlayStyles.backgroundColor || (theme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)"),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: overlayStyles.zIndex || 1000,
    ...getAnimationStyles(
      { ...animation, enter: "fade", exit: "fade" },
      !isClosing
    ),
  };

  // Content style with theme and animation
  const contentStyle = {
    backgroundColor: contentStyles.backgroundColor || (theme === "dark" ? "#1f2937" : "white"),
    color: theme === "dark" ? "#e5e7eb" : "inherit",
    padding: contentStyles.padding || "2rem",
    borderRadius: contentStyles.borderRadius || "8px",
    width: contentStyles.width || "90%",
    maxWidth: contentStyles.maxWidth || "500px",
    boxShadow: contentStyles.boxShadow || (theme === "dark"
      ? "0 4px 20px rgba(0, 0, 0, 0.5)"
      : "0 4px 20px rgba(0, 0, 0, 0.15)"),
    fontFamily: contentStyles.fontFamily || "inherit",
    ...getAnimationStyles(animation, !isClosing),
  };

  // Error display style
  const errorDisplayStyle = {
    color: errorStyles.textColor || (theme === "dark" ? "#f87171" : "#d73a49"),
    backgroundColor: errorStyles.backgroundColor || (theme === "dark" ? "rgba(248, 113, 113, 0.1)" : "#ffeef0"),
    padding: errorStyles.padding || "0.75rem",
    borderRadius: errorStyles.borderRadius || "4px",
    marginBottom: "1rem",
    border: `1px solid ${errorStyles.borderColor || (theme === "dark" ? "rgba(248, 113, 113, 0.3)" : "#fdaeb7")}`,
  };

  return (
    <div
      className={`feedback-modal-overlay ${overlayClassName}`.trim()}
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      aria-describedby="feedback-modal-description"
    >
      <div
        ref={modalRef}
        className={`feedback-modal-content ${className}`.trim()}
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {isOffline && (
          <div style={{ marginBottom: "1rem", padding: "0.5rem", backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6", borderRadius: "4px", fontSize: "0.875rem" }}>
            <span role="img" aria-label="Warning">
              ⚠️
            </span>{" "}
            You are currently offline. Your feedback will be saved locally and
            submitted when you're back online.
          </div>
        )}

        <h2 id="feedback-modal-title" style={{ marginTop: 0 }}>
          {template.title}
        </h2>

        {template.description && (
          <p id="feedback-modal-description" style={{ marginBottom: "1.5rem" }}>
            {template.description}
          </p>
        )}

        {submitError && (
          <div
            style={errorDisplayStyle}
            role="alert"
          >
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Standard template fields */}
          {template.fields.map(renderField)}

          {/* Category selector */}
          {categories.length > 0 && (
            <CategorySelector
              categories={categories}
              selectedCategory={category}
              selectedSubcategory={subcategory}
              onSelectionChange={handleCategoryChange}
              disabled={isSubmitting}
            />
          )}

          {/* User identity fields */}
          <UserIdentityFields
            identity={identity}
            onIdentityChange={setIdentity}
            config={{
              requiredIdentityFields: [],
              rememberUserIdentity: true
            }}
            disabled={isSubmitting}
          />

          {/* File attachments */}
          <FileAttachmentInput
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            config={{
              maxAttachments: 3,
              maxAttachmentSize: 5 * 1024 * 1024,
              allowedAttachmentTypes: [
                'image/jpeg',
                'image/png',
                'image/gif',
                'application/pdf'
              ]
            }}
            disabled={isSubmitting}
          />

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={cancelButtonStyle}
              aria-label="Cancel and close feedback form"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting || template.fields
                  .filter((field) => field.required)
                  .some((field) => !formData[field.id])
              }
              style={submitButtonStyle}
              aria-label={
                isSubmitting ? "Submitting feedback..." : "Submit feedback"
              }
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
