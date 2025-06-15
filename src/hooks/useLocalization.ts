/**
 * Comprehensive localization hook with advanced features and performance optimization
 * 
 * This module provides React hooks for localization management with features like
 * automatic locale detection, lazy loading, caching, and RTL support. It's designed
 * for applications requiring robust internationalization capabilities.
 * 
 * @module hooks/useLocalization
 * @version 2.2.0
 * @author ArlindMaliqi
 * @since 1.2.0
 * 
 * @example Basic usage
 * ```tsx
 * const { t, locale, direction } = useLocalization({ locale: 'es' });
 * return <div dir={direction}>{t('feedback.title')}</div>;
 * ```
 * 
 * @example Advanced usage with lazy loading
 * ```tsx
 * const { t, setLocale, loading, error } = useLocalization({
 *   locale: 'en',
 *   autoDetect: true,
 *   lazyLoad: true
 * });
 * 
 * if (loading) return <div>Loading translations...</div>;
 * if (error) return <div>Error: {error}</div>;
 * 
 * return (
 *   <div>
 *     <button onClick={() => setLocale('es')}>Español</button>
 *     <p>{t('feedback.title')}</p>
 *   </div>
 * );
 * ```
 */

import { useContext, useMemo, useEffect, useState, useCallback } from 'react';
import { LocalizationContext } from '../contexts/FeedbackContext';
import { 
  createTranslator, 
  getDirection, 
  detectLocale, 
  loadTranslations,
  type SupportedLocale 
} from '../utils/localization';
import type { LocalizationConfig } from '../types';

/**
 * Configuration interface for the localization hook
 * 
 * @interface UseLocalizationOptions
 * @extends LocalizationConfig
 * @since 1.2.0
 */
interface UseLocalizationOptions extends LocalizationConfig {
  /** Whether to automatically detect browser locale */
  autoDetect?: boolean;
  /** Whether to lazy load translation bundles */
  lazyLoad?: boolean;
  /** Whether to enable debug logging */
  debug?: boolean;
}

/**
 * Return type for the localization hook with comprehensive functionality
 * 
 * @interface LocalizationHookReturn
 * @since 1.2.0
 */
interface LocalizationHookReturn {
  /** Current locale code */
  locale: string;
  /** Text direction for the current locale */
  direction: 'ltr' | 'rtl';
  /** Translation function that always returns a string */
  t: (key: string, values?: Record<string, any>) => string;
  /** Whether the current locale uses right-to-left text direction */
  isRTL: boolean;
  /** Whether translations are currently loading */
  loading: boolean;
  /** Error message if translation loading failed */
  error: string | null;
  /** Function to change locale dynamically */
  setLocale: (locale: SupportedLocale) => void;
  /** Format date according to the current locale */
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  /** Format number according to the current locale */
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  /** Format currency according to the current locale */
  formatCurrency: (amount: number, currency?: string) => string;
  /** Get relative time formatting (e.g., "2 hours ago") */
  formatRelativeTime: (date: Date) => string;
  /** Get list of available locales */
  availableLocales: SupportedLocale[];
  /** Whether the locale is being changed */
  isChanging: boolean;
}

/**
 * Optimized localization hook with comprehensive internationalization features
 * 
 * This hook provides a complete localization solution with:
 * - Automatic locale detection
 * - Lazy loading of translation bundles
 * - Caching for performance
 * - RTL/LTR support
 * - Date, number, and currency formatting
 * - Error handling and loading states
 * 
 * @param options - Localization configuration options
 * @returns Comprehensive localization utilities and state
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { 
 *     t, 
 *     locale, 
 *     direction, 
 *     setLocale, 
 *     formatDate, 
 *     loading 
 *   } = useLocalization({
 *     locale: 'en',
 *     autoDetect: true,
 *     lazyLoad: true
 *   });
 * 
 *   if (loading) return <div>Loading...</div>;
 * 
 *   return (
 *     <div dir={direction}>
 *       <h1>{t('feedback.title')}</h1>
 *       <p>{formatDate(new Date())}</p>
 *       <select onChange={(e) => setLocale(e.target.value)}>
 *         <option value="en">English</option>
 *         <option value="es">Español</option>
 *       </select>
 *     </div>
 *   );
 * };
 * ```
 * 
 * @since 2.0.0
 */
