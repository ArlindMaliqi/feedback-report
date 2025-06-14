/**
 * Integration utilities index
 * @module utils/integrations/index
 */

// Re-export core integration functions
export { processIntegrations, processVoteIntegrations } from '../integrations';

// Re-export analytics functions
export { 
  processFeedbackAnalytics, 
  processVoteAnalytics,
  trackFeedbackEvent 
} from './analytics';

// Re-export issue tracker functions
export { 
  createIssue,
  createGitHubIssue,
  createJiraIssue,
  createAzureDevOpsIssue
} from './issueTracker';

// Re-export notification functions
export { 
  sendNotification,
  sendSlackNotification,
  sendTeamsNotification,
  sendDiscordNotification
} from './notifications';

// Re-export webhook functions
export { sendWebhook } from './webhooks';

// Import functions to use in this module
import { processFeedbackAnalytics } from './analytics';
import { createIssue } from './issueTracker';
import { sendNotification } from './notifications';

// Type definitions
export interface IntegrationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface IntegrationProcessingResult {
  analyticsProcessed: boolean;
  issueCreated: boolean;
  webhooksSent: boolean;
  notificationSent: boolean;
  errors: string[];
}

/**
 * Process all integrations for a feedback submission
 */
export const processAllIntegrations = async (
  feedback: any,
  config: any
): Promise<IntegrationProcessingResult> => {
  const result: IntegrationProcessingResult = {
    analyticsProcessed: false,
    issueCreated: false,
    webhooksSent: false,
    notificationSent: false,
    errors: []
  };

  // Process analytics
  if (config.analytics) {
    try {
      await processFeedbackAnalytics(feedback, config.analytics);
      result.analyticsProcessed = true;
    } catch (error) {
      result.errors.push(`Analytics failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Process issue creation
  if (config.issueTracker) {
    try {
      await createIssue(feedback, config.issueTracker);
      result.issueCreated = true;
    } catch (error) {
      result.errors.push(`Issue creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Process notifications
  if (config.notifications) {
    try {
      await sendNotification(feedback, config.notifications);
      result.notificationSent = true;
    } catch (error) {
      result.errors.push(`Notification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return result;
};

