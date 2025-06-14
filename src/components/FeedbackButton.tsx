import React from "react";
import { useFeedback } from "../hooks/useFeedback";
import { useTheme } from "../hooks/useTheme";

/**
 * Props for the FeedbackButton component
 */
interface FeedbackButtonProps {
  /** Position of the button on screen */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Size of the button in pixels */
  size?: number;
  /** Background color of the button */
  backgroundColor?: string;
  /** Text color of the button */
  textColor?: string;
  /** Text to display inside the button */
  text?: string;
  /** Tooltip text (default: "Send Feedback") */
  tooltip?: string;
}

/**
 * A floating feedback button that opens the feedback modal when clicked
 *
 * This component renders a fixed-position circular button that users can click
 * to open the feedback modal. It automatically adapts to light/dark themes.
 *
 * @param props - Component props
 * @param props.position - Where to position the button (default: "bottom-right")
 * @param props.size - Button size in pixels (default: 60)
 * @param props.backgroundColor - Button background color (default: automatic based on theme)
 * @param props.textColor - Button text color (default: "white")
 * @param props.text - Button text content (default: "?")
 * @param props.tooltip - Tooltip text (default: "Send Feedback")
 */
export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  position = "bottom-right",
  size = 60,
  backgroundColor,
  textColor,
  text = "?",
  tooltip = "Send Feedback",
}) => {
  const { openModal } = useFeedback();
  const { theme } = useTheme();

  // Use theme-aware colors if not explicitly provided
  const bgColor = backgroundColor || (theme === "dark" ? "#3b82f6" : "#007bff");
  const txtColor = textColor || "white";

  const getPositionStyles = (): Record<string, string> => {
    const [vertical, horizontal] = position.split("-") as [string, string];
    return {
      [vertical]: "20px",
      [horizontal]: "20px",
    };
  };

  return (
    <button
      onClick={openModal}
      aria-label={tooltip}
      title={tooltip}
      style={{
        position: "fixed",
        ...getPositionStyles(),
        backgroundColor: bgColor,
        color: txtColor,
        border: "none",
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.4}px`,
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        cursor: "pointer",
        zIndex: 999,
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
      }}
    >
      {text}
    </button>
  );
};

export default FeedbackButton;
