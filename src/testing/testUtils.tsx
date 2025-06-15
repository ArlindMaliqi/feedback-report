import React from 'react';
import { FeedbackProvider } from '../components/FeedbackProvider';
import { ThemeProvider } from '../contexts/ThemeContext';
import type { FeedbackConfig } from '../types';

// Enhanced test wrapper with better defaults
interface TestWrapperProps {
  children: React.ReactNode;
  config?: Partial<FeedbackConfig>;
  mockApiResponse?: any;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ 
  children, 
  config = {},
  mockApiResponse 
}) => {
  const defaultConfig: FeedbackConfig = {
    apiEndpoint: '/test/api/feedback',
    enableShakeDetection: false,
    theme: 'light',
    enableOfflineSupport: false,
    disableNetworkRequests: true,
    ...config
  };

  return (
    <ThemeProvider initialTheme="light">
      <FeedbackProvider 
        config={defaultConfig}
        _testProps={{ 
          mockApiResponse,
          disableNetworkRequests: true 
        }}
      >
        {children}
      </FeedbackProvider>
    </ThemeProvider>
  );
};

// Simple mock factory without Jest dependencies
export const createMockFeedback = (overrides = {}) => ({
  id: 'test-feedback-1',
  message: 'Test feedback message',
  type: 'bug' as const,
  timestamp: new Date(),
  votes: 0,
  status: 'open' as const,
  priority: 'medium' as const,
  ...overrides
});

export const createMockConfig = (overrides = {}): FeedbackConfig => ({
  apiEndpoint: '/api/feedback',
  theme: 'system',
  enableShakeDetection: false,
  enableOfflineSupport: true,
  ...overrides
});

interface MockFeedbackProviderProps {
  children: React.ReactNode;
  config?: Partial<FeedbackConfig>;
  mockSubmissions?: any[];
  mockErrors?: any[];
}

export const createMockFeedbackProvider = ({ 
  children, 
  config = {},
  mockSubmissions = [],
  mockErrors = []
}: MockFeedbackProviderProps) => {
  const mockConfig: FeedbackConfig = {
    apiEndpoint: '/api/test-feedback',
    enableShakeDetection: false,
    enableOfflineSupport: false,
    disableNetworkRequests: true,
    theme: 'light',
    ...config
  };

  return (
    <FeedbackProvider
      config={mockConfig}
      _testProps={{
        mockApiResponse: mockSubmissions[0] || { success: true },
        disableNetworkRequests: true
      }}
    >
      {children}
    </FeedbackProvider>
  );
};

// Generic test utilities that work with any testing framework
export const testUtils = {
  // Create a mock function that can be used with any testing framework
  createMockFunction: (): any => {
    const calls: any[][] = [];
    const mockFn = (...args: any[]) => {
      calls.push(args);
      return mockFn.mockReturnValue;
    };
    
    mockFn.calls = calls;
    mockFn.mockReturnValue = undefined;
    mockFn.mockResolvedValue = (value: any) => {
      (mockFn as any).mockReturnValue = Promise.resolve(value);
      return mockFn;
    };
    mockFn.mockRejectedValue = (error: any) => {
      (mockFn as any).mockReturnValue = Promise.reject(error);
      return mockFn;
    };
    mockFn.mockImplementation = (implementation: (...args: any[]) => any) => {
      return Object.assign(mockFn, implementation);
    };
    
    return mockFn;
  },

  // Create a test feedback submission
  createMockSubmission: (success = true) => ({
    success,
    ...(success ? { id: 'mock-id-123' } : { error: 'Mock error' })
  }),

  // Helper to wait for async operations
  waitFor: (condition: () => boolean, timeout = 1000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });
  }
};

// Framework-specific helpers
export const frameworkHelpers = {
  // For React Testing Library users
  rtl: {
    renderWithFeedback: (ui: React.ReactElement, options: Partial<TestWrapperProps> = {}) => {
      // Users will need to import render from @testing-library/react
      console.log('To use this helper, install @testing-library/react and use:');
      console.log('render(ui, { wrapper: (props) => <TestWrapper {...options} {...props} /> })');
      return { ui, options };
    }
  },

  // For Enzyme users
  enzyme: {
    wrapWithFeedback: (Component: React.ComponentType, props = {}) => (
      <TestWrapper>
        <Component {...props} />
      </TestWrapper>
    )
  }
};

export default TestWrapper;
