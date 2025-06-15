/**
 * Integration utilities for external services and platforms
 * 
 * This module provides a comprehensive integration system for processing feedback
 * submissions across multiple external services including analytics platforms,
 * issue trackers, notification systems, and webhook endpoints. It implements
 * robust error handling, retry logic, and performance optimization.
 * 
 * @module utils/integrations
 * @version 2.2.0
 * @author ArlindMaliqi
 * @since 1.0.0
 * 
 * @example Basic integration processing
 * ```typescript
 * await processIntegrations(feedback, {
 *   analytics: { provider: 'google-analytics', trackingId: 'GA_ID' },
 *   issueTracker: { provider: 'github', apiToken: 'token', owner: 'org', repository: 'repo' },
 *   notifications: { slack: { webhookUrl: 'https://hooks.slack.com/...' } }
 * });
 * ```
 * 
 * @example Vote integration processing
 * ```typescript
 * await processVoteIntegrations('feedback-123', 'up', config);
 * ```
 */
import type { Feedback, FeedbackConfig } from '../types';
import { processFeedbackAnalytics } from './integrations/analytics';
import { createIssue } from './integrations/issueTracker';
import { sendNotification } from './integrations/notifications';
import { sendWebhooks } from './integrations/webhooks';

/**
 * Standard result interface for integration operations
 * 
 * @interface IntegrationResult
 * @since 1.0.0
 */
export interface IntegrationResult {
  /** Whether the integration operation was successful */
  success: boolean;
  /** Error message if the operation failed */
  error?: string;
  /** Additional data returned from the integration */
  data?: any;
  /** Processing time in milliseconds */
  processingTime?: number;
  /** Integration provider name */
  provider?: string;
}

/**
 * Comprehensive result for processing all integrations
 * 
 * @interface IntegrationProcessingResult
 * @since 2.0.0
 */
export interface IntegrationProcessingResult {
  /** Whether analytics integration was processed successfully */
  analyticsProcessed: boolean;
  /** Whether issue was created successfully */
  issueCreated: boolean;
  /** Whether webhooks were sent successfully */
  webhooksSent: boolean;
  /** Whether notifications were sent successfully */
  notificationSent: boolean;
  /** Array of error messages from failed integrations */
  errors: string[];
  /** Total processing time for all integrations */
  totalProcessingTime: number;
  /** Detailed results for each integration */
  details: {
    analytics?: IntegrationResult;
    issueTracker?: IntegrationResult;
    webhooks?: IntegrationResult[];
    notifications?: IntegrationResult;
  };
}

/**
 * Processes all configured integrations for a feedback submission
 * 
 * This function orchestrates the execution of multiple integration types in parallel
 * for optimal performance. It implements graceful error handling to ensure that
 * failures in one integration don't affect others. All operations are non-blocking
 * and include comprehensive logging for debugging and monitoring.
 * 
 * @async
 * @function processIntegrations
 * @param {Feedback} feedback - The feedback object containing user input and metadata
 * @param {FeedbackConfig} config - Configuration object with integration settings
 * @returns {Promise<void>} Resolves when all integrations have been processed
 * 
 * @throws {Error} Only critical errors that prevent any integration from running
 * 
 * @example Basic usage
 * ```typescript
 * const feedback = {
 *   id: 'feedback-123',
 *   message: 'Great feature request!',
 *   type: 'feature',
 *   priority: 'medium'
 * };
 * 
 * const config = {
 *   analytics: {
 *     provider: 'google-analytics',
 *     trackingId: 'GA_TRACKING_ID'
 *   },
 *   issueTracker: {
 *     provider: 'github',
 *     apiToken: 'ghp_xxxxxxxxxxxx',
 *     owner: 'your-org',
 *     repository: 'your-repo'
 *   },
 *   notifications: {
 *     slack: {
 *       webhookUrl: 'https://hooks.slack.com/services/...',
 *       channel: '#feedback'
 *     }
 *   }
 * };
 * 
 * await processIntegrations(feedback, config);
 * ```
 * 
 * @example Error handling
 * ```typescript
 * try {
 *   await processIntegrations(feedback, config);
 *   console.log('All integrations processed successfully');
 * } catch (error) {
 *   console.error('Critical integration failure:', error);
 * }
 * ```
 * 
 * @since 1.0.0
 */
