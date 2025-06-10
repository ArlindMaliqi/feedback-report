/**
 * Type declarations for the shake.js library
 * 
 * Provides TypeScript support for the shake.js motion detection library.
 * This file ensures type safety when using shake.js within the feedback system.
 */
declare module 'shake.js' {
  /**
   * Configuration options for the Shake class
   */
  interface ShakeOptions {
    /** Sensitivity threshold for shake detection (default: 15) */
    threshold?: number;
    /** Timeout between shake detections in milliseconds (default: 1000) */
    timeout?: number;
  }

  /**
   * Shake detection class for device motion events
   * 
   * Provides shake gesture detection capabilities using device motion sensors.
   * Primarily designed for mobile devices with accelerometers.
   */
  class Shake {
    /**
     * Creates a new Shake instance
     * @param options - Configuration options for shake detection
     */
    constructor(options?: ShakeOptions);

    /**
     * Starts listening for shake events
     * Call this method to begin detecting shake gestures
     */
    start(): void;

    /**
     * Stops listening for shake events
     * Call this method to stop detecting shake gestures and clean up event listeners
     */
    stop(): void;
  }

  export default Shake;
}
