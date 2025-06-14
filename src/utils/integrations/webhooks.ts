/**
 * Webhook integration utilities for sending feedback to external systems
 * @module webhooks
 */
import type { WebhookConfig, Feedback } from '../../types';

/**
 * Result of a webhook delivery attempt
 */
interface WebhookResult {
  /** Success indicator */
  success: boolean;
  /** Status code from the response */
  statusCode?: number;
  /** Response data if available */
  response?: any;
  /** Error message if delivery failed */
  error?: string;
}

/**
 * Sends feedback to a webhook endpoint
 * 
 * @param feedback - The feedback to send
 * @param webhook - Webhook configuration
 * @returns Promise resolving to webhook result
 */
export const sendToWebhook = async (
  feedback: Feedback,
  webhook: WebhookConfig
): Promise<WebhookResult> => {
  if (!webhook.url) {
    return {
      success: false,
      error: 'Webhook URL is required'
    };
  }
  
  try {
    // Check if this webhook should be used for this feedback type
    if (webhook.feedbackTypes && 
        feedback.type && 
        !webhook.feedbackTypes.includes(feedback.type)) {
      return {
        success: false,
        error: `Webhook not configured for feedback type: ${feedback.type}`
      };
    }
    
    // Prepare the payload
    let payload: Record<string, any> = { ...feedback };
    
    // Transform data if a transform function is provided
    if (typeof webhook.transformData === 'function') {
      payload = webhook.transformData(feedback);
    }
    
    // Prepare the request
    const method = webhook.method || 'POST';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...webhook.headers
    };
    
    // Sign the payload if a secret is provided
    if (webhook.secret) {
      const signature = await signPayload(JSON.stringify(payload), webhook.secret);
      headers['X-Feedback-Signature'] = signature;
    }
    
    // Send the webhook request
    const response = await fetch(webhook.url, {
      method,
      headers,
      body: JSON.stringify(payload)
    });
    
    // Parse the response
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Return the result
    return {
      success: response.ok,
      statusCode: response.status,
      response: responseData,
      error: response.ok ? undefined : `Webhook responded with status ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error sending webhook: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Signs a payload with HMAC-SHA256 using the provided secret
 * 
 * @param payload - The payload to sign
 * @param secret - The secret to use for signing
 * @returns Promise resolving to the signature
 */
const signPayload = async (payload: string, secret: string): Promise<string> => {
  // Use Web Crypto API if available
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      // Convert the secret to a key
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      // Sign the payload
      const payloadData = encoder.encode(payload);
      const signature = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        payloadData
      );
      
      // Convert to hex
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('Error signing payload:', error);
      return '';
    }
  }
  
  // Fallback for environments without Web Crypto API
  console.warn('Web Crypto API not available, payload not signed');
  return '';
};

/**
 * Sends feedback to multiple webhook endpoints
 * 
 * @param feedback - The feedback to send
 * @param webhooks - Array of webhook configurations
 * @returns Promise resolving to array of webhook results
 */
export const sendToWebhooks = async (
  feedback: Feedback,
  webhooks: WebhookConfig[]
): Promise<WebhookResult[]> => {
  if (!webhooks || webhooks.length === 0) {
    return [];
  }
  
  // Send to all webhooks in parallel
  const results = await Promise.all(
    webhooks.map(webhook => sendToWebhook(feedback, webhook))
  );
  
  return results;
};
