import type { Feedback } from '../types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  error?: string;
}

/**
 * Validate feedback data
 */
export const validateFeedback = (feedback: Feedback): ValidationResult => {
  const errors: string[] = [];
  
  // Required fields
  if (!feedback.message || feedback.message.trim().length === 0) {
    errors.push('Message is required');
  }
  
  if (!feedback.type) {
    errors.push('Feedback type is required');
  }
  
  // Message length validation
  if (feedback.message && feedback.message.length > 10000) {
    errors.push('Message is too long (max 10,000 characters)');
  }
  
  // Email validation if provided
  if (feedback.email && !isValidEmail(feedback.email)) {
    errors.push('Invalid email format');
  }
  
  // URL validation if provided
  if (feedback.url && !isValidUrl(feedback.url)) {
    errors.push('Invalid URL format');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim();
};
