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
  FEEDBACK_MODAL_OPENED: 'feedback_modal_opened',
  FEEDBACK_MODAL_CLOSED: 'feedback_modal_closed',
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
    const gtag = (window as any).gtag;
    const ga = (window as any).ga;
    
    if (typeof gtag === 'function') {
      // GA4 tracking
      gtag('event', eventName, {
        event_category: 'Feedback',
        event_label: eventData.feedbackType || 'unknown',
        custom_map: {
          feedback_id: eventData.feedbackId,
          feedback_type: eventData.feedbackType,
          feedback_category: eventData.category
        },
        ...eventData
      });
    } else if (typeof ga === 'function') {
      // Universal Analytics tracking
      ga('send', 'event', 'Feedback', eventName, eventData.feedbackType, eventData.timestamp);
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
 * Sends event to custom analytics endpoint
 */
const trackWithCustomEndpoint = async (
  eventName: string,
  eventData: Record<string, any>,
  config: AnalyticsConfig
): Promise<void> => {
  if (!config.customEndpoint) return;

  try {
    const response = await fetch(config.customEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      },
      body: JSON.stringify({
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error tracking with custom endpoint:', error);
  }
};

/**
 * Main tracking function that routes to appropriate provider
 */
export const trackFeedbackEvent = async (
  feedback: Feedback,
  config: AnalyticsConfig
): Promise<void> => {
  if (!config.trackEvents) return;

  const eventName = config.eventName || ANALYTICS_EVENTS.FEEDBACK_SUBMITTED;
  const eventData = {
    feedbackId: feedback.id,
    feedbackType: feedback.type,
    category: feedback.category,
    subcategory: feedback.subcategory,
    timestamp: feedback.timestamp.getTime(),
    url: feedback.url,
    hasAttachments: feedback.attachments && feedback.attachments.length > 0,
    votes: feedback.votes || 0
  };

  try {
    switch (config.provider) {
      case 'google-analytics':
        if (isGoogleAnalyticsAvailable()) {
          trackWithGoogleAnalytics(eventName, eventData, config);
        } else {
          console.warn('Google Analytics not available');
        }
        break;

      case 'segment':
        if (isSegmentAvailable()) {
          trackWithSegment(eventName, eventData);
        } else {
          console.warn('Segment not available');
        }
        break;

      case 'mixpanel':
        if (isMixpanelAvailable()) {
          trackWithMixpanel(eventName, eventData);
        } else {
          console.warn('Mixpanel not available');
        }
        break;

      case 'custom':
        await trackWithCustomEndpoint(eventName, eventData, config);
        break;

      default:
        console.warn(`Unknown analytics provider: ${config.provider}`);
    }
  } catch (error) {
    reportError('Failed to track feedback event');
    console.error('Analytics tracking failed:', error);
  }
};

/**
 * Track specific events
 */
export const trackFeedbackSubmission = (feedback: Feedback, config: AnalyticsConfig): void => {
  trackFeedbackEvent(feedback, { ...config, eventName: ANALYTICS_EVENTS.FEEDBACK_SUBMITTED });
};

export const trackFeedbackVote = (feedbackId: string, config: AnalyticsConfig): void => {
  const mockFeedback: Feedback = {
    id: feedbackId,
    message: '',
    type: 'other',
    timestamp: new Date(),
    status: 'open'
  };
  
  trackFeedbackEvent(mockFeedback, { ...config, eventName: ANALYTICS_EVENTS.FEEDBACK_VOTED });
};

export const trackModalOpened = (config: AnalyticsConfig): void => {
  const mockFeedback: Feedback = {
    id: 'modal-event',
    message: '',
    type: 'other',
    timestamp: new Date(),
    status: 'open'
  };
  
  trackFeedbackEvent(mockFeedback, { ...config, eventName: ANALYTICS_EVENTS.FEEDBACK_MODAL_OPENED });
};

/**
 * Process feedback analytics
 */
export const processFeedbackAnalytics = async (
  feedback: Feedback,
  config: AnalyticsConfig
): Promise<void> => {
  await trackFeedbackEvent(feedback, config);
};

/**
 * Process vote analytics
 */
export const processVoteAnalytics = async (
  feedbackId: string,
  config: AnalyticsConfig
): Promise<void> => {
  trackFeedbackVote(feedbackId, config);
};
