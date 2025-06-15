/**
 * Type declarations for the shake.js library
 * 
 * This module provides TypeScript support for the shake.js motion detection library,
 * which enables shake gesture detection using device motion sensors. It's primarily
 * designed for mobile devices with accelerometers and is used in the feedback widget
 * to trigger feedback collection through shake gestures.
 * 
 * The shake detection is particularly useful for mobile applications where users
 * can shake their device to quickly access the feedback interface without having
 * to locate and tap a feedback button.
 * 
 * @module types/shake
 * @version 1.0.0
 * @author ArlindMaliqi
 * @since 1.5.0
 * 
 * @see {@link https://github.com/alexgibson/shake.js} Original shake.js library
 * 
 * @example Basic usage in feedback widget
 * ```typescript
 * import Shake from 'shake.js';
 * 
 * const myShakeEvent = new Shake({
 *   threshold: 15,
 *   timeout: 1000
 * });
 * 
 * myShakeEvent.start();
 * 
 * window.addEventListener('shake', () => {
 *   // Open feedback modal
 *   openFeedbackModal();
 * });
 * ```
 * 
 * @example Integration with React feedback widget
 * ```typescript
 * useEffect(() => {
 *   if (enableShakeDetection) {
 *     const shakeEvent = new Shake({
 *       threshold: 20,
 *       timeout: 1500
 *     });
 * 
 *     const handleShake = () => {
 *       openModal();
 *     };
 * 
 *     window.addEventListener('shake', handleShake);
 *     shakeEvent.start();
 * 
 *     return () => {
 *       window.removeEventListener('shake', handleShake);
 *       shakeEvent.stop();
 *     };
 *   }
 * }, [enableShakeDetection, openModal]);
 * ```
 */
declare module 'shake.js' {
  /**
   * Configuration options for shake detection sensitivity and behavior
   * 
   * These options allow fine-tuning of the shake detection algorithm to work
   * optimally across different devices and use cases. The default values work
   * well for most scenarios but can be adjusted based on user feedback and testing.
   * 
   * @interface ShakeOptions
   * @since 1.5.0
   * 
   * @example Sensitive shake detection
   * ```typescript
   * const sensitiveOptions: ShakeOptions = {
   *   threshold: 10,  // Lower threshold = more sensitive
   *   timeout: 500    // Shorter timeout = more responsive
   * };
   * ```
   * 
   * @example Conservative shake detection
   * ```typescript
   * const conservativeOptions: ShakeOptions = {
   *   threshold: 25,  // Higher threshold = less sensitive
   *   timeout: 2000   // Longer timeout = prevents accidental triggers
   * };
   * ```
   */
  interface ShakeOptions {
    /**
     * Sensitivity threshold for shake detection
     * 
     * This value determines how vigorous a shake motion must be to trigger
     * the shake event. Lower values make the detection more sensitive,
     * while higher values require more pronounced shaking.
     * 
     * The threshold is measured in device motion units and should be adjusted
     * based on the target device types and user preferences.
     * 
     * @default 15
     * @minimum 1
     * @maximum 100
     * 
     * @example
     * ```typescript
     * // Very sensitive - triggers with gentle movement
     * threshold: 5
     * 
     * // Default sensitivity - balanced for most use cases
     * threshold: 15
     * 
     * // Low sensitivity - requires vigorous shaking
     * threshold: 30
     * ```
     */
    threshold?: number;

    /**
     * Timeout between consecutive shake detections in milliseconds
     * 
     * This prevents multiple shake events from firing in rapid succession,
     * which could lead to poor user experience. After a shake is detected,
     * subsequent shakes are ignored for this duration.
     * 
     * A shorter timeout makes the system more responsive but may cause
     * unintended multiple triggers. A longer timeout prevents accidental
     * multiple activations but may feel less responsive.
     * 
     * @default 1000
     * @minimum 100
     * @maximum 5000
     * 
     * @example
     * ```typescript
     * // Responsive - allows frequent shake triggers
     * timeout: 500
     * 
     * // Default - balanced responsiveness and stability
     * timeout: 1000
     * 
     * // Conservative - prevents accidental multiple triggers
     * timeout: 2000
     * ```
     */
    timeout?: number;
  }