export const processIntegrations = async (
  feedback: Feedback,
  config: FeedbackConfig
): Promise<void> => {
  const startTime = Date.now();
  const promises: Promise<void>[] = [];

  console.log(`🔄 Processing integrations for feedback ${feedback.id}`);

  // Analytics integration - track user engagement and feedback metrics
  if (config.analytics) {
    promises.push(
      processFeedbackAnalytics(feedback, config.analytics)
        .then(() => {
          console.log('✅ Analytics integration completed successfully');
        })
        .catch(error => {
          console.error('❌ Analytics integration failed:', error);
          console.error('Analytics config:', config.analytics);
        })
    );
  }

  // Issue tracker integration - create trackable issues for feedback
  if (config.issueTracker) {
    promises.push(
      createIssue(feedback, config.issueTracker)
        .then(result => {
          if (!result.success) {
            console.error('❌ Issue creation failed:', result.error);
            console.error('Issue tracker config:', config.issueTracker);
          } else {
            console.log('✅ Issue created successfully:', result.issueUrl);
            console.log('Issue metadata:', result.metadata);
          }
        })
        .catch(error => {
          console.error('❌ Issue tracker integration failed:', error);
          console.error('Issue tracker config:', config.issueTracker);
        })
    );
  }

  // Webhook integration - send data to custom endpoints
  if (config.webhooks && config.webhooks.length > 0) {
    promises.push(
      sendWebhooks(feedback, config.webhooks, 'feedback.created')
        .then(results => {
          results.forEach(({ config: webhookConfig, result }) => {
            if (!result.success) {
              console.error(`❌ Webhook failed for ${webhookConfig.url}:`, result.error);
            } else {
              console.log(`✅ Webhook sent successfully to ${webhookConfig.url}`);
            }
          });
        })
        .catch(error => {
          console.error('❌ Webhook integration failed:', error);
          console.error('Webhook configs:', config.webhooks);
        })
    );
  }

  // Notification integration - send alerts to communication platforms
  if (config.notifications) {
    promises.push(
      sendNotification(feedback, config.notifications)
        .then(result => {
          if (!result.success) {
            console.error('❌ Notification failed:', result.error);
            console.error('Notification config:', config.notifications);
          } else {
            console.log('✅ Notification sent successfully');
            console.log('Notification metadata:', result.metadata);
          }
        })
        .catch(error => {
          console.error('❌ Notification integration failed:', error);
          console.error('Notification config:', config.notifications);
        })
    );
  }

  // Execute all integrations in parallel for optimal performance
  await Promise.allSettled(promises);

  const processingTime = Date.now() - startTime;
  console.log(`🏁 Integration processing completed in ${processingTime}ms for feedback ${feedback.id}`);
};

/**
 * Processes integrations specifically for voting operations on feedback
 * 
 * This function handles the integration requirements when users vote on existing
 * feedback items. It typically involves analytics tracking and webhook notifications
 * for vote-related events. The processing is optimized for the lighter workload
 * compared to full feedback submission processing.
 * 
 * @async
 * @function processVoteIntegrations
 * @param {string} feedbackId - Unique identifier of the feedback being voted on
 * @param {'up' | 'down'} vote - Type of vote being cast
 * @param {FeedbackConfig} config - Configuration object with integration settings
 * @returns {Promise<void>} Resolves when all vote-related integrations are processed
 * 
 * @example Upvote processing
 * ```typescript
 * await processVoteIntegrations('feedback-123', 'up', {
 *   analytics: {
 *     provider: 'google-analytics',
 *     trackingId: 'GA_TRACKING_ID',
 *     trackEvents: true
 *   },
 *   webhooks: [{
 *     url: 'https://api.example.com/vote-webhook',
 *     events: ['feedback.voted']
 *   }]
 * });
 * ```
 * 
 * @example Downvote processing
 * ```typescript
 * await processVoteIntegrations('feedback-456', 'down', config);
 * ```
 * 
 * @since 1.2.0
 */
