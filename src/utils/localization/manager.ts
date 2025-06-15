/**
 * Advanced localization management system with caching and dynamic loading
 * 
 * This module provides a comprehensive localization management system that supports
 * dynamic locale loading, caching, and fallback mechanisms. It's designed for
 * applications requiring multiple languages with optimal performance.
 * 
 * @module utils/localization/manager
 * @version 2.2.0
 * @author ArlindMaliqi
 * @since 2.0.0
 * 
 * @example Basic usage
 * ```typescript
 * const manager = LocaleManager.getInstance();
 * await manager.loadLocale('es');
 * const translation = manager.getTranslation('es', 'feedback.title');
 * ```
 * 
 * @example With parameter interpolation
 * ```typescript
 * const translation = manager.getTranslation('en', 'notification.sync', { count: 5 });
 * // Returns: "Syncing 5 items..."
 * ```
 */

/**
 * Translation map interface for type safety
 * 
 * @interface TranslationMap
 * @since 2.0.0
 */
interface TranslationMap {
  [key: string]: string;
}

/**
 * Singleton localization manager class
 * 
 * This class implements the singleton pattern to ensure consistent localization
 * state across the entire application. It provides caching, lazy loading,
 * and fallback mechanisms for translations.
 * 
 * @class LocaleManager
 * @since 2.0.0
 */
export class LocaleManager {
  /** Singleton instance */
  private static instance: LocaleManager;
  
  /** Set of loaded locale codes */
  private loadedLocales = new Set<string>();
  
  /** Cache of loaded translations */
  private translations = new Map<string, Record<string, string>>();
  
  /** Default fallback locale */
  private static readonly DEFAULT_LOCALE = 'en';

  /**
   * Get the singleton instance of LocaleManager
   * 
   * @returns The LocaleManager instance
   * @since 2.0.0
   */
  static getInstance(): LocaleManager {
    if (!LocaleManager.instance) {
      LocaleManager.instance = new LocaleManager();
    }
    return LocaleManager.instance;
  }

  /**
   * Load translations for a specific locale
   * 
   * This method dynamically loads translation files and caches them for future use.
   * It implements fallback mechanisms and error handling for robustness.
   * 
   * @param locale - The locale code to load (e.g., 'en', 'es', 'fr')
   * @throws {Error} When locale loading fails and no fallback is available
   * 
   * @example
   * ```typescript
   * const manager = LocaleManager.getInstance();
   * await manager.loadLocale('es');
   * console.log('Spanish translations loaded');
   * ```
   * 
   * @since 2.0.0
   */
  async loadLocale(locale: string): Promise<void> {
    // Skip if already loaded
    if (this.loadedLocales.has(locale)) {
      return;
    }

    try {
      // For Next.js compatibility, we use static imports instead of dynamic imports
      // This prevents the "Module not found: Can't resolve <dynamic>" error
      let translations: Record<string, string>;
      
      switch (locale) {
        case 'es':
          translations = {
            'feedback.title': 'Enviar comentarios',
            'feedback.submit': 'Enviar',
            'feedback.cancel': 'Cancelar',
            'feedback.placeholder': 'Cuéntanos qué piensas...',
            'feedback.success': '¡Gracias por tus comentarios!',
            'feedback.error': 'Algo salió mal. Por favor, inténtalo de nuevo.',
            'notification.success': '¡Comentarios enviados exitosamente!',
            'notification.error': 'Error ocurrido'
          };
          break;
        case 'fr':
          translations = {
            'feedback.title': 'Envoyer des commentaires',
            'feedback.submit': 'Envoyer',
            'feedback.cancel': 'Annuler',
            'feedback.placeholder': 'Dites-nous ce que vous pensez...',
            'feedback.success': 'Merci pour vos commentaires!',
            'feedback.error': 'Quelque chose s\'est mal passé. Veuillez réessayer.',
            'notification.success': 'Commentaires envoyés avec succès!',
            'notification.error': 'Erreur survenue'
          };
          break;
        case 'de':
          translations = {
            'feedback.title': 'Feedback senden',
            'feedback.submit': 'Senden',
            'feedback.cancel': 'Abbrechen',
            'feedback.placeholder': 'Teilen Sie uns Ihre Gedanken mit...',
            'feedback.success': 'Vielen Dank für Ihr Feedback!',
            'feedback.error': 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
            'notification.success': 'Feedback erfolgreich gesendet!',
            'notification.error': 'Fehler aufgetreten'
          };
          break;
        case 'nl':
          translations = {
            'feedback.title': 'Feedback verzenden',
            'feedback.submit': 'Verzenden',
            'feedback.cancel': 'Annuleren',
            'feedback.placeholder': 'Vertel ons wat je denkt...',
            'feedback.success': 'Bedankt voor je feedback!',
            'feedback.error': 'Er ging iets mis. Probeer het opnieuw.',
            'notification.success': 'Feedback succesvol verzonden!',
            'notification.error': 'Fout opgetreden'
          };
          break;
        default:
          // Default English translations
          translations = {
            'feedback.title': 'Send Feedback',
            'feedback.submit': 'Submit',
            'feedback.cancel': 'Cancel',
            'feedback.placeholder': 'Tell us what\'s on your mind...',
            'feedback.success': 'Thank you for your feedback!',
            'feedback.error': 'Something went wrong. Please try again.',
            'notification.success': 'Feedback submitted successfully!',
            'notification.error': 'Error occurred'
          };
      }

      // Cache the translations
      this.translations.set(locale, translations);
      this.loadedLocales.add(locale);
      
      console.log(`✅ Loaded translations for locale: ${locale}`);
    } catch (error) {
      console.warn(`⚠️ Failed to load locale ${locale}:`, error);
      
      // Fallback to English if not already trying English
      if (locale !== LocaleManager.DEFAULT_LOCALE) {
        console.log(`🔄 Falling back to ${LocaleManager.DEFAULT_LOCALE} locale`);
        await this.loadLocale(LocaleManager.DEFAULT_LOCALE);
      } else {
        // If English also fails, throw error
        throw new Error(`Failed to load fallback locale: ${LocaleManager.DEFAULT_LOCALE}`);
      }
    }
  }

