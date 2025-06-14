/**
 * Core utility functions for feedback management and processing
 * @module utils/index
 */
import type { ApiResponse, Feedback } from '../types';

/**
 * Formats a timestamp into a localized string representation
 * 
 * Supports both Date objects and numeric timestamps, with automatic
 * validation and error handling for invalid inputs.
 * 
 * @param timestamp - The timestamp to format (Date object or number)
 * @returns Formatted timestamp string using the browser's locale
 * @throws {Error} When timestamp is invalid or cannot be parsed
 * 
 * @example
 * ```typescript
 * formatTimestamp(new Date()) // "12/25/2023, 3:30:45 PM"
 * formatTimestamp(1703539845000) // "12/25/2023, 3:30:45 PM"
 * ```
 */
export const formatTimestamp = (timestamp: number | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp provided');
  }

  return date.toLocaleString();
};

/**
 * Handles and normalizes API responses into a consistent format
 * 
 * Provides unified error handling and response processing for all
 * API interactions within the feedback system.
 * 
 * @param response - The fetch Response object from an API call
 * @returns Promise resolving to normalized ApiResponse with success/error status
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/feedback');
 * const result = await handleApiResponse(response);
 * if (result.success) {
 *   console.log('Data:', result.data);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export const handleApiResponse = async <T = any>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse response',
    };
  }
};

/**
 * Generates a unique identifier for feedback entries
 * 
 * Creates collision-resistant IDs using timestamp and random components
 * for reliable feedback tracking and management.
 * 
 * @returns A unique string ID combining timestamp and random characters
 * 
 * @example
 * ```typescript
 * const id = generateId(); // "feedback_1703539845123_abc123xyz"
 * ```
 */
export const generateId = (): string => {
  return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates feedback data against business rules and constraints
 * 
 * Performs comprehensive validation including message content, type validation,
 * email format checking, and length constraints to ensure data quality.
 * 
 * @param feedback - The feedback object to validate
 * @returns Validation result object with detailed error information
 * 
 * @example
 * ```typescript
 * const result = validateFeedback({
 *   id: 'test',
 *   message: 'Great app!',
 *   type: 'feature',
 *   timestamp: Date.now()
 * });
 * 
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export const validateFeedback = (feedback: Feedback): { 
  /** Whether the feedback passes all validation rules */
  isValid: boolean; 
  /** Primary error message for display */
  error?: string; 
  /** Array of all validation error messages */
  errors?: string[] 
} => {
  const errors: string[] = [];

  // Message validation
  if (!feedback.message || feedback.message.trim().length === 0) {
    errors.push("Message is required");
  }

  if (feedback.message && feedback.message.length > 5000) {
    errors.push("Message is too long (maximum 5000 characters)");
  }

  // Type validation
  if (!feedback.type || !["bug", "feature", "improvement", "other"].includes(feedback.type)) {
    errors.push("Invalid feedback type");
  }

  // Email validation if provided
  if (feedback.user?.email && !isValidEmail(feedback.user.email)) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors[0] : undefined,
    errors
  };
};

/**
 * Validates email format using RFC-compliant regular expression
 * 
 * @param email - Email address to validate
 * @returns True if email format is valid, false otherwise
 * @internal
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};