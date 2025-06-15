/**
 * @fileoverview Optimized localization hook with bundle size optimization
 * @module hooks/useLocalization
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.2.0
 */

import { useMemo, useEffect, useState } from 'react';
import { 
  createTranslator, 
  getDirection, 
  detectLocale, 
  loadTranslations,
  type SupportedLocale 
} from '../utils/localization';
import type { LocalizationConfig } from '../types';

/**
 * Configuration for the localization hook
 */
interface UseLocalizationOptions extends LocalizationConfig {
  /** Whether to automatically detect browser locale */
  autoDetect?: boolean;
  /** Whether to lazy load translation bundles */
  lazyLoad?: boolean;
}

/**
 * Return type for the localization hook
 */
interface LocalizationHookReturn {
  /** Current locale */
  locale: string;
  /** Text direction */
  direction: 'ltr' | 'rtl';
  /** Translation function - always returns string */
  t: (key: string, values?: Record<string, any>) => string;
  /** Whether the locale uses RTL */
  isRTL: boolean;
  /** Whether translations are currently loading */
  loading: boolean;
  /** Error if translation loading failed */
  error: string | null;
  /** Function to change locale dynamically */
  setLocale: (locale: SupportedLocale) => void;
}

/**
 * Optimized localization hook with bundle size optimization
 * 
 * @param options - Localization configuration options
 * @returns Localization utilities and state
 * @since 2.0.0
 */
export const useLocalization = (options: UseLocalizationOptions = { locale: 'en' }): LocalizationHookReturn => {
  const {
    locale: initialLocale,
    fallbackLocale = 'en',
    customTranslations,
    autoDetect = false,
    lazyLoad = false
  } = options;

  // Fix the type issue by ensuring we return a proper SupportedLocale
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(() => {
    if (initialLocale && ['en', 'de', 'es', 'fr', 'nl'].includes(initialLocale)) {
      return initialLocale as SupportedLocale;
    }
    if (autoDetect) {
      return detectLocale();
    }
    return 'en';
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedTranslations, setLoadedTranslations] = useState<Record<string, any>>({});

  // Memoized translator - ensure it always returns string
  const translator = useMemo(() => {
    const config = {
      locale: currentLocale,
      fallbackLocale,
      customTranslations: {
        ...customTranslations,
        ...loadedTranslations
      }
    };
    return createTranslator(config);
  }, [currentLocale, fallbackLocale, customTranslations, loadedTranslations]);

  // Memoized direction
  const direction = useMemo(() => getDirection(currentLocale), [currentLocale]);

  // Load translations for current locale if lazy loading is enabled
  useEffect(() => {
    if (!lazyLoad || currentLocale === 'en') return;

    // Skip if already loaded
    if (loadedTranslations[currentLocale]) return;

    setLoading(true);
    setError(null);

    loadTranslations(currentLocale)
      .then((translations) => {
        setLoadedTranslations(prev => ({
          ...prev,
          [currentLocale]: translations
        }));
        setError(null);
      })
      .catch((err) => {
        setError(`Failed to load translations for ${currentLocale}`);
        console.warn('Translation loading error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentLocale, lazyLoad, loadedTranslations]);

  // Dynamic locale setter
  const setLocale = useMemo(() => (locale: SupportedLocale) => {
    setCurrentLocale(locale);
  }, []);

  return {
    locale: currentLocale,
    direction,
    t: translator,
    isRTL: direction === 'rtl',
    loading,
    error,
    setLocale
  };
};

/**
 * Lightweight version for components that only need basic translation
 * This version doesn't support dynamic locale switching but has smaller bundle impact
 * 
 * @param config - Basic localization config
 * @returns Basic translation function that always returns string
 * @since 2.0.0
 */
export const useTranslation = (config?: LocalizationConfig) => {
  const translator = useMemo(() => createTranslator(config), [config]);
  
  return {
    t: translator,
    locale: config?.locale || 'en',
    direction: getDirection(config?.locale || 'en')
  };
};

/**
 * Hook for RTL/LTR layout detection
 * Minimal version for components that only need direction info
 * 
 * @param locale - Locale to check
 * @returns Direction information
 * @since 2.0.0
 */
export const useDirection = (locale?: string) => {
  const direction = useMemo(() => getDirection(locale || 'en'), [locale]);
  
  return {
    direction,
    isRTL: direction === 'rtl',
    isLTR: direction === 'ltr'
  };
};
