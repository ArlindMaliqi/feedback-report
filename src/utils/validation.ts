import type { Feedback, FeedbackConfig } from '../types';

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates feedback message
 */
export const validateMessage = (message: string): boolean => {
  return message.trim().length > 0;
};

/**
 * Validates file size
 */
export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * Validates file type
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

/**
 * Validates complete feedback object
 */
export const validateFeedback = (feedback: Partial<Feedback>, config: FeedbackConfig): string[] => {
  const errors: string[] = [];

  if (!feedback.message || !validateMessage(feedback.message)) {
    errors.push('Message is required');
  }

  if (config.collectUserIdentity && config.requiredIdentityFields) {
    config.requiredIdentityFields.forEach(field => {
      if (!feedback.user?.[field as keyof typeof feedback.user]) {
        errors.push(`${field} is required`);
      }
    });
  }

  if (feedback.user?.email && !validateEmail(feedback.user.email)) {
    errors.push('Invalid email format');
  }

  return errors;
};
