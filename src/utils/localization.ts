/**
 * @fileoverview Optimized localization utilities with Next.js compatibility
 * @module utils/localization
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.2.0
 */

import type { LocalizationConfig } from '../types';

/**
 * Supported locale codes
 * @readonly
 */
export const SUPPORTED_LOCALES = [
  'en', 'de', 'es', 'fr', 'nl'
] as const;

/**
 * RTL (Right-to-Left) language codes
 * @readonly
 */
export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'] as const;

/**
 * Type for supported locale codes
 */
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

/**
 * Translation key-value mapping
 */
export interface TranslationMap {
  [key: string]: string;
}

/**
 * Default English translations (always included to minimize bundle)
 * @readonly
 */
const DEFAULT_TRANSLATIONS: TranslationMap = {
  'feedback.title': 'Send Feedback',
  'feedback.submit': 'Submit',
  'feedback.cancel': 'Cancel',
  'feedback.placeholder': 'Tell us what\'s on your mind...',
  'feedback.categories.bug': 'Bug Report',
  'feedback.categories.feature': 'Feature Request',
  'feedback.categories.improvement': 'Improvement',
  'feedback.categories.question': 'Question',
  'feedback.categories.other': 'Other',
  'feedback.success': 'Thank you for your feedback!',
  'feedback.error': 'Something went wrong. Please try again.',
  'feedback.error.empty': 'Please enter your feedback',
  'feedback.required': 'This field is required',
  'feedback.file.tooLarge': 'File size exceeds the limit',
  'feedback.file.invalidType': 'Invalid file type',
  'feedback.file.upload': 'Upload file',
  'feedback.file.remove': 'Remove file',
  'feedback.user.name': 'Name',
  'feedback.user.email': 'Email',
  'notification.success': 'Feedback submitted successfully!',
  'notification.error': 'Error occurred',
  'notification.offline': 'Your feedback will be saved and sent when you\'re back online',
  'validation.messageRequired': 'Message is required'
};

/**
 * Extended translations for other locales (embedded to avoid dynamic imports)
 */
const LOCALE_TRANSLATIONS: Record<string, TranslationMap> = {
  'de': {
    'feedback.title': 'Feedback senden',
    'feedback.submit': 'Senden',
    'feedback.cancel': 'Abbrechen',
    'feedback.placeholder': 'Teilen Sie uns Ihre Gedanken mit...',
    'feedback.success': 'Vielen Dank für Ihr Feedback!',
    'feedback.error': 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
    'notification.success': 'Feedback erfolgreich gesendet!',
    'notification.error': 'Fehler aufgetreten'
  },
  'es': {
    'feedback.title': 'Enviar comentarios',
    'feedback.submit': 'Enviar',
    'feedback.cancel': 'Cancelar',
    'feedback.placeholder': 'Cuéntanos qué piensas...',
    'feedback.success': '¡Gracias por tus comentarios!',
    'feedback.error': 'Algo salió mal. Por favor, inténtalo de nuevo.',
    'notification.success': '¡Comentarios enviados exitosamente!',
    'notification.error': 'Error ocurrido'
  },
  'fr': {
    'feedback.title': 'Envoyer des commentaires',
    'feedback.submit': 'Envoyer',
    'feedback.cancel': 'Annuler',
    'feedback.placeholder': 'Dites-nous ce que vous pensez...',
    'feedback.success': 'Merci pour vos commentaires!',
    'feedback.error': 'Quelque chose s\'est mal passé. Veuillez réessayer.',
    'notification.success': 'Commentaires envoyés avec succès!',
    'notification.error': 'Erreur survenue'
  },
  'nl': {
    'feedback.title': 'Feedback verzenden',
    'feedback.submit': 'Verzenden',
    'feedback.cancel': 'Annuleren',
    'feedback.placeholder': 'Vertel ons wat je denkt...',
    'feedback.success': 'Bedankt voor je feedback!',
    'feedback.error': 'Er ging iets mis. Probeer het opnieuw.',
    'notification.success': 'Feedback succesvol verzonden!',
    'notification.error': 'Fout opgetreden'
  }
};

/**
 * Determines text direction for a given locale
 * @param locale - The locale code to check
 * @returns Text direction ('ltr' or 'rtl')
 */
export const getDirection = (locale: string): 'ltr' | 'rtl' => {
  return RTL_LOCALES.includes(locale as any) ? 'rtl' : 'ltr';
};

/**
 * Interpolates variables in translation strings
 * @param template - Template string with {variable} placeholders
 * @param values - Object with variable values
 * @returns Interpolated string
 */
export const interpolate = (template: string, values: Record<string, any> = {}): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
};

/**
 * Creates a translator function that always returns a string
 * @param config - Localization configuration
 * @returns Translator function
 */
export const createTranslator = (config?: LocalizationConfig) => {
  const locale = config?.locale || 'en';
  const fallbackLocale = config?.fallbackLocale || 'en';
  
  // Get translations with fallback chain
  const getTranslations = () => {
    const base = { ...DEFAULT_TRANSLATIONS };
    
    // Add locale-specific translations
    if (locale !== 'en' && LOCALE_TRANSLATIONS[locale]) {
      Object.assign(base, LOCALE_TRANSLATIONS[locale]);
    }
    
    // Add custom translations
    if (config?.customTranslations?.[locale]) {
      Object.assign(base, config.customTranslations[locale]);
    }
    
    return base;
  };

  const translations = getTranslations();

  /**
   * Translate a key with optional interpolation
   * @param key - Translation key
   * @param values - Values for interpolation
   * @returns Translated string (always returns string)
   */
  return (key: string, values?: Record<string, any>): string => {
    const template = translations[key] || key;
    return values ? interpolate(template, values) : template;
  };
};

/**
 * Load translations for a locale (static version for Next.js compatibility)
 * @param locale - Locale to load
 * @returns Translation map
 */
export const loadTranslations = async (locale: SupportedLocale): Promise<TranslationMap> => {
  // Return English translations if requesting English
  if (locale === 'en') {
    return DEFAULT_TRANSLATIONS;
  }

  // Return embedded translations to avoid dynamic imports
  return LOCALE_TRANSLATIONS[locale] || DEFAULT_TRANSLATIONS;
};

/**
 * Optimized locale detection from browser/system
 * @returns Detected locale code
 */
export const detectLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLocale = window.navigator.language || 'en';
  const shortLocale = browserLocale.split('-')[0];
  
  return SUPPORTED_LOCALES.includes(shortLocale as SupportedLocale) 
    ? shortLocale as SupportedLocale 
    : 'en';
};
