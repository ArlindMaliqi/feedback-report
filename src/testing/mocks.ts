/**
 * Mock data and utilities for testing
 * @module testing/mocks
 */
import type { FeedbackConfig, Feedback } from '../types';
import { testUtils } from './testUtils';

/**
 * Mock successful fetch response
 */
export const mockSuccessFetch = testUtils.createMockFunction().mockImplementation(
  () => Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, id: 'mock-feedback-id' }),
    text: () => Promise.resolve('{"success": true, "id": "mock-feedback-id"}'),
    headers: new Map([['content-type', 'application/json']])
  })
);

/**
 * Mock error fetch response
 */
export const mockErrorFetch = testUtils.createMockFunction().mockImplementation(
  () => Promise.resolve({
    ok: false,
    status: 500,
    json: () => Promise.resolve({ success: false, error: 'Internal server error' }),
    text: () => Promise.resolve('{"success": false, "error": "Internal server error"}'),
    headers: new Map([['content-type', 'application/json']])
  })
);

/**
 * Mock network error
 */
export const mockNetworkErrorFetch = testUtils.createMockFunction().mockImplementation(
  () => Promise.reject(new Error('Network error'))
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
    trackEvents: true, // Fixed: use trackEvents instead of trackEvent
    ...overrides
  };
};

/**
 * Creates a complete mock feedback configuration for testing
 * 
 * @param overrides - Properties to override in the default configuration
 * @returns Mock feedback configuration
 */
export const createMockConfig = (overrides: Partial<FeedbackConfig> = {}): FeedbackConfig => ({
  apiEndpoint: '/api/feedback',
  theme: 'system',
  enableShakeDetection: false,
  enableOfflineSupport: true,
  collectUserAgent: true,
  collectUrl: true,
  enableVoting: true,
  enableFileAttachments: true,
  maxAttachments: 5,
  maxFileSize: 10 * 1024 * 1024,
  allowedAttachmentTypes: ['image/*', 'application/pdf'],
  categories: [
    {
      id: 'bug',
      name: 'Bug Report',
      description: 'Report a problem'
    },
    {
      id: 'feature',
      name: 'Feature Request',
      description: 'Suggest a new feature'
    }
  ],
  ...overrides
});

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

/**
 * Mock fetch for successful API responses
 */
export const mockFetchSuccess = () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
      status: 200,
      statusText: 'OK'
    } as Response)
  );
};

/**
 * Mock fetch for failed API responses
 */
export const mockFetchError = () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ error: 'Server error' }),
      status: 500,
      statusText: 'Internal Server Error'
    } as Response)
  );
};

/**
 * Mock fetch for network errors
 */
export const mockFetchNetworkError = () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network error'))
  );
};

/**
 * Mock analytics configuration
 */
export const mockAnalyticsConfig: AnalyticsConfig = {
  provider: 'google-analytics',
  trackingId: 'GA_TRACKING_ID',
  trackEvents: true,
  trackPageViews: true,
  customEvents: {}
};

/**
 * Mock feedback configuration
 */
export const mockConfig: FeedbackConfig = {
  apiEndpoint: '/api/feedback',
  theme: 'light',
  enableShakeDetection: true,
  enableOfflineSupport: false,
  enableVoting: true,
  categories: [],
  analytics: mockAnalyticsConfig
};

/**
 * Setup global mocks for testing environment
 */
export const setupGlobalMocks = () => {
  // Mock fetch globally
  if (typeof global !== 'undefined') {
    global.fetch = mockSuccessFetch;
  } else if (typeof window !== 'undefined') {
    (window as any).fetch = mockSuccessFetch;
  }
};

/**
 * Cleanup global mocks
 */
export const cleanupGlobalMocks = () => {
  if (typeof global !== 'undefined') {
    delete (global as any).fetch;
  } else if (typeof window !== 'undefined') {
    delete (window as any).fetch;
  }
};
