/**
 * Testing utilities for the feedback widget
 * Framework-agnostic testing helpers that work with any testing library
 * @module testing
 */

import {
  createMockFeedback,
  createMockConfig,
  createMockFeedbackProvider,
  testUtils,
  frameworkHelpers
} from './testUtils';

// Re-export utilities
export {
  createMockFeedback,
  createMockConfig,
  createMockFeedbackProvider,
  frameworkHelpers
};

// Mock implementations without Jest dependencies
export const mockImplementations = {
  /**
   * Creates a mock API response function
   * @param success - Whether the response should be successful
   * @returns Mock function that returns a promise
   */
  createMockApiResponse: (success = true) => {
    const mockFn = testUtils.createMockFunction();
    return mockFn.mockResolvedValue({ success });
  },

  /**
   * Creates a mock fetch implementation
   * @param responses - Array of mock responses
   */
  createMockFetch: (responses: any[] = []) => {
    let callCount = 0;
    return testUtils.createMockFunction().mockImplementation(() => {
      const response = responses[callCount] || { success: true };
      callCount++;
      return Promise.resolve({
        ok: response.success !== false,
        status: response.success !== false ? 200 : 500,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response))
      });
    });
  },

  /**
   * Creates a mock local storage implementation
   */
  createMockLocalStorage: () => {
    const storage: Record<string, string> = {};
    return {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach(key => delete storage[key]);
      },
      key: (index: number) => Object.keys(storage)[index] || null,
      get length() {
        return Object.keys(storage).length;
      }
    };
  }
};

// Test utilities without framework dependencies
export const testHelpers = {
  /**
   * Simulates user interaction delay
   */
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Creates a mock event
   */
  createMockEvent: (type: string, options: any = {}) => ({
    type,
    preventDefault: testUtils.createMockFunction(),
    stopPropagation: testUtils.createMockFunction(),
    target: { value: '', ...options.target },
    currentTarget: { value: '', ...options.currentTarget },
    ...options
  }),

  /**
   * Mock window.matchMedia for theme testing
   */
  mockMatchMedia: (matches = false) => {
    const mockFn = testUtils.createMockFunction();
    mockFn.mockReturnValue = {
      matches,
      addListener: testUtils.createMockFunction(),
      removeListener: testUtils.createMockFunction(),
      addEventListener: testUtils.createMockFunction(),
      removeEventListener: testUtils.createMockFunction(),
      dispatchEvent: testUtils.createMockFunction()
    };
    return mockFn;
  }
};

// Export a consolidated testing object
export const feedbackTesting = {
  mocks: mockImplementations,
  helpers: testHelpers,
  utils: testUtils
};

// Export testUtils directly
export { testUtils };
