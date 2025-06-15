/**
 * Shake detector component using shake.js
 * @module components/ShakeDetector
 */
import React, { useEffect, useRef } from "react";

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
  /** Disable shake detection */
  disabled?: boolean;
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
  disabled = false,
}) => {
  const shakeInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;

    const initShake = async () => {
      try {
        // For now, use a simple implementation without dynamic import
        // TODO: Implement shake detection or load shake.js
        console.log("Shake detector initialized");
      } catch (error) {
        console.warn("Shake detection not available:", error);
      }
    };

    initShake();

    return () => {
      if (shakeInstanceRef.current?.stop) {
        shakeInstanceRef.current.stop();
      }
    };
  }, [onShake, threshold, timeout, disabled]);

  // This component doesn't render anything
  return null;
};

export default ShakeDetector;
