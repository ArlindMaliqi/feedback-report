import type { LocalizationConfig } from '../../types';

const DEFAULT_TRANSLATIONS = {
  'feedback.title': 'Send Feedback',
  'feedback.submit': 'Submit',
  'feedback.cancel': 'Cancel',
  'feedback.placeholder': 'Tell us what you think...',
  'feedback.success': 'Thank you for your feedback!',
  'feedback.error': 'Failed to submit feedback',
  'feedback.error.empty': 'Please enter your feedback',
  'notification.success': 'Feedback submitted successfully',
  'notification.error': 'Failed to submit feedback',
  'notification.offline': 'You are offline',
  'notification.sync': 'Syncing {count} items...',
  'notification.syncComplete': 'Sync completed',
  'validation.messageRequired': 'Message is required'
};

/**
 * Create a translator function
 */
export const createTranslator = (config?: LocalizationConfig) => {
  return (key: string, params?: Record<string, any>): string => {
    let translation = DEFAULT_TRANSLATIONS[key as keyof typeof DEFAULT_TRANSLATIONS] || key;
    
    // Apply custom translations
    if (config?.customTranslations?.[config.locale]?.[key]) {
      translation = config.customTranslations[config.locale][key];
    }
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    
    return translation;
  };
};

/**
 * Get text direction for locale
 */
export const getDirection = (locale: string): 'ltr' | 'rtl' => {
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
};
