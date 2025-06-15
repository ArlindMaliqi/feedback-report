import { useEffect, useCallback } from 'react';
import { useFeedback } from './useFeedback';

interface UseShakeDetectionOptions {
  sensitivity?: number;
  threshold?: number;
  enabled?: boolean;
}

/**
 * Hook for detecting device shake gestures
 * 
 * @param options - Configuration options for shake detection
 * @returns Object with shake detection status and controls
 */
export const useShakeDetection = (options: UseShakeDetectionOptions = {}) => {
  const { 
    sensitivity = 15, 
    threshold = 3, 
    enabled = true 
  } = options;
  
  const { openModal } = useFeedback();

  const handleShake = useCallback(() => {
    if (openModal) {
      openModal();
    }
  }, [openModal]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !window.DeviceMotionEvent) {
      return;
    }

    let shakeCount = 0;
    let lastTime = 0;
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentTime = Date.now();
      if (currentTime - lastTime < 100) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;

      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      const shakeIntensity = (deltaX + deltaY + deltaZ) / deltaTime * 10000;

      if (shakeIntensity > sensitivity) {
        shakeCount++;
        
        if (shakeCount >= threshold) {
          shakeCount = 0;
          handleShake();
        }
      } else {
        shakeCount = Math.max(0, shakeCount - 1);
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    // Request permission on iOS 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [enabled, sensitivity, threshold, handleShake]);

  return {
    enabled,
    sensitivity,
    threshold
  };
};

export default useShakeDetection;