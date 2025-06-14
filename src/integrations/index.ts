/**
 * Integrations module
 * @module integrations
 */

import type { Feedback, FeedbackConfig } from '../types';

export interface IntegrationProvider {
  name: string;
  enabled: boolean;
  process: (feedback: Feedback, config: FeedbackConfig) => Promise<void>;
}

export class IntegrationManager {
  private providers: Map<string, IntegrationProvider> = new Map();

  register(provider: IntegrationProvider): void {
    this.providers.set(provider.name, provider);
  }

  async process(feedback: Feedback, config: FeedbackConfig): Promise<void> {
    const promises = Array.from(this.providers.values())
      .filter(provider => provider.enabled)
      .map(provider => provider.process(feedback, config));

    await Promise.allSettled(promises);
  }
}

export const integrationManager = new IntegrationManager();

// Analytics integration
export const analyticsIntegration: IntegrationProvider = {
  name: 'analytics',
  enabled: false,
  async process(feedback: Feedback, config: FeedbackConfig): Promise<void> {
    if (config.analytics && typeof window !== 'undefined') {
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', 'feedback_submitted', {
          feedback_type: feedback.type,
          feedback_category: feedback.category
        });
      }
    }
  }
};

// Webhook integration
export const webhookIntegration: IntegrationProvider = {
  name: 'webhook',
  enabled: false,
  async process(feedback: Feedback, config: FeedbackConfig): Promise<void> {
    if (config.webhooks && config.webhooks.length > 0) {
      const promises = config.webhooks.map(webhook =>
        fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(feedback)
        })
      );

      await Promise.allSettled(promises);
    }
  }
};

// Register default integrations
integrationManager.register(analyticsIntegration);
integrationManager.register(webhookIntegration);

// Add global type declaration for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export class Analytics {
  // ...existing code...
  
  trackFeedbackSubmitted(feedback: any) {
    if (typeof window !== 'undefined') {
      if (window.gtag) {
        window.gtag('event', 'feedback_submitted', {
          // ...existing code...
        });
      }
    }
  }
  
  // ...existing code...
}

export class IssueTracker {
  private provider: string;
  private config: any;

  constructor(provider: string, config: any) {
    this.provider = provider;
    this.config = config;
  }

  async createIssue(feedback: any) {
    console.log(`Creating issue in ${this.provider}:`, feedback);
  }
}

export class GitHubIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async createIssue(feedback: any) {
    console.log('Creating GitHub issue:', feedback);
  }
}

export default integrationManager;
