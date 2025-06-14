/**
 * Hook for accessing feedback context
 * @module hooks/useFeedback
 */
import { useContext } from 'react';
import { FeedbackContext } from '../contexts/FeedbackContext';
import type { FeedbackContextType } from '../types';

/**
 * Hook to access the feedback context
 * 
 * @returns FeedbackContextType
 * @throws Error if used outside FeedbackProvider
 */
export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  
  return context;
};

export default useFeedback;