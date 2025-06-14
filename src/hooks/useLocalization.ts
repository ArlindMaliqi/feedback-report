/**
 * Hook for accessing localization context
 * @module hooks/useLocalization
 */
import { useContext } from 'react';
import { LocalizationContext, LocalizationContextType } from '../contexts/FeedbackContext';

/**
 * Hook to access the localization context
 * 
 * @returns LocalizationContextType
 * @throws Error if used outside FeedbackProvider
 */
export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  
  if (!context) {
    throw new Error('useLocalization must be used within a FeedbackProvider');
  }
  
  return context;
};