  /**
   * Shake detection class for device motion events
   * 
   * This class provides shake gesture detection capabilities using device motion sensors.
   * It's designed primarily for mobile devices with accelerometers and creates a global
   * 'shake' event that can be listened to throughout the application.
   * 
   * The shake detection algorithm analyzes device motion data to identify shake patterns
   * and fires custom events when shakes are detected. This is particularly useful for
   * mobile web applications where shake gestures can trigger actions like feedback
   * collection, debugging tools, or easter eggs.
   * 
   * Browser Support:
   * - iOS Safari: Full support
   * - Chrome Mobile: Full support
   * - Firefox Mobile: Full support
   * - Desktop browsers: Limited (no accelerometer)
   * 
   * @class Shake
   * @since 1.5.0
   * 
   * @example Basic shake detection setup
   * ```typescript
   * const shakeDetector = new Shake({
   *   threshold: 15,
   *   timeout: 1000
   * });
   * 
   * // Start listening for device motion
   * shakeDetector.start();
   * 
   * // Listen for shake events
   * window.addEventListener('shake', () => {
   *   console.log('Device was shaken!');
   * });
   * 
   * // Stop listening when done
   * shakeDetector.stop();
   * ```
   * 
   * @example Integration with feedback widget
   * ```typescript
   * class FeedbackWidget {
   *   private shakeDetector: Shake;
   * 
   *   constructor() {
   *     this.shakeDetector = new Shake({
   *       threshold: 20,
   *       timeout: 1500
   *     });
   *   }
   * 
   *   enableShakeToFeedback() {
   *     window.addEventListener('shake', this.openFeedbackModal);
   *     this.shakeDetector.start();
   *   }
   * 
   *   disableShakeToFeedback() {
   *     window.removeEventListener('shake', this.openFeedbackModal);
   *     this.shakeDetector.stop();
   *   }
   * 
   *   private openFeedbackModal = () => {
   *     // Show feedback interface
   *   }
   * }
   * ```
   */
  class Shake {
    /**
     * Creates a new Shake detection instance
     * 
     * Initializes the shake detection system with the provided configuration.
     * The instance must be started with the `start()` method before it will
     * begin detecting shake gestures.
     * 
     * @param options - Configuration options for shake detection behavior
     * 
     * @example Default configuration
     * ```typescript
     * const shake = new Shake();
     * ```
     * 
     * @example Custom configuration
     * ```typescript
     * const shake = new Shake({
     *   threshold: 20,    // Less sensitive
     *   timeout: 2000     // Longer cooldown
     * });
     * ```
     * 
     * @example Mobile-optimized configuration
     * ```typescript
     * const shake = new Shake({
     *   threshold: 12,    // Slightly more sensitive for mobile
     *   timeout: 800      // Faster response for mobile users
     * });
     * ```
     */
    constructor(options?: ShakeOptions);

    /**
     * Starts listening for device motion events and shake detection
     * 
     * This method begins monitoring device motion sensors and will start
     * firing 'shake' events when shake gestures are detected. The method
     * automatically handles browser compatibility and permission requests
     * where required (e.g., iOS 13+ device motion permissions).
     * 
     * It's safe to call this method multiple times - subsequent calls will
     * be ignored if shake detection is already active.
     * 
     * Browser Permissions:
     * - iOS 13+: Requires user permission for device motion
     * - Android: Usually no permission required
     * - Desktop: No effect (no accelerometer)
     * 
     * @throws {Error} May throw if device motion is not supported
     * 
     * @example Basic usage
     * ```typescript
     * const shake = new Shake();
     * shake.start();
     * 
     * window.addEventListener('shake', () => {
     *   console.log('Shake detected!');
     * });
     * ```
     * 
     * @example With error handling
     * ```typescript
     * const shake = new Shake();
     * 
     * try {
     *   shake.start();
     *   console.log('Shake detection started');
     * } catch (error) {
     *   console.warn('Shake detection not available:', error);
     * }
     * ```
     * 
     * @example iOS permission handling
     * ```typescript
     * const shake = new Shake();
     * 
     * // For iOS 13+, request permission first
     * if (typeof DeviceOrientationEvent.requestPermission === 'function') {
     *   DeviceOrientationEvent.requestPermission()
     *     .then(response => {
     *       if (response === 'granted') {
     *         shake.start();
     *       }
     *     });
     * } else {
     *   shake.start();
     * }
     * ```
     */
    start(): void;

    /**
     * Stops listening for device motion events and disables shake detection
     * 
     * This method stops monitoring device motion sensors and removes all
     * event listeners associated with shake detection. After calling this
     * method, no more 'shake' events will be fired until `start()` is
     * called again.
     * 
     * This method should be called when shake detection is no longer needed
     * to free up system resources and prevent memory leaks. It's particularly
     * important to call this in React component cleanup functions or when
     * navigating away from pages that use shake detection.
     * 
     * It's safe to call this method multiple times - subsequent calls will
     * be ignored if shake detection is already stopped.
     * 
     * @example Basic cleanup
     * ```typescript
     * const shake = new Shake();
     * shake.start();
     * 
     * // Later, when no longer needed
     * shake.stop();
     * ```
     * 
     * @example React component cleanup
     * ```typescript
     * useEffect(() => {
     *   const shake = new Shake();
     *   shake.start();
     * 
     *   const handleShake = () => {
     *     openFeedbackModal();
     *   };
     * 
     *   window.addEventListener('shake', handleShake);
     * 
     *   return () => {
     *     window.removeEventListener('shake', handleShake);
     *     shake.stop(); // Important: cleanup shake detection
     *   };
     * }, []);
     * ```
     * 
     * @example Conditional stop
     * ```typescript
     * class FeedbackSystem {
     *   private shake: Shake;
     * 
     *   constructor() {
     *     this.shake = new Shake();
     *   }
     * 
     *   enableShakeDetection() {
     *     this.shake.start();
     *   }
     * 
     *   disableShakeDetection() {
     *     this.shake.stop();
     *   }
     * 
     *   destroy() {
     *     this.shake.stop(); // Ensure cleanup
     *   }
     * }
     * ```
     */
    stop(): void;
  }

  export default Shake;
}
