/**
 * Advanced localization management system
 */

export class LocaleManager {
  private static instance: LocaleManager;
  private loadedLocales = new Set<string>();
  private translations = new Map<string, Record<string, string>>();

  static getInstance(): LocaleManager {
    if (!LocaleManager.instance) {
      LocaleManager.instance = new LocaleManager();
    }
    return LocaleManager.instance;
  }

  async loadLocale(locale: string): Promise<void> {
    if (this.loadedLocales.has(locale)) return;

    try {
      // Dynamic import for better bundle splitting
      const translations = await import(`../locales/${locale}.json`);
      this.translations.set(locale, translations.default);
      this.loadedLocales.add(locale);
    } catch (error) {
      console.warn(`Failed to load locale ${locale}:`, error);
      // Fallback to English
      if (locale !== 'en') {
        await this.loadLocale('en');
      }
    }
  }

  getTranslation(locale: string, key: string, params?: Record<string, any>): string {
    const translations = this.translations.get(locale);
    if (!translations) return key;

    let translation = translations[key] || key;

    // Simple parameter interpolation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value));
      });
    }

    return translation;
  }

  getAvailableLocales(): string[] {
    return Array.from(this.loadedLocales);
  }
}