export const useLocalization = (options: UseLocalizationOptions = { locale: 'en' }): LocalizationHookReturn => {
  const context = useContext(LocalizationContext);
  
  const {
    locale: initialLocale,
    fallbackLocale = 'en',
    customTranslations,
    autoDetect = false,
    lazyLoad = false,
    debug = false
  } = options;

  // State management
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(() => {
    // Priority: provided locale > auto-detect > fallback
    if (initialLocale && ['en', 'de', 'es', 'fr', 'nl'].includes(initialLocale)) {
      return initialLocale as SupportedLocale;
    }
    if (autoDetect) {
      return detectLocale();
    }
    return 'en';
  });
  
  const [loading, setLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedTranslations, setLoadedTranslations] = useState<Record<string, any>>({});

  // Debug logging
  const debugLog = useCallback((message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[useLocalization] ${message}`, ...args);
    }
  }, [debug]);

  // Memoized translator with error handling
  const translator = useMemo(() => {
    const config = {
      locale: currentLocale,
      fallbackLocale,
      customTranslations: {
        ...customTranslations,
        ...loadedTranslations
      }
    };
    
    debugLog('Creating translator for locale:', currentLocale);
    return createTranslator(config);
  }, [currentLocale, fallbackLocale, customTranslations, loadedTranslations, debugLog]);

  // Memoized direction calculation
  const direction = useMemo(() => getDirection(currentLocale), [currentLocale]);

  // Load translations for current locale
  useEffect(() => {
    if (!lazyLoad || currentLocale === 'en') {
      debugLog('Skipping lazy loading for locale:', currentLocale);
      return;
    }

    // Skip if already loaded
    if (loadedTranslations[currentLocale]) {
      debugLog('Translations already loaded for locale:', currentLocale);
      return;
    }

    setLoading(true);
    setError(null);
    debugLog('Loading translations for locale:', currentLocale);

    loadTranslations(currentLocale)
      .then((translations) => {
        setLoadedTranslations(prev => ({
          ...prev,
          [currentLocale]: translations
        }));
        setError(null);
        debugLog('Successfully loaded translations for locale:', currentLocale);
      })
      .catch((err) => {
        const errorMessage = `Failed to load translations for ${currentLocale}`;
        setError(errorMessage);
        debugLog('Error loading translations:', err);
        console.warn('Translation loading error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentLocale, lazyLoad, loadedTranslations, debugLog]);

  // Dynamic locale setter with loading state
  const setLocale = useCallback(async (locale: SupportedLocale) => {
    if (locale === currentLocale) return;
    
    setIsChanging(true);
    debugLog('Changing locale from', currentLocale, 'to', locale);
    
    try {
      // Pre-load translations if using lazy loading
      if (lazyLoad && locale !== 'en' && !loadedTranslations[locale]) {
        setLoading(true);
        const translations = await loadTranslations(locale);
        setLoadedTranslations(prev => ({
          ...prev,
          [locale]: translations
        }));
        setLoading(false);
      }
      
      setCurrentLocale(locale);
      setError(null);
      debugLog('Successfully changed locale to:', locale);
    } catch (err) {
      const errorMessage = `Failed to change locale to ${locale}`;
      setError(errorMessage);
      debugLog('Error changing locale:', err);
    } finally {
      setIsChanging(false);
    }
  }, [currentLocale, lazyLoad, loadedTranslations, debugLog]);

  // Context fallbacks
  const locale = context?.locale || currentLocale;
  const t = context?.t || translator;

  // Enhanced formatting functions with error handling
  const formatDate = useCallback((date: Date, formatOptions?: Intl.DateTimeFormatOptions) => {
    try {
      const options = formatOptions || { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (err) {
      debugLog('Error formatting date:', err);
      return date.toLocaleDateString();
    }
  }, [locale, debugLog]);

  const formatNumber = useCallback((num: number, formatOptions?: Intl.NumberFormatOptions) => {
    try {
      return new Intl.NumberFormat(locale, formatOptions).format(num);
    } catch (err) {
      debugLog('Error formatting number:', err);
      return num.toString();
    }
  }, [locale, debugLog]);

  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch (err) {
      debugLog('Error formatting currency:', err);
      return `${currency} ${amount}`;
    }
  }, [locale, debugLog]);

  const formatRelativeTime = useCallback((date: Date) => {
    try {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return t('time.justNow', { fallback: 'just now' });
      if (diffInSeconds < 3600) return t('time.minutesAgo', { minutes: Math.floor(diffInSeconds / 60) });
      if (diffInSeconds < 86400) return t('time.hoursAgo', { hours: Math.floor(diffInSeconds / 3600) });
      
      return formatDate(date, { month: 'short', day: 'numeric' });
    } catch (err) {
      debugLog('Error formatting relative time:', err);
      return formatDate(date);
    }
  }, [t, formatDate, debugLog]);

  return {
    locale: currentLocale,
    direction,
    t,
    isRTL: direction === 'rtl',
    loading,
    error,
    setLocale,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
    availableLocales: ['en', 'de', 'es', 'fr', 'nl'],
    isChanging
  };
};

/**
 * Lightweight translation hook for components that only need basic translation
 * 
 * This is a performance-optimized version that doesn't support dynamic locale
 * switching but has a smaller bundle impact and faster initialization.
 * 
 * @param config - Basic localization configuration
 * @returns Basic translation utilities
 * 
 * @example
 * ```tsx
 * const { t, locale, direction } = useTranslation({ locale: 'es' });
 * return <div dir={direction}>{t('feedback.title')}</div>;
 * ```
 * 
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
 * Minimal hook for RTL/LTR layout detection
 * 
 * Ultra-lightweight hook for components that only need text direction information.
 * 
 * @param locale - Locale to check (optional)
 * @returns Direction information
 * 
 * @example
 * ```tsx
 * const { direction, isRTL } = useDirection('ar');
 * return <div dir={direction} className={isRTL ? 'rtl-layout' : 'ltr-layout'}>...</div>;
 * ```
 * 
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

export default useLocalization;
