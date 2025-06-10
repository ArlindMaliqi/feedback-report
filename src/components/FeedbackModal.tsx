import React, { useState, useEffect } from "react";
import { useFeedback } from "../hooks/useFeedback";
import type { Feedback } from "../types";

/**
 * Modal component for collecting user feedback
 *
 * This component renders a modal dialog where users can submit feedback.
 * It includes a form with feedback type selection and message input,
 * handles form validation, and provides submission feedback to the user.
 *
 * The modal automatically resets its state when closed and provides
 * real-time character counting and error display.
 *
 * @example
 * ```typescript
 * // Basic usage - typically included once in your app
 * function App() {
 *   return (
 *     <FeedbackProvider>
 *       <YourAppContent />
 *       <FeedbackModal />
 *     </FeedbackProvider>
 *   );
 * }
 * ```
 *
 * @remarks
 * - Requires FeedbackProvider to be present in the component tree
 * - Uses portal-like behavior with high z-index (1000)
 * - Includes click-outside-to-close functionality
 * - Automatically prevents form submission when invalid
 * - Provides loading states during submission
 */
export const FeedbackModal: React.FC = () => {
  const { isModalOpen, closeModal, submitFeedback, isSubmitting, error } =
    useFeedback();
  const [message, setMessage] = useState("");
  const [type, setType] = useState<Feedback["type"]>("other");

  useEffect(() => {
    if (!isModalOpen) {
      setMessage("");
      setType("other");
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeedback(message, type);
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="feedback-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div
        className="feedback-modal-content"
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "500px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Send Feedback</h2>
        {error && (
          <div
            style={{
              color: "#d73a49",
              backgroundColor: "#ffeef0",
              padding: "0.75rem",
              borderRadius: "4px",
              marginBottom: "1rem",
              border: "1px solid #fdaeb7",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="feedback-type">Type:</label>
            <select
              id="feedback-type"
              value={type}
              onChange={(e) => setType(e.target.value as Feedback["type"])}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="feedback-message">Message:</label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your feedback..."
              required
              disabled={isSubmitting}
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "0.75rem",
                marginTop: "0.25rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
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
              style={{
                padding: "0.75rem 1.5rem",
                border: "1px solid #ccc",
                backgroundColor: "white",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                backgroundColor:
                  isSubmitting || !message.trim() ? "#ccc" : "#007bff",
                color: "white",
                borderRadius: "4px",
                cursor:
                  isSubmitting || !message.trim() ? "not-allowed" : "pointer",
              }}
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
