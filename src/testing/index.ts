/**
 * Testing utilities for the feedback system
 * @module testing
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.0.0
 */
import React, { ReactNode } from 'react';
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
 * Creates a mock feedback object for testing
 */
export const createMockFeedback = (): Feedback => ({
  id: 'test-feedback-1',
  message: 'This is a test feedback',
  type: 'bug',
  timestamp: new Date(),
  votes: 0,
  status: 'open',
  priority: 'medium'
});

/**
 * Creates a mock feedback API response
 */
export const createMockApiResponse = (success: boolean = true, data?: any) => {
  return Promise.resolve({
    ok: success,
    json: () => Promise.resolve(data || { success }),
    status: success ? 200 : 400,
    statusText: success ? 'OK' : 'Bad Request'
  } as Response);
};

/**
 * Mock for testing purposes
 */
export const mockFeedbackSubmission = () => {
  return jest.fn().mockResolvedValue({ success: true });
};

/**
 * Mock feedback provider for testing
 */
export const createMockFeedbackProvider = ({ children }: { children: ReactNode }) => {
  return React.createElement('div', { 'data-testid': 'mock-feedback-provider' }, children);
};
