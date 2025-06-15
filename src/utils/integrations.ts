/**
 * Integration utilities for external services
 * @module utils/integrations
 */
import type { Feedback, FeedbackConfig } from '../types';
import { processFeedbackAnalytics } from './integrations/analytics';
import { createIssue } from './integrations/issueTracker';
import { sendNotification } from './integrations/notifications';
import { sendWebhooks } from './integrations/webhooks';

/**
 * Process integrations for feedback submission
 * @param feedback - The feedback to process
 * @param config - Configuration with integration settings
 */
export const processIntegrations = async (
  feedback: Feedback,
  config: FeedbackConfig
): Promise<void> => {
  const promises: Promise<void>[] = [];

  // Analytics integration
  if (config.analytics) {
    promises.push(
      processFeedbackAnalytics(feedback, config.analytics)
        .catch(error => console.error('Analytics integration failed:', error))
    );
  }

  // Issue tracker integration
  if (config.issueTracker) {
    promises.push(
      createIssue(feedback, config.issueTracker)
        .then(result => {
          if (!result.success) {
            console.error('Issue creation failed:', result.error);
          } else {
            console.log('Issue created successfully:', result.issueUrl);
          }
        })
        .catch(error => console.error('Issue tracker integration failed:', error))
    );
  }

  // Webhook integration
  if (config.webhooks && config.webhooks.length > 0) {
    promises.push(
      sendWebhooks(feedback, config.webhooks, 'feedback.created')
        .then(results => {
          results.forEach(({ config: webhookConfig, result }) => {
            if (!result.success) {
              console.error(`Webhook failed for ${webhookConfig.url}:`, result.error);
            }
          });
        })
        .catch(error => console.error('Webhook integration failed:', error))
    );
  }

  // Notification integration
  if (config.notifications) {
    promises.push(
      sendNotification(feedback, config.notifications)
        .then(result => {
          if (!result.success) {
            console.error('Notification failed:', result.error);
          }
        })
        .catch(error => console.error('Notification integration failed:', error))
    );
  }

  await Promise.allSettled(promises);
};

/**
 * Process vote integrations
 * @param feedbackId - ID of the feedback being voted on
 * @param vote - Type of vote ('up' or 'down')
 * @param config - Configuration with integration settings
 */
export const processVoteIntegrations = async (
  feedbackId: string,
  vote: 'up' | 'down',
  config: FeedbackConfig
): Promise<void> => {
  const promises: Promise<void>[] = [];

  // Analytics for votes
  if (config.analytics) {
    promises.push(
      import('./integrations/analytics')
        .then(({ processVoteAnalytics }) => processVoteAnalytics(feedbackId, config.analytics!))
        .catch(error => console.error('Vote analytics failed:', error))
    );
  }

  // Webhook for votes
  if (config.webhooks && config.webhooks.length > 0) {
    promises.push(
      import('./integrations/webhooks')
        .then(({ sendVoteWebhook }) => sendVoteWebhook(feedbackId, vote, config.webhooks!))
        .catch(error => console.error('Vote webhook failed:', error))
    );
  }

  await Promise.allSettled(promises);
};
