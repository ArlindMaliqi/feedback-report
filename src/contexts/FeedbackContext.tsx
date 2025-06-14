/**
 * Feedback and Localization Context definitions
 * @module contexts/FeedbackContext
 */
import { createContext } from 'react';
import type { FeedbackContextType } from '../types';

/**
 * Localization context type
 */
export interface LocalizationContextType {
  t: (key: string, values?: Record<string, any>) => string;
  locale: string;
  direction: 'ltr' | 'rtl';
}

/**
 * Feedback context for managing feedback state
 */
export const FeedbackContext = createContext<FeedbackContextType | null>(null);

/**
 * Localization context for managing translations
 */
export const LocalizationContext = createContext<LocalizationContextType | null>(null);

FeedbackContext.displayName = 'FeedbackContext';
LocalizationContext.displayName = 'LocalizationContext';