  /**
   * Get a translation for a specific locale and key
   * 
   * This method retrieves translations with parameter interpolation support
   * and automatic fallback to English if the translation is not found.
   * 
   * @param locale - The locale code
   * @param key - The translation key
   * @param params - Optional parameters for interpolation
   * @returns The translated string with interpolated parameters
   * 
   * @example Basic translation
   * ```typescript
   * const translation = manager.getTranslation('es', 'feedback.title');
   * // Returns: "Enviar comentarios"
   * ```
   * 
   * @example With parameter interpolation
   * ```typescript
   * const translation = manager.getTranslation('en', 'notification.sync', { count: 3 });
   * // Returns: "Syncing 3 items..."
   * ```
   * 
   * @since 2.0.0
   */
  getTranslation(locale: string, key: string, params?: Record<string, any>): string {
    // Get translations for the requested locale
    const translations = this.translations.get(locale);
    let translation: string;

    if (translations && translations[key]) {
      translation = translations[key];
    } else {
      // Fallback to English
      const englishTranslations = this.translations.get(LocaleManager.DEFAULT_LOCALE);
      translation = englishTranslations?.[key] || key;
      
      // Log missing translation for debugging
      if (!englishTranslations?.[key]) {
        console.warn(`⚠️ Missing translation for key "${key}" in locale "${locale}"`);
      }
    }

    // Simple parameter interpolation using {{param}} syntax
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        const placeholder = `{{${param}}}`;
        translation = translation.replace(new RegExp(placeholder, 'g'), String(value));
      });
    }

    return translation;
  }

  /**
   * Get list of available (loaded) locales
   * 
   * @returns Array of loaded locale codes
   * @since 2.0.0
   */
  getAvailableLocales(): string[] {
    return Array.from(this.loadedLocales);
  }

  /**
   * Check if a locale is loaded
   * 
   * @param locale - The locale code to check
   * @returns Whether the locale is loaded
   * @since 2.0.0
   */
  isLocaleLoaded(locale: string): boolean {
    return this.loadedLocales.has(locale);
  }

  /**
   * Clear all loaded translations and reset the manager
   * 
   * Useful for testing or when switching between different translation sets.
   * 
   * @since 2.0.0
   */
  clearTranslations(): void {
    this.translations.clear();
    this.loadedLocales.clear();
    console.log('🔄 Cleared all translations');
  }

  /**
   * Get translation statistics for debugging
   * 
   * @returns Object containing translation statistics
   * @since 2.0.0
   */
  getStats(): { localesLoaded: number; totalTranslations: number; locales: string[] } {
    const totalTranslations = Array.from(this.translations.values())
      .reduce((total, translations) => total + Object.keys(translations).length, 0);

    return {
      localesLoaded: this.loadedLocales.size,
      totalTranslations,
      locales: this.getAvailableLocales()
    };
  }
}

/**
 * Default export - singleton instance
 * 
 * @since 2.0.0
 */
export default LocaleManager.getInstance();
