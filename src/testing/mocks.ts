/**
 * Mock implementations for testing the feedback system
 * @module testing/mocks
 */
import type { FeedbackConfig, Feedback, AnalyticsConfig, IssueTrackerConfig } from '../types';

/**
 * Mock fetch implementation that returns successful responses
 * 
 * @param url - The URL being fetched
 * @param options - Fetch options
 * @returns Promise resolving to a mock Response
 */
export const mockSuccessFetch = jest.fn().mockImplementation(
  (url: string, options?: RequestInit) => {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: { id: 'mock-id' } }),
      text: () => Promise.resolve('Success'),
      headers: new Headers({ 'content-type': 'application/json' })
    } as Response);
  }
);

/**
 * Mock fetch implementation that returns error responses
 * 
 * @param url - The URL being fetched
 * @param options - Fetch options
 * @returns Promise resolving to a mock Response
 */
export const mockErrorFetch = jest.fn().mockImplementation(
  (url: string, options?: RequestInit) => {
    return Promise.resolve({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ success: false, error: 'Mock error' }),
      text: () => Promise.resolve('Error'),
      headers: new Headers({ 'content-type': 'application/json' })
    } as Response);
  }
);

/**
 * Mock fetch implementation that simulates network errors
 * 
 * @param url - The URL being fetched
 * @param options - Fetch options
 * @returns Promise rejecting with a network error
 */
export const mockNetworkErrorFetch = jest.fn().mockImplementation(
  (url: string, options?: RequestInit) => {
    return Promise.reject(new Error('Network error'));
  }
);

/**
 * Creates a mock issue tracker configuration for testing
 * 
 * @param overrides - Properties to override in the default configuration
 * @returns Mock issue tracker configuration
 */
export const createMockIssueTrackerConfig = (overrides: Partial<IssueTrackerConfig> = {}): IssueTrackerConfig => {
  return {
    provider: 'github',
    apiEndpoint: 'https://api.github.com',
    apiToken: 'mock-token',
    owner: 'mock-owner',
    repository: 'mock-repo',
    ...overrides
  };
};

/**
 * Creates a mock analytics configuration for testing
 * 
 * @param overrides - Properties to override in the default configuration
 * @returns Mock analytics configuration
 */
export const createMockAnalyticsConfig = (overrides: Partial<AnalyticsConfig> = {}): AnalyticsConfig => {
  return {
    provider: 'google-analytics',
    trackingId: 'UA-MOCK-ID',
    eventName: 'mock_feedback_event',
    trackEvent: jest.fn(),
    ...overrides
  };
};

/**
 * Creates a complete mock feedback configuration for testing
 * 
 * @param overrides - Properties to override in the default configuration
 * @returns Mock feedback configuration
 */
export const createMockFeedbackConfig = (overrides: Partial<FeedbackConfig> = {}): FeedbackConfig => {
  return {
    apiEndpoint: 'http://localhost/mock-api',
    enableOfflineSupport: true,
    enableVoting: true,
    collectUserAgent: false,
    collectUrl: false,
    enableAttachments: true,
    maxAttachments: 3,
    analytics: createMockAnalyticsConfig(),
    issueTracker: createMockIssueTrackerConfig(),
    isTestEnvironment: true,
    ...overrides
  };
};

/**
 * Mocks the localStorage API for testing
 * 
 * @param initialData - Initial data to populate in the mock storage
 * @returns Mock localStorage implementation
 */
export const mockLocalStorage = (initialData: Record<string, string> = {}) => {
  const store: Record<string, string> = { ...initialData };
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    }),
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
    length: Object.keys(store).length,
    _getStore: () => ({ ...store }) // Helper for test assertions
  };
};
