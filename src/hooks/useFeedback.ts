import { useContext } from 'react';
import { FeedbackContext } from '../components/FeedbackProvider';
import type { FeedbackContextType } from '../types';

/**
 * Custom hook to access the feedback system functionality
 * 
 * Must be used within a FeedbackProvider component to access the feedback context.
 * Provides methods to open/close the feedback modal, submit feedback, and access
 * the current state of the feedback system.
 * 
 * @returns FeedbackContextType object containing feedback system state and methods
 * @throws Error if used outside of FeedbackProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { openModal, isModalOpen, submitFeedback } = useFeedback();
 *   
 *   const handleFeedback = async () => {
 *     await submitFeedback("This is great!", "feature");
 *   };
 *   
 *   return (
 *     <button onClick={openModal}>
 *       Give Feedback
 *     </button>
 *   );
 * }
 * ```
 */
export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }

  return context;
};

export default useFeedback;