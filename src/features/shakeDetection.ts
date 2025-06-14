/**
 * Shake detection functionality
 * @module features/shakeDetection
 */

interface ShakeDetectionOptions {
  threshold?: number;
  timeout?: number;
  onShake?: () => void;
}

export class ShakeDetection {
  private shake: any;
  private options: ShakeDetectionOptions;
  private isEnabled: boolean = false;

  constructor(options: ShakeDetectionOptions = {}) {
    this.options = {
      threshold: 15,
      timeout: 1000,
      ...options
    };
  }

  async init(): Promise<void> {
    try {
      // Dynamically import shake.js to avoid SSR issues
      const { default: Shake } = await import('shake.js');
      this.shake = new Shake({
        threshold: this.options.threshold,
        timeout: this.options.timeout
      });
    } catch (error) {
      console.warn('Shake.js not available:', error);
    }
  }

  enable(): void {
    if (this.shake && !this.isEnabled) {
      this.shake.start();
      if (this.options.onShake) {
        window.addEventListener('shake', this.options.onShake, false);
      }
      this.isEnabled = true;
    }
  }

  disable(): void {
    if (this.shake && this.isEnabled) {
      this.shake.stop();
      if (this.options.onShake) {
        window.removeEventListener('shake', this.options.onShake, false);
      }
      this.isEnabled = false;
    }
  }

  destroy(): void {
    this.disable();
    this.shake = null;
  }
}

export default ShakeDetection;
