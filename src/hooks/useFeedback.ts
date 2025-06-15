/**
 * Hook for accessing feedback context
 * @module hooks/useFeedback
 */
import { useContext } from 'react';
import { FeedbackContext } from '../components/FeedbackProvider';
import type { FeedbackContextValue } from '../types';

/**
 * Hook to access the feedback context
 * 
 * @returns FeedbackContextValue
 * @throws Error if used outside FeedbackProvider
 */
export const useFeedback = (): FeedbackContextValue => {
  const context = useContext(FeedbackContext);
  
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  
  return context;
};

export default useFeedback;