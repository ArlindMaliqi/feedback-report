import { useEffect, useCallback } from 'react';
import { useFeedback } from './useFeedback';

// Define shake.js types since they might not be available
declare global {
  interface Window {
    DeviceMotionEvent: any;
  }
}

/**
 * Configuration options for shake detection
 */
interface ShakeOptions {
  /** Sensitivity threshold for detecting shakes (default: 15) */
  threshold?: number;
  /** Timeout between shake detections in milliseconds */
  timeout?: number;
}

/**
 * Custom hook that enables shake detection to open the feedback modal
 * 
 * Uses the device's motion sensors to detect shake gestures and automatically
 * opens the feedback modal when a shake is detected. Falls back gracefully
 * if motion events are not supported on the device.
 * 
 * @param options - Configuration options for shake detection
 * @param options.threshold - Sensitivity threshold (higher = less sensitive)
 * @param options.timeout - Cooldown period between detections
 * 
 * @example
 * ```typescript
 * function MyApp() {
 *   // Enable shake detection with custom sensitivity
 *   useShakeDetection({ threshold: 20 });
 *   
 *   return <div>Shake your device to give feedback!</div>;
 * }
 * ```
 * 
 * @remarks
 * - Requires FeedbackProvider to be present in the component tree
 * - Only works on devices with motion sensors (mobile devices)
 * - Automatically handles cleanup when component unmounts
 */
export const useShakeDetection = (options: ShakeOptions = {}) => {
  const { openModal } = useFeedback();
  const { threshold = 15 } = options;

  const handleShake = useCallback(() => {
    openModal();
  }, [openModal]);

  useEffect(() => {
    // Check if device supports motion events
    if (!window.DeviceMotionEvent) {
      console.warn('Shake detection not supported on this device');
      return;
    }

    let lastTime = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const current = Date.now();

      if (current - lastTime < 100) return;

      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const x = accelerationIncludingGravity.x ?? 0;
      const y = accelerationIncludingGravity.y ?? 0;
      const z = accelerationIncludingGravity.z ?? 0;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);

        const acceleration = deltaX + deltaY + deltaZ;

        if (acceleration > threshold) {
          handleShake();
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
      lastTime = current;
    };

    window.addEventListener('devicemotion', handleDeviceMotion);

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [threshold, handleShake]);
};

export default useShakeDetection;