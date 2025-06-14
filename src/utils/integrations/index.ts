/**
 * Integration manager to coordinate all integration types
 * @module integrations
 */
import type { 
  Feedback, 
  FeedbackConfig,
  IssueCreationResponse,
  AnyIssueTrackerConfig
} from '../../types';
import { trackFeedbackSubmission, trackFeedbackVote } from './analytics';
import { createIssueFromFeedback } from './issueTracker';
import { sendToWebhooks } from './webhooks';
import { sendNotification } from './notifications';
import { showSuccess, showError, showInfo } from '../notifications';

/**
 * Result of integration processing
 */
interface IntegrationResult {
  /** Whether the feedback was successfully processed by all integrations */
  success: boolean;
  /** Results from issue tracker integration */
  issueTracker?: IssueCreationResponse;
  /** Number of successful webhook deliveries */
  webhookSuccesses: number;
  /** Number of failed webhook deliveries */
  webhookFailures: number;
  /** Whether notification was sent successfully */
  notificationSent: boolean;
  /** Whether analytics event was tracked */
  analyticsTracked: boolean;
  /** Array of error messages from failed integrations */
  errors: string[];
}

/**
 * Processes feedback through all configured integrations
 * 
 * @param feedback - The feedback to process
 * @param config - Feedback system configuration
 * @returns Promise resolving to integration results
 */
export const processIntegrations = async (
  feedback: Feedback,
  config: FeedbackConfig
): Promise<IntegrationResult> => {
  const result: IntegrationResult = {
    success: true,
    webhookSuccesses: 0,
    webhookFailures: 0,
    notificationSent: false,
    analyticsTracked: false,
    errors: []
  };
  
  try {
    // Process analytics integration
    if (config.analytics) {
      const analyticsTracked = trackFeedbackSubmission(feedback, config.analytics);
      // Assign boolean explicitly
      result.analyticsTracked = Boolean(analyticsTracked);
    }
    
    // Process issue tracker integration
    if (config.issueTracker) {
      try {
        // Pass the config correctly to the issue tracker function
        const issueResult = await createIssueFromFeedback(feedback, config.issueTracker);
        result.issueTracker = issueResult;
        
        if (issueResult.success) {
          showSuccess(`Issue created: ${issueResult.issueId}`);
        } else if (issueResult.error) {
          result.errors.push(issueResult.error);
          showError(`Failed to create issue: ${issueResult.error}`);
        }
      } catch (error) {
        const errorMessage = `Issue tracker error: ${error instanceof Error ? error.message : String(error)}`;
        result.errors.push(errorMessage);
        showError(errorMessage);
      }
    }
    
    // Process webhook integrations
    if (config.webhooks && config.webhooks.length > 0) {
      try {
        const webhookResults = await sendToWebhooks(feedback, config.webhooks);
        
        // Count successes and failures
        webhookResults.forEach(webhookResult => {
          if (webhookResult.success) {
            result.webhookSuccesses++;
          } else {
            result.webhookFailures++;
            if (webhookResult.error) {
              result.errors.push(webhookResult.error);
            }
          }
        });
        
        // Show summary notification
        if (result.webhookFailures > 0) {
          showInfo(`${result.webhookSuccesses} webhook(s) delivered, ${result.webhookFailures} failed`);
        }
      } catch (error) {
        const errorMessage = `Webhook error: ${error instanceof Error ? error.message : String(error)}`;
        result.errors.push(errorMessage);
        showError(errorMessage);
      }
    }
    
    // Process chat notification integration
    if (config.notifications) {
      try {
        const notificationResult = await sendNotification(feedback, config.notifications);
        result.notificationSent = notificationResult.success;
        
        if (!notificationResult.success && notificationResult.error) {
          result.errors.push(notificationResult.error);
        }
      } catch (error) {
        const errorMessage = `Notification error: ${error instanceof Error ? error.message : String(error)}`;
        result.errors.push(errorMessage);
        showError(errorMessage);
      }
    }
    
    // Set overall success based on errors
    result.success = result.errors.length === 0;
    
    return result;
  } catch (error) {
    const errorMessage = `Integration error: ${error instanceof Error ? error.message : String(error)}`;
    result.errors.push(errorMessage);
    result.success = false;
    showError(errorMessage);
    return result;
  }
};

/**
 * Processes a vote through relevant integrations
 * 
 * @param feedbackId - ID of the feedback being voted on
 * @param config - Feedback system configuration
 */
export const processVoteIntegrations = (
  feedbackId: string,
  config: FeedbackConfig
): void => {
  // Track vote in analytics if configured
  if (config.analytics) {
    trackFeedbackVote(feedbackId, config.analytics);
  }
  
  // Other integrations could be added here in the future
  // For example, notifying when a threshold of votes is reached
};

export * from './analytics';
export * from './issueTracker';
export * from './webhooks';
export * from './notifications';

