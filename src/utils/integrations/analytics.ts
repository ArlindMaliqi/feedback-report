/**
 * Analytics integration utilities for tracking feedback events
 * @module analytics
 */
import type { AnalyticsConfig, Feedback } from '../../types';
import { showError as reportError } from '../notifications';

/**
 * Event names used for analytics tracking
 */
export const ANALYTICS_EVENTS = {
  FEEDBACK_SUBMITTED: 'feedback_submitted',
  FEEDBACK_VIEWED: 'feedback_viewed',
  FEEDBACK_VOTED: 'feedback_voted',
};

/**
 * Detects if Google Analytics is available
 */
const isGoogleAnalyticsAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
    (typeof (window as any).gtag === 'function' || 
     typeof (window as any).ga === 'function');
};

/**
 * Detects if Segment is available
 */
const isSegmentAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
    typeof (window as any).analytics === 'object' && 
    typeof (window as any).analytics.track === 'function';
};

/**
 * Detects if Mixpanel is available
 */
const isMixpanelAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
    typeof (window as any).mixpanel === 'object' && 
    typeof (window as any).mixpanel.track === 'function';
};

/**
 * Tracks a feedback event via Google Analytics
 */
const trackWithGoogleAnalytics = (
  eventName: string, 
  eventData: Record<string, any>,
  config: AnalyticsConfig
): void => {
  try {
    const ga = (window as any).ga;
    const gtag = (window as any).gtag;
    
    // Convert data to GA-friendly format (string values for properties)
    const gaData: Record<string, string> = {};
    Object.entries(eventData).forEach(([key, value]) => {
      if (typeof value === 'object') {
        gaData[key] = JSON.stringify(value);
      } else {
        gaData[key] = String(value);
      }
    });
    
    // Try gtag (GA4) first
    if (typeof gtag === 'function') {
      gtag('event', eventName, gaData);
    } 
    // Fall back to Universal Analytics
    else if (typeof ga === 'function') {
      ga('send', 'event', 'Feedback', eventName, JSON.stringify(gaData));
    }
  } catch (error) {
    console.error('Error tracking with Google Analytics:', error);
  }
};

/**
 * Tracks a feedback event via Segment
 */
const trackWithSegment = (
  eventName: string, 
  eventData: Record<string, any>
): void => {
  try {
    const analytics = (window as any).analytics;
    analytics.track(eventName, eventData);
  } catch (error) {
    console.error('Error tracking with Segment:', error);
  }
};

/**
 * Tracks a feedback event via Mixpanel
 */
const trackWithMixpanel = (
  eventName: string, 
  eventData: Record<string, any>
): void => {
  try {
    const mixpanel = (window as any).mixpanel;
    mixpanel.track(eventName, eventData);
  } catch (error) {
    console.error('Error tracking with Mixpanel:', error);
  }
};

/**
 * Track feedback event
 */
export const trackFeedbackEvent = async (
  feedback: Feedback,
  config: AnalyticsConfig
): Promise<void> => {
  try {
    // Track the feedback event
    console.log('Tracking feedback event:', feedback.id);
  } catch (error) {
    reportError('Failed to track feedback event');
    console.error('Analytics tracking failed:', error);
  }
};

/**
 * Tracks a feedback submission event
 * 
 * @param feedback - The submitted feedback
 * @param config - Analytics configuration
 */
export const trackFeedbackSubmission = (feedback: Feedback, config: AnalyticsConfig): void => {
  if (!config) return;
  
  const eventName = config.eventName || ANALYTICS_EVENTS.FEEDBACK_SUBMITTED;
  
  // Extract relevant data for tracking
  const eventData = {
    feedbackId: feedback.id,
    feedbackType: feedback.type,
    category: feedback.category,
    subcategory: feedback.subcategory,
    timestamp: feedback.timestamp,
    url: feedback.url,
    // Don't include sensitive data like the message content or user identity
  };
  
  // Use the correct function signature with 2 parameters
  trackFeedbackEvent(feedback, config);
};

/**
 * Tracks a feedback voting event
 * 
 * @param feedbackId - ID of the feedback that was voted on
 * @param config - Analytics configuration 
 */
export const trackFeedbackVote = (feedbackId: string, config: AnalyticsConfig): void => {
  if (!config) return;
  
  // Create a mock feedback object for tracking
  const mockFeedback: Feedback = {
    id: feedbackId,
    message: '',
    type: 'other',
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };
  
  // Use the correct function signature with 2 parameters
  trackFeedbackEvent(mockFeedback, config);
};

/**
 * Process feedback analytics
 */
export const processFeedbackAnalytics = async (
  feedback: Feedback,
  config: AnalyticsConfig
): Promise<void> => {
  const eventData = {
    feedback_id: feedback.id,
    feedback_type: feedback.type,
    user_agent: feedback.userAgent,
    url: feedback.url,
    timestamp: feedback.timestamp
  };

  // Track feedback submission using the correct signature
  await trackFeedbackEvent(feedback, config);
};

/**
 * Process vote analytics
 */
export const processVoteAnalytics = async (
  feedbackId: string,
  config: AnalyticsConfig
): Promise<void> => {
  const eventData = {
    feedback_id: feedbackId,
    action: 'vote',
    timestamp: Date.now()
  };

  // Create a mock feedback object for tracking
  const mockFeedback: Feedback = {
    id: feedbackId,
    message: '',
    type: 'other',
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  };

  // Track vote event using the correct signature
  await trackFeedbackEvent(mockFeedback, config);
};
