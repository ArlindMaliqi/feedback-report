/**
 * @fileoverview Optimized localization utilities with tree-shaking support
 * @module utils/localization
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.2.0
 */

import type { LocalizationConfig } from '../types';

/**
 * Supported locale codes - reduced to requested languages
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
 * Locale-specific translations structure
 */
export interface LocaleTranslations {
  [locale: string]: TranslationMap;
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
  'feedback.votes.vote': 'Vote',
  'feedback.votes.voted': 'Voted',
  'feedback.user.name': 'Name',
  'feedback.user.email': 'Email',
  'feedback.priority.low': 'Low',
  'feedback.priority.medium': 'Medium',
  'feedback.priority.high': 'High',
  'feedback.priority.critical': 'Critical',
  'notification.success': 'Feedback submitted successfully!',
  'notification.error': 'Error occurred',
  'notification.sync': 'Syncing {count} pending feedback items',
  'notification.syncComplete': 'All feedback synced successfully',
  'notification.offline': 'Your feedback will be saved and sent when you\'re back online',
  'notification.deleted': 'Feedback deleted successfully',
  'notification.deleteError': 'Failed to delete feedback'
};

/**
 * Determines text direction for a given locale
 * @param locale - The locale code to check
 * @returns Text direction ('ltr' or 'rtl')
 * @since 1.2.0
 */
export const getDirection = (locale: string): 'ltr' | 'rtl' => {
  return RTL_LOCALES.includes(locale as any) ? 'rtl' : 'ltr';
};

/**
 * Validates if a locale is supported
 * @param locale - The locale code to validate
 * @returns Whether the locale is supported
 * @since 1.2.0
 */
export const isValidLocale = (locale: string): locale is SupportedLocale => {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
};

/**
 * Gets the fallback locale for unsupported locales
 * @param locale - The requested locale
 * @param fallback - The fallback locale (defaults to 'en')
 * @returns Valid locale code
 * @since 1.2.0
 */
export const getFallbackLocale = (locale: string, fallback: string = 'en'): SupportedLocale => {
  if (isValidLocale(locale)) return locale;
  if (isValidLocale(fallback)) return fallback;
  return 'en';
};

/**
 * Interpolates variables in translation strings
 * @param template - Template string with {{variable}} placeholders
 * @param values - Object with variable values
 * @returns Interpolated string
 * @since 1.3.0
 * 
 * @example
 * ```typescript
 * interpolate('Hello, {{name}}!', { name: 'John' });
 * // Returns: 'Hello, John!'
 * ```
 */
export const interpolate = (template: string, values: Record<string, any> = {}): string => {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
};

/**
 * Creates a translator function with optimized bundle size
 * Only includes translations for the specified locale to minimize bundle size
 * 
 * @param config - Localization configuration
 * @returns Translator function that always returns a string
 * @since 2.0.0
 */
export const createTranslator = (config?: LocalizationConfig) => {
  const locale = config?.locale || 'en';
  const fallbackLocale = getFallbackLocale(config?.fallbackLocale || 'en');
  
  // Get translations for the current locale and fallback
  const currentTranslations = config?.customTranslations?.[locale] || {};
  const fallbackTranslations = config?.customTranslations?.[fallbackLocale] || {};
  
  // Merge translations with priority: current > fallback > default
  const translations = {
    ...DEFAULT_TRANSLATIONS,
    ...fallbackTranslations,
    ...currentTranslations
  };

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
 * Lazy loader for translation bundles
 * Only loads translations when needed to optimize initial bundle size
 * 
 * @param locale - Locale to load
 * @returns Promise with translation map
 * @since 2.0.0
 */
export const loadTranslations = async (locale: SupportedLocale): Promise<TranslationMap> => {
  // Return empty object if English (already included)
  if (locale === 'en') {
    return DEFAULT_TRANSLATIONS;
  }

  try {
    // Dynamic import for tree-shaking
    const module = await import(`../locales/${locale}.json`);
    return module.default || module;
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`, error);
    return {};
  }
};

/**
 * Creates a translation bundle with only required locales
 * This function helps reduce bundle size by only including needed translations
 * 
 * @param locales - Array of required locales
 * @returns Promise with locale-specific translations
 * @since 2.0.0
 */
export const createTranslationBundle = async (
  locales: SupportedLocale[]
): Promise<LocaleTranslations> => {
  const bundle: LocaleTranslations = {
    en: DEFAULT_TRANSLATIONS
  };

  // Load only the required locales - use Array.from to avoid downlevelIteration
  const uniqueLocales = Array.from(new Set(locales)).filter(locale => locale !== 'en');
  
  const loadPromises = uniqueLocales.map(async (locale) => {
    const translations = await loadTranslations(locale);
    bundle[locale] = translations;
  });

  await Promise.all(loadPromises);
  return bundle;
};

/**
 * Optimized locale detection from browser/system
 * @returns Detected locale code
 * @since 2.0.0
 */
export const detectLocale = (): SupportedLocale => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLocale = window.navigator.language || 'en';
  const shortLocale = browserLocale.split('-')[0];
  
  return getFallbackLocale(shortLocale);
};

/**
 * Bundle size estimation utility
 * @param locales - Array of locales to estimate
 * @returns Estimated bundle size impact in bytes
 * @since 2.0.0
 */
export const estimateBundleSize = (locales: SupportedLocale[]): number => {
  // Rough estimation: 2KB per additional locale
  const baseSize = 1500; // English baseline
  const additionalLocales = locales.filter(locale => locale !== 'en').length;
  return baseSize + (additionalLocales * 2000);
};
