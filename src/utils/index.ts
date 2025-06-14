/**
 * Core utility functions
 * @module utils
 */

import type { Feedback } from '../types';

/**
 * Generates a unique ID for feedback items
 */
export const generateId = (): string => {
  return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates feedback data
 */
export const validateFeedback = (feedback: Feedback): { isValid: boolean; errors?: string[]; error?: string } => {
  const errors: string[] = [];

  if (!feedback.message || feedback.message.trim().length === 0) {
    errors.push('Message is required');
  }

  if (feedback.message && feedback.message.length > 5000) {
    errors.push('Message is too long (max 5000 characters)');
  }

  if (!feedback.type) {
    errors.push('Feedback type is required');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    error: errors.length > 0 ? errors[0] : undefined
  };
};

/**
 * Handles API response with proper error handling
 */
export const handleApiResponse = async (response: Response): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText || response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Formats a timestamp for display
 */
export const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};