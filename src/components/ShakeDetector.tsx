/**
 * Shake detector component using shake.js
 * @module components/ShakeDetector
 */
import React, { useEffect } from "react";

/**
 * Props for the ShakeDetector component
 */
interface ShakeDetectorProps {
  /** Callback function to be called when a shake is detected */
  onShake?: () => void;
  /** Sensitivity threshold for shake detection (default: 15) */
  threshold?: number;
  /** Timeout between shake detections in milliseconds (default: 1000) */
  timeout?: number;
}

/**
 * Component that enables shake gesture detection
 *
 * This component uses the shake.js library to detect device shake gestures
 * and calls the provided `onShake` callback when a shake is detected.
 * It's particularly useful for mobile applications where users can shake
 * their device to trigger certain actions.
 *
 * @param props - Component props
 * @param props.onShake - Callback function to be called on shake
 * @param props.threshold - Shake sensitivity (higher = less sensitive)
 * @param props.timeout - Cooldown period between shake detections
 *
 * @example
 * ```typescript
 * // Basic usage
 * <ShakeDetector onShake={() => console.log('Shaken!')} />
 *
 * // With custom sensitivity
 * <ShakeDetector onShake={handleShake} threshold={20} timeout={2000} />
 * ```
 *
 * @remarks
 * - Requires the shake.js library to be installed
 * - Only works on devices with motion sensors (mobile devices)
 * - Gracefully handles cases where shake.js is not available
 * - This component renders nothing visually
 */
export const ShakeDetector: React.FC<ShakeDetectorProps> = ({
  onShake,
  threshold = 15,
  timeout = 1000,
}) => {
  useEffect(() => {
    let shakeInstance: any = null;

    const initializeShake = async () => {
      try {
        // Dynamically import shake.js
        const Shake = (await import("shake.js")).default;

        shakeInstance = new Shake({
          threshold,
          timeout,
        });

        shakeInstance.start();

        if (onShake) {
          window.addEventListener("shake", onShake);
        }
      } catch (error) {
        console.warn("Shake detection not available:", error);
      }
    };

    initializeShake();

    return () => {
      if (shakeInstance) {
        shakeInstance.stop();
      }
      if (onShake) {
        window.removeEventListener("shake", onShake);
      }
    };
  }, [onShake, threshold, timeout]);

  // This component doesn't render anything
  return null;
};

export default ShakeDetector;
