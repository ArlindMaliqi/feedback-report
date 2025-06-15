import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
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

// Custom render function with explicit type annotation
export const renderWithFeedback = (
  ui: React.ReactElement,
  options: Partial<RenderOptions & TestWrapperProps> = {}
): RenderResult => {
  const { config, mockApiResponse, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper config={config} mockApiResponse={mockApiResponse}>
        {children}
      </TestWrapper>
    ),
    ...renderOptions,
  });
};

// Mock factories
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
