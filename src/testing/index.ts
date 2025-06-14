/**
 * Testing utilities for the feedback system
 * @module testing
 */
import React, { ReactNode } from 'react';
import { FeedbackProvider } from '../components/FeedbackProvider';
import { ThemeProvider } from '../contexts/ThemeContext';
import type { FeedbackConfig, Feedback, ThemePreference } from '../types';

/**
 * Props for the test wrapper component
 */
interface TestWrapperProps {
  /** Child components to render inside the wrapper */
  children: ReactNode;
  /** Mock configuration for the feedback system */
  mockConfig?: Partial<FeedbackConfig>;
  /** Initial theme preference */
  theme?: ThemePreference;
  /** Initial feedback items to populate the context */
  initialFeedback?: Feedback[];
  /** Whether the modal should be open initially */
  modalOpen?: boolean;
}

/**
 * Test props that can be passed to FeedbackProvider for testing purposes
 */
interface FeedbackProviderTestProps {
  initialFeedback?: Feedback[];
  modalOpen?: boolean;
}

/**
 * Wraps components with the necessary providers for testing
 * 
 * This utility makes it easier to test components that depend on
 * the feedback context or theme context.
 * 
 * @param props - Component props
 * @returns Wrapped component tree
 */
export const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  mockConfig = {},
  theme = 'light',
  initialFeedback = [],
  modalOpen = false
}) => {
  // Create base config with common testing defaults
  const testConfig: FeedbackConfig = {
    // Mock API endpoint that won't actually make network requests
    apiEndpoint: 'http://localhost/mock-api',
    // Disable API calls by default in tests
    disableNetworkRequests: true,
    // Enable offline support for testing that flow
    enableOfflineSupport: true,
    // Other default settings
    ...mockConfig,
    // Add testing flag
    isTestEnvironment: true
  };

  // Create the component tree correctly
  return React.createElement(
    ThemeProvider, 
    { initialTheme: theme, children: 
      React.createElement(
        FeedbackProvider,
        { 
          config: testConfig,
          _testProps: { initialFeedback, modalOpen } as FeedbackProviderTestProps,
          children
        }
      )
    }
  );
};

/**
 * Creates a mock feedback item for testing
 * 
 * @param overrides - Properties to override in the default mock
 * @returns A mock feedback item
 * 
 * @example
 * ```tsx
 * const mockFeedback = createMockFeedback({ 
 *   message: 'Custom message',
 *   type: 'bug'
 * });
 * ```
 */
export const createMockFeedback = (overrides: Partial<Feedback> = {}): Feedback => {
  return {
    id: `mock-${Date.now()}`,
    message: 'This is a mock feedback message for testing',
    timestamp: new Date(),
    type: 'other',
    ...overrides
  };
};

/**
 * Creates a jest mock for the useFeedback hook
 * 
 * @param overrides - Values to override in the default mock
 * @returns A mock implementation of the useFeedback hook
 * 
 * @example
 * ```tsx
 * // In your test file:
 * jest.mock('react-feedback-report-widget', () => ({
 *   ...jest.requireActual('react-feedback-report-widget'),
 *   useFeedback: createMockUseFeedback({
 *     isModalOpen: true,
 *     feedbacks: [createMockFeedback()]
 *   })
 * }));
 * ```
 */
export const createMockUseFeedback = (overrides: Partial<ReturnType<typeof import('../hooks/useFeedback')['useFeedback']>> = {}) => {
  return jest.fn().mockReturnValue({
    isModalOpen: false,
    feedbacks: [],
    openModal: jest.fn(),
    closeModal: jest.fn(),
    submitFeedback: jest.fn(),
    isSubmitting: false,
    error: null,
    isOffline: false,
    syncOfflineFeedback: jest.fn(),
    voteFeedback: jest.fn(),
    categories: [],
    ...overrides
  });
};

/**
 * Setup function for React Testing Library tests
 * 
 * @param ui - The UI component to render
 * @param options - Test wrapper options
 * @returns React Testing Library render result with additional helper methods
 * 
 * @example
 * ```tsx
 * import { setupTest } from 'react-feedback-report-widget/testing';
 * 
 * test('component works with feedback', () => {
 *   const { getByText, openFeedbackModal } = setupTest(<MyComponent />);
 *   
 *   // Open the feedback modal programmatically
 *   openFeedbackModal();
 *   
 *   expect(getByText('Send Feedback')).toBeInTheDocument();
 * });
 * ```
 */
export const setupTest = (
  ui: React.ReactElement,
  options: Omit<TestWrapperProps, 'children'> = {}
) => {
  // This function is meant to be used with @testing-library/react
  // We define it here but in the actual implementation it would require
  // the testing library to be installed.
  
  // Placeholder implementation
  return {
    openFeedbackModal: () => console.log('Calling openFeedbackModal would trigger the feedback modal in a test'),
    submitMockFeedback: (message: string, type?: Feedback['type']) => 
      console.log(`Calling submitMockFeedback would submit feedback: ${message} (${type || 'other'})`)
  };
};

// Re-export mocks to maintain the same API
export * from './mocks';
