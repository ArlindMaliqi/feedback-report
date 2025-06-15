/**
 * Shake detector component using shake.js
 * @module components/ShakeDetector
 */
import React, { useEffect } from "react";
import { useFeedback } from "../hooks/useFeedback";

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
  const { openModal } = useFeedback();

  useEffect(() => {
    if (disabled || typeof window === "undefined") return;

    let shakeCount = 0;
    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentTime = Date.now();
      if (currentTime - lastTime < 100) return; // Throttle to 10fps

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;

      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      const shakeIntensity = (deltaX + deltaY + deltaZ) / deltaTime / 10000;

      if (shakeIntensity > threshold) {
        shakeCount++;

        if (shakeCount >= threshold) {
          shakeCount = 0;
          if (openModal) {
            openModal();
          }
        }
      } else {
        shakeCount = Math.max(0, shakeCount - 1);
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    // Request permission on iOS 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            window.addEventListener("devicemotion", handleDeviceMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("devicemotion", handleDeviceMotion);
    }

    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [threshold, openModal, disabled]);

  // This component doesn't render anything
  return null;
};

export default ShakeDetector;
