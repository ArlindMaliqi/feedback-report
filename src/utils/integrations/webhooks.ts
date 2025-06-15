/**
 * Webhook integration utilities
 * @module utils/integrations/webhooks
 */
import type { Feedback, WebhookConfig } from '../../types';

/**
 * Generate HMAC signature for webhook payload
 */
const generateSignature = async (payload: string, secret: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    // Use Web Crypto API if available
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return 'sha256=' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for environments without Web Crypto API
  console.warn('Web Crypto API not available, webhook signature will be skipped');
  return '';
};

/**
 * Create webhook payload
 */
const createWebhookPayload = (
  event: string,
  feedback: Feedback,
  timestamp: string = new Date().toISOString()
) => {
  return {
    event,
    timestamp,
    data: {
      id: feedback.id,
      type: feedback.type,
      category: feedback.category,
      subcategory: feedback.subcategory,
      message: feedback.message,
      priority: feedback.priority,
      status: feedback.status,
      votes: feedback.votes,
      url: feedback.url,
      userAgent: feedback.userAgent,
      timestamp: feedback.timestamp.toISOString(),
      user: feedback.user ? {
        name: feedback.user.name,
        email: feedback.user.email,
        id: feedback.user.id
      } : null,
      attachments: feedback.attachments ? feedback.attachments.map(att => ({
        id: att.id,
        name: att.name,
        type: att.type,
        size: att.size
      })) : null
    }
  };
};

/**
 * Send webhook notification
 */
export const sendWebhook = async (
  feedback: Feedback,
  config: WebhookConfig,
  event: string = 'feedback.created'
): Promise<{ success: boolean; error?: string }> => {
  if (!config.url) {
    return { success: false, error: 'Webhook URL not provided' };
  }

  // Check if this event should be sent
  if (config.events && config.events.length > 0 && !config.events.includes(event)) {
    return { success: true }; // Skip this event silently
  }

  const timestamp = new Date().toISOString();
  const payload = createWebhookPayload(event, feedback, timestamp);
  const payloadString = JSON.stringify(payload);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'FeedbackWidget/2.0',
    'X-Webhook-Event': event,
    'X-Webhook-Timestamp': timestamp,
    ...config.headers
  };

  // Add signature if secret is provided
  if (config.secret) {
    try {
      const signature = await generateSignature(payloadString, config.secret);
      if (signature) {
        headers['X-Hub-Signature-256'] = signature;
      }
    } catch (error) {
      console.warn('Failed to generate webhook signature:', error);
    }
  }

  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers,
      body: payloadString
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage += ` - ${errorData}`;
        }
      } catch {
        // Ignore parsing errors
      }
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Send multiple webhooks
 */
export const sendWebhooks = async (
  feedback: Feedback,
  configs: WebhookConfig[],
  event: string = 'feedback.created'
): Promise<Array<{ config: WebhookConfig; result: { success: boolean; error?: string } }>> => {
  const results = await Promise.allSettled(
    configs.map(config => sendWebhook(feedback, config, event))
  );

  return configs.map((config, index) => {
    const result = results[index];
    return {
      config,
      result: result.status === 'fulfilled' 
        ? result.value 
        : { success: false, error: result.reason?.message || 'Unknown error' }
    };
  });
};

/**
 * Webhook event types
 */
export const WEBHOOK_EVENTS = {
  FEEDBACK_CREATED: 'feedback.created',
  FEEDBACK_UPDATED: 'feedback.updated',
  FEEDBACK_VOTED: 'feedback.voted',
  FEEDBACK_DELETED: 'feedback.deleted',
  FEEDBACK_STATUS_CHANGED: 'feedback.status_changed'
} as const;

/**
 * Send feedback vote webhook
 */
export const sendVoteWebhook = async (
  feedbackId: string,
  vote: 'up' | 'down',
  configs: WebhookConfig[]
): Promise<void> => {
  const mockFeedback: Feedback = {
    id: feedbackId,
    message: '',
    type: 'other',
    timestamp: new Date(),
    status: 'open',
    votes: 0
  };

  await sendWebhooks(mockFeedback, configs, WEBHOOK_EVENTS.FEEDBACK_VOTED);
};
