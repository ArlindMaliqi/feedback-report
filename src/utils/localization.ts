/**
 * Localization utilities for internationalization support
 * @module localization
 */
import type { LocalizationConfig } from '../types';

/**
 * Default English messages
 */
export const DEFAULT_MESSAGES: Record<string, Record<string, string>> = {
  en: {
    // Feedback modal
    'modal.title': 'Send Feedback',
    'modal.description': 'We value your feedback to improve our product.',
    'modal.submit': 'Submit Feedback',
    'modal.submitting': 'Submitting...',
    'modal.cancel': 'Cancel',
    'modal.offline.notice': 'You are currently offline. Your feedback will be saved locally and submitted when you\'re back online.',
    'modal.characterCount': '{count}/1000 characters',
    
    // Form fields
    'field.required': 'Required',
    'field.message.label': 'Message',
    'field.message.placeholder': 'Please describe your feedback...',
    'field.type.label': 'Type',
    'field.category.label': 'Category',
    'field.subcategory.label': 'Subcategory',
    'field.subcategory.placeholder': 'Select a subcategory (optional)',
    
    // Types
    'type.bug': 'Bug Report',
    'type.feature': 'Feature Request',
    'type.improvement': 'Improvement',
    'type.other': 'Other',
    
    // User identity
    'identity.name.label': 'Name',
    'identity.email.label': 'Email',
    'identity.remember': 'Remember my information for future feedback',
    'identity.privacy': 'Your information will only be used to follow up on your feedback if necessary.',
    
    // Attachments
    'attachments.title': 'Attachments',
    'attachments.drag': 'Drag files here or click to attach ({count}/{max})',
    'attachments.maxReached': 'Maximum number of attachments reached',
    'attachments.choose': 'Choose Files',
    'attachments.capture': 'Capture Screenshot',
    'attachments.allowedTypes': 'Allowed types: {types}',
    'attachments.maxSize': 'Max size: {size}',
    
    // Validation & errors
    'validation.required': 'This field is required',
    'validation.maxLength': 'Maximum length exceeded',
    'validation.email': 'Please enter a valid email address',
    'validation.fileSize': 'File too large. Maximum size is {size}.',
    'validation.fileType': 'Invalid file type. Allowed types: {types}',
    
    // Notifications
    'notification.success': 'Feedback submitted successfully!',
    'notification.offline': 'Feedback saved locally and will be submitted when you\'re back online',
    'notification.error': 'Failed to submit feedback: {message}',
    'notification.sync': 'Syncing {count} pending feedback items...',
    'notification.syncComplete': 'Feedback synchronization complete',
    
    // Voting
    'vote.button': 'Upvote',
    'vote.voted': 'Voted',
    'vote.alreadyVoted': 'You have already voted for this feedback'
  }
};

/**
 * Additional translations (to be expanded)
 */
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    'modal.title': 'Enviar Comentarios',
    'modal.description': 'Valoramos sus comentarios para mejorar nuestro producto.',
    'modal.submit': 'Enviar Comentarios',
    'modal.submitting': 'Enviando...',
    'modal.cancel': 'Cancelar',
    // More translations to be added
  },
  fr: {
    'modal.title': 'Envoyer des Commentaires',
    'modal.description': 'Nous apprécions vos commentaires pour améliorer notre produit.',
    'modal.submit': 'Envoyer',
    'modal.submitting': 'Envoi en cours...',
    'modal.cancel': 'Annuler',
    // More translations to be added
  },
  de: {
    'modal.title': 'Feedback senden',
    'modal.description': 'Wir schätzen Ihr Feedback, um unser Produkt zu verbessern.',
    'modal.submit': 'Feedback senden',
    'modal.submitting': 'Wird gesendet...',
    'modal.cancel': 'Abbrechen',
    // More translations to be added
  }
};

/**
 * All available messages, including default English and translations
 */
export const ALL_MESSAGES: Record<string, Record<string, string>> = {
  ...DEFAULT_MESSAGES,
  ...TRANSLATIONS
};

/**
 * Creates a translation function based on the provided configuration
 * 
 * @param config - Localization configuration
 * @returns Function to translate message keys
 */
export const createTranslator = (config: LocalizationConfig = { locale: 'en' }): ((key: string, params?: Record<string, string | number>) => string) => {
  const { locale } = config;

  if (typeof config.t === 'function') {
    // Use custom translation function if provided
    return config.t as (key: string, params?: Record<string, string | number>) => string;
  }

  // Use built-in translation system
  const fallbackLocale = config.defaultLocale || 'en';

  // Merge translations
  const translations = {
    ...(config.messages?.[fallbackLocale] || {}),
    ...(config.messages?.[locale] || {})
  };

  // Create a type-safe messages object
  const messages: Record<string, string> = {
    ...(ALL_MESSAGES[fallbackLocale as keyof typeof ALL_MESSAGES] || {}),
    ...(ALL_MESSAGES[locale as keyof typeof ALL_MESSAGES] || {}),
    ...(config.messages?.[fallbackLocale] || {}),
    ...(config.messages?.[locale] || {})
  };
  
  // Return the translation function
  return (key: string, params?: Record<string, string | number>): string => {
    // Get the message from the messages object
    let message = messages[key] || key;
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        message = message.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
      });
    }
    
    return message;
  };
};

/**
 * Gets the text direction for a given locale
 * @param locale - The locale string
 * @returns Text direction ('ltr' or 'rtl')
 */
export const getDirection = (locale: string): 'ltr' | 'rtl' => {
  const rtlLocales = ['ar', 'he', 'fa', 'ur', 'yi', 'ji', 'iw', 'in', 'ku', 'ps', 'sd'];
  const languageCode = locale.split('-')[0].toLowerCase();
  return rtlLocales.includes(languageCode) ? 'rtl' : 'ltr';
};
