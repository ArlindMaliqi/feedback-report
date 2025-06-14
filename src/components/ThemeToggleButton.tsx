/**
 * Theme toggle button component
 * @module components/ThemeToggleButton
 */
import React from "react";
import { useTheme } from "../hooks/useTheme";

export interface ThemeToggleButtonProps {
  /** Position of the button on screen */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Size of the button in pixels */
  size?: number;
  /** Light theme icon (emoji or text) */
  lightIcon?: string;
  /** Dark theme icon (emoji or text) */
  darkIcon?: string;
  currentTheme?: "light" | "dark" | "system";
  onThemeChange?: (theme: "light" | "dark" | "system") => void;
}

/**
 * A floating button for toggling between light and dark themes
 *
 * @param props - Component props
 * @param props.position - Where to position the button (default: "bottom-left")
 * @param props.size - Button size in pixels (default: 50)
 * @param props.lightIcon - Icon for light theme (default: "☀️")
 * @param props.darkIcon - Icon for dark theme (default: "🌙")
 */
export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  position = "bottom-left",
  size = 50,
  lightIcon = "☀️",
  darkIcon = "🌙",
  currentTheme = "system",
  onThemeChange,
}) => {
  const { theme, setTheme } = useTheme();

  // Create toggle function using setTheme
  const handleToggle = () => {
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    if (onThemeChange) {
      onThemeChange(nextTheme);
    }
    setTheme(nextTheme);
  };

  const getPositionStyles = (): Record<string, string> => {
    const [vertical, horizontal] = position.split("-") as [string, string];

    // Adjust position if bottom-left to avoid overlap with feedback button
    const horizontalPosition =
      horizontal === "left" && vertical === "bottom" ? "80px" : "20px";

    return {
      [vertical]: "20px",
      [horizontal]: horizontalPosition,
    };
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={`Switch to ${
        theme === "light" ? "dark" : "light"
      } mode`}
      title={`Switch to ${
        theme === "light" ? "dark" : "light"
      } mode`}
      style={{
        position: "fixed",
        ...getPositionStyles(),
        backgroundColor: theme === "light" ? "#f8f9fa" : "#374151",
        color: "inherit",
        border: `1px solid ${
          theme === "light" ? "#dee2e6" : "#4b5563"
        }`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.5}px`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        cursor: "pointer",
        zIndex: 998,
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
      }}
    >
      {theme === "light" ? darkIcon : lightIcon}
    </button>
  );
};

export default ThemeToggleButton;
