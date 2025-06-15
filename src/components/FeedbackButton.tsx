import React from "react";
import { useFeedback } from "../hooks/useFeedback";
import { useTheme } from "../hooks/useTheme";

/**
 * Props for the FeedbackButton component
 */
export interface FeedbackButtonProps {
  /** Position of the button on screen */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Text to display inside the button */
  label?: string;
  /** Size of the button */
  size?: "small" | "medium" | "large";
  /** Click event handler */
  onClick?: () => void;
}

/**
 * A floating feedback button that opens the feedback modal when clicked
 *
 * This component renders a fixed-position circular button that users can click
 * to open the feedback modal. It automatically adapts to light/dark themes.
 *
 * @param props - Component props
 * @param props.position - Where to position the button (default: "bottom-right")
 * @param props.label - Button text content (default: "Feedback")
 * @param props.size - Button size (default: "medium")
 * @param props.onClick - Click event handler
 */
export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  position = "bottom-right",
  label = "Feedback",
  size = "medium",
  onClick,
}) => {
  const { openModal } = useFeedback();
  const { theme } = useTheme();

  // Use theme-aware colors if not explicitly provided
  const bgColor = "#007bff";
  const txtColor = "white";

  const getPositionStyles = (): Record<string, string> => {
    const [vertical, horizontal] = position.split("-") as [string, string];
    return {
      [vertical]: "20px",
      [horizontal]: "20px",
    };
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: "48px", height: "48px", fontSize: "14px" };
      case "large":
        return { width: "64px", height: "64px", fontSize: "18px" };
      default:
        return { width: "56px", height: "56px", fontSize: "16px" };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <button
      onClick={onClick || openModal}
      aria-label={label}
      title={label}
      style={{
        position: "fixed",
        ...getPositionStyles(),
        backgroundColor: bgColor,
        color: txtColor,
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sizeStyles,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
      }}
    >
      💬
    </button>
  );
};

export default FeedbackButton;
