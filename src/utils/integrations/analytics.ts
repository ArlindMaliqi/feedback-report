/**
 * Analytics integration utilities for tracking feedback events
 * @module analytics
 */
import type { AnalyticsConfig, Feedback } from '../../types';
import { showError } from '../notifications';

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
 * Tracks a feedback event using the configured analytics provider
 * 
 * @param eventName - Name of the event to track
 * @param eventData - Data to include with the event
 * @param config - Analytics configuration
 * @returns True if tracking was successful, false otherwise
 */
export const trackFeedbackEvent = (
  eventName: string,
  eventData: Record<string, any>,
  config: AnalyticsConfig
): boolean => {
  if (!config) return false;
  
  try {
    // Add additional properties if configured
    const enhancedData = {
      ...eventData,
      ...(config.additionalProperties || {})
    };
    
    // Fix type error by properly typing the function
    const trackEventFn = config.trackEvent as undefined | ((name: string, data: any) => void);
    
    // Use custom tracking function if provided
    if (typeof trackEventFn === 'function') {
      trackEventFn(eventName, enhancedData);
      return true;
    }
    
    // Use the appropriate provider based on configuration
    switch (config.provider) {
      case 'google-analytics':
        if (isGoogleAnalyticsAvailable()) {
          trackWithGoogleAnalytics(eventName, enhancedData, config);
          return true;
        }
        return false;
        
      case 'segment':
        if (isSegmentAvailable()) {
          trackWithSegment(eventName, enhancedData);
          return true;
        }
        return false;
        
      case 'mixpanel':
        if (isMixpanelAvailable()) {
          trackWithMixpanel(eventName, enhancedData);
          return true;
        }
        return false;
        
      case 'custom':
        // For custom, we expect trackEvent to be set up
        // We've already checked for trackEvent function above
        return false;
        
      default:
        return false;
    }
  } catch (error) {
    console.error('Error tracking feedback event:', error);
    return false;
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
  
  trackFeedbackEvent(eventName, eventData, config);
};

/**
 * Tracks a feedback voting event
 * 
 * @param feedbackId - ID of the feedback that was voted on
 * @param config - Analytics configuration 
 */
export const trackFeedbackVote = (feedbackId: string, config: AnalyticsConfig): void => {
  if (!config) return;
  
  const eventData = {
    feedbackId,
    action: 'vote'
  };
  
  trackFeedbackEvent(ANALYTICS_EVENTS.FEEDBACK_VOTED, eventData, config);
};
