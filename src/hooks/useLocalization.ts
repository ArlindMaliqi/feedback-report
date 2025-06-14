import { useContext } from 'react';
import { LocalizationContext } from '../components/FeedbackProvider';

/**
 * Custom hook to access localization features
 * 
 * Provides translation function, text direction, and locale information
 * from the LocalizationContext.
 * 
 * @returns Localization utilities and settings
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, dir, locale } = useLocalization();
 *   
 *   return (
 *     <div dir={dir}>
 *       <h1>{t('welcome.title')}</h1>
 *       <p>{t('welcome.message', { name: 'User' })}</p>
 *       <span>Current locale: {locale}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLocalization() {
  const context = useContext(LocalizationContext);
  
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationContext Provider');
  }
  
  return context;
}

export default useLocalization;