export const processVoteIntegrations = async (
  feedbackId: string,
  vote: 'up' | 'down',
  config: FeedbackConfig
): Promise<void> => {
  const startTime = Date.now();
  const promises: Promise<void>[] = [];

  console.log(`🗳️ Processing vote integrations for feedback ${feedbackId} (${vote})`);

  // Analytics integration for vote tracking
  if (config.analytics) {
    promises.push(
      import('./integrations/analytics')
        .then(({ processVoteAnalytics }) => {
          // We know analytics is defined here since we've checked above
          return processVoteAnalytics(feedbackId, config.analytics!);
        })
        .then(() => {
          console.log(`✅ Vote analytics processed for ${vote} vote on ${feedbackId}`);
        })
        .catch(error => {
          console.error('❌ Vote analytics failed:', error);
          console.error('Analytics config:', config.analytics);
        })
    );
  }

  // Webhook integration for vote events
  if (config.webhooks && config.webhooks.length > 0) {
    // Filter webhooks that are interested in vote events
    const voteWebhooks = config.webhooks.filter(webhook => 
      !webhook.events || webhook.events.includes('feedback.voted') || webhook.events.includes('vote.created')
    );

    if (voteWebhooks.length > 0) {
      promises.push(
        import('./integrations/webhooks')
          .then(({ sendVoteWebhook }) => {
            return sendVoteWebhook(feedbackId, vote, voteWebhooks);
          })
          .then(() => {
            console.log(`✅ Vote webhooks sent for ${vote} vote on ${feedbackId}`);
          })
          .catch(error => {
            console.error('❌ Vote webhook failed:', error);
            console.error('Vote webhook configs:', voteWebhooks);
          })
      );
    }
  }

  // Execute all vote integrations in parallel
  await Promise.allSettled(promises);

  const processingTime = Date.now() - startTime;
  console.log(`🏁 Vote integration processing completed in ${processingTime}ms for feedback ${feedbackId}`);
};

/**
 * Processes integrations with enhanced error reporting and metrics collection
 * 
 * This function provides a more detailed integration processing experience with
 * comprehensive error reporting, timing metrics, and success/failure tracking
 * for each individual integration. It's particularly useful for debugging and
 * monitoring integration performance.
 * 
 * @async
 * @function processIntegrationsWithDetails
 * @param {Feedback} feedback - The feedback object to process
 * @param {FeedbackConfig} config - Configuration with integration settings
 * @returns {Promise<IntegrationProcessingResult>} Detailed results for all integrations
 * 
 * @example Detailed processing with result analysis
 * ```typescript
 * const result = await processIntegrationsWithDetails(feedback, config);
 * 
 * console.log(`Processing completed in ${result.totalProcessingTime}ms`);
 * console.log(`Analytics: ${result.analyticsProcessed ? '✅' : '❌'}`);
 * console.log(`Issue Created: ${result.issueCreated ? '✅' : '❌'}`);
 * console.log(`Notifications: ${result.notificationSent ? '✅' : '❌'}`);
 * 
 * if (result.errors.length > 0) {
 *   console.error('Integration errors:', result.errors);
 * }
 * ```
 * 
 * @since 2.0.0
 */
