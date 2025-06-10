import React, { useEffect } from "react";
import { useFeedback } from "../hooks/useFeedback";

/**
 * Props for the ShakeDetector component
 */
interface ShakeDetectorProps {
  /** Sensitivity threshold for shake detection (default: 15) */
  threshold?: number;
  /** Timeout between shake detections in milliseconds (default: 1000) */
  timeout?: number;
  /** Whether shake detection is disabled (default: false) */
  disabled?: boolean;
}

/**
 * Component that enables shake gesture detection to open the feedback modal
 *
 * This component uses the shake.js library to detect device shake gestures
 * and automatically opens the feedback modal when a shake is detected.
 * It's particularly useful for mobile applications where users can shake
 * their device to quickly provide feedback.
 *
 * @param props - Component props
 * @param props.threshold - Shake sensitivity (higher = less sensitive)
 * @param props.timeout - Cooldown period between shake detections
 * @param props.disabled - Whether to disable shake detection
 *
 * @example
 * ```typescript
 * // Basic usage
 * <ShakeDetector />
 *
 * // With custom sensitivity
 * <ShakeDetector threshold={20} timeout={2000} />
 *
 * // Conditionally disabled
 * <ShakeDetector disabled={!isMobile} />
 * ```
 *
 * @remarks
 * - Requires FeedbackProvider to be present in the component tree
 * - Requires the shake.js library to be installed
 * - Only works on devices with motion sensors (mobile devices)
 * - Gracefully handles cases where shake.js is not available
 * - This component renders nothing visually
 */
export const ShakeDetector: React.FC<ShakeDetectorProps> = ({
  threshold = 15,
  timeout = 1000,
  disabled = false,
}) => {
  const { openModal } = useFeedback();

  useEffect(() => {
    if (disabled) return;

    let shake: any = null;

    const initShake = async (): Promise<(() => void) | undefined> => {
      try {
        // Dynamic import with proper error handling
        const shakeModule = await import("shake.js");
        const ShakeJS = shakeModule.default || shakeModule;

        shake = new ShakeJS({
          threshold,
          timeout,
        });

        const handleShake = () => {
          openModal();
        };

        shake.start();
        window.addEventListener("shake", handleShake);

        return () => {
          window.removeEventListener("shake", handleShake);
        };
      } catch (error) {
        console.warn("Shake detection library not available:", error);
        return undefined;
      }
    };

    let cleanup: (() => void) | undefined;
    initShake().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (shake) {
        shake.stop();
      }
      if (cleanup) {
        cleanup();
      }
    };
  }, [openModal, threshold, timeout, disabled]);

  // This component doesn't render anything
  return null;
};

export default ShakeDetector;
