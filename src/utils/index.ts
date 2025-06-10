import type { ApiResponse } from '../types';

/**
 * Formats a timestamp into a localized string representation
 * @param timestamp - The timestamp to format (Date object or number)
 * @returns Formatted timestamp string
 * @throws Error if timestamp is invalid
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
 * @param response - The fetch Response object
 * @returns Promise resolving to normalized ApiResponse
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
 * @returns A unique string ID combining timestamp and random characters
 * @example
 * ```typescript
 * const id = generateId(); // "feedback_1703539845123_abc123xyz"
 * ```
 */
export const generateId = (): string => {
  return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates feedback message content according to business rules
 * @param message - The feedback message to validate
 * @returns Object indicating validation result and error message if invalid
 * @example
 * ```typescript
 * const result = validateFeedback("Great app!");
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export const validateFeedback = (message: string): { isValid: boolean; error?: string } => {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Feedback message is required' };
  }

  if (message.trim().length < 3) {
    return { isValid: false, error: 'Feedback must be at least 3 characters long' };
  }

  if (message.trim().length > 1000) {
    return { isValid: false, error: 'Feedback must be less than 1000 characters' };
  }

  return { isValid: true };
};