export const processIntegrationsWithDetails = async (
  feedback: Feedback,
  config: FeedbackConfig
): Promise<IntegrationProcessingResult> => {
  const startTime = Date.now();
  const result: IntegrationProcessingResult = {
    analyticsProcessed: false,
    issueCreated: false,
    webhooksSent: false,
    notificationSent: false,
    errors: [],
    totalProcessingTime: 0,
    details: {}
  };

  const integrationPromises: Promise<void>[] = [];

  // Analytics integration with detailed tracking
  if (config.analytics) {
    integrationPromises.push(
      (async () => {
        const integrationStart = Date.now();
        try {
          await processFeedbackAnalytics(feedback, config.analytics!);
          result.analyticsProcessed = true;
          result.details.analytics = {
            success: true,
            processingTime: Date.now() - integrationStart,
            provider: config.analytics!.provider
          };
        } catch (error) {
          const errorMessage = `Analytics integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMessage);
          result.details.analytics = {
            success: false,
            error: errorMessage,
            processingTime: Date.now() - integrationStart,
            provider: config.analytics!.provider
          };
        }
      })()
    );
  }

  // Issue tracker integration with detailed tracking
  if (config.issueTracker) {
    integrationPromises.push(
      (async () => {
        const integrationStart = Date.now();
        try {
          const issueResult = await createIssue(feedback, config.issueTracker!);
          result.issueCreated = issueResult.success;
          result.details.issueTracker = {
            success: issueResult.success,
            error: issueResult.error,
            data: { issueUrl: issueResult.issueUrl, metadata: issueResult.metadata },
            processingTime: Date.now() - integrationStart,
            provider: config.issueTracker!.provider
          };
          
          if (!issueResult.success) {
            result.errors.push(`Issue creation failed: ${issueResult.error}`);
          }
        } catch (error) {
          const errorMessage = `Issue tracker integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMessage);
          result.details.issueTracker = {
            success: false,
            error: errorMessage,
            processingTime: Date.now() - integrationStart,
            provider: config.issueTracker!.provider
          };
        }
      })()
    );
  }

  // Notification integration with detailed tracking
  if (config.notifications) {
    integrationPromises.push(
      (async () => {
        const integrationStart = Date.now();
        try {
          const notificationResult = await sendNotification(feedback, config.notifications!);
          result.notificationSent = notificationResult.success;
          result.details.notifications = {
            success: notificationResult.success,
            error: notificationResult.error,
            data: notificationResult.metadata,
            processingTime: Date.now() - integrationStart,
            provider: 'multi-platform'
          };
          
          if (!notificationResult.success) {
            result.errors.push(`Notification failed: ${notificationResult.error}`);
          }
        } catch (error) {
          const errorMessage = `Notification integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMessage);
          result.details.notifications = {
            success: false,
            error: errorMessage,
            processingTime: Date.now() - integrationStart,
            provider: 'multi-platform'
          };
        }
      })()
    );
  }
  // Process all integrations and wait for completion
  await Promise.allSettled(integrationPromises);

  result.totalProcessingTime = Date.now() - startTime;

  return result;
};

/**
 * Validates integration configuration before processing
 * 
 * This function performs comprehensive validation of integration configurations
 * to catch common misconfigurations early and provide helpful error messages.
 * It's recommended to call this during application initialization.
 * 
 * @function validateIntegrationConfig
 * @param {FeedbackConfig} config - Configuration to validate
 * @returns {Array<string>} Array of validation error messages (empty if valid)
 * 
 * @example Configuration validation
 * ```typescript
 * const errors = validateIntegrationConfig(config);
 * if (errors.length > 0) {
 *   console.error('Integration configuration errors:', errors);
 *   // Handle configuration errors
 * }
 * ```
 * 
 * @since 2.1.0
 */
export const validateIntegrationConfig = (config: FeedbackConfig): string[] => {
  const errors: string[] = [];

  // Validate analytics configuration
  if (config.analytics) {
    if (!config.analytics.provider) {
      errors.push('Analytics provider is required');
    }
    
    if (config.analytics.provider === 'google-analytics' && !config.analytics.trackingId) {
      errors.push('Google Analytics tracking ID is required');
    }
    
    if (config.analytics.provider === 'custom' && !config.analytics.customEndpoint) {
      errors.push('Custom analytics endpoint is required');
    }
  }

  // Validate issue tracker configuration
  if (config.issueTracker) {
    if (!config.issueTracker.provider) {
      errors.push('Issue tracker provider is required');
    }
    
    if (config.issueTracker.provider === 'github') {
      if (!config.issueTracker.apiToken) errors.push('GitHub API token is required');
      if (!config.issueTracker.owner) errors.push('GitHub owner is required');
      if (!config.issueTracker.repository) errors.push('GitHub repository is required');
    }
    
    if (config.issueTracker.provider === 'jira') {
      if (!config.issueTracker.apiToken) errors.push('Jira API token is required');
      if (!config.issueTracker.baseUrl) errors.push('Jira base URL is required');
      if (!config.issueTracker.project) errors.push('Jira project key is required');
    }
  }

  // Validate notification configuration
  if (config.notifications) {
    if (config.notifications.slack && !config.notifications.slack.webhookUrl) {
      errors.push('Slack webhook URL is required');
    }
    
    if (config.notifications.teams && !config.notifications.teams.webhookUrl) {
      errors.push('Teams webhook URL is required');
    }
    
    if (config.notifications.discord && !config.notifications.discord.webhookUrl) {
      errors.push('Discord webhook URL is required');
    }
    
    if (config.notifications.email) {
      if (!config.notifications.email.from) errors.push('Email from address is required');
      if (!config.notifications.email.to) errors.push('Email to address is required');
    }
  }

  // Validate webhook configuration
  if (config.webhooks) {
    config.webhooks.forEach((webhook, index) => {
      if (!webhook.url) {
        errors.push(`Webhook ${index + 1}: URL is required`);
      }
      
      try {
        new URL(webhook.url);
      } catch {
        errors.push(`Webhook ${index + 1}: Invalid URL format`);
      }
    });
  }

  return errors;
};
