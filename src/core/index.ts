/**
 * Core exports - minimal bundle
 * @module core
 */

// Core hooks
export { useFeedback } from '../hooks/useFeedback';

// Core context
export { FeedbackProvider } from '../components/FeedbackProvider';

// Core types
export type { 
  Feedback, 
  FeedbackConfig, 
  UserIdentity,
  FeedbackContextValue
} from '../types';

// Lightweight button component
export { FeedbackButton } from '../components/FeedbackButton';
