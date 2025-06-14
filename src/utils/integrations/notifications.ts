/**
 * Chat platform notification utilities for sending feedback alerts
 * @module notifications
 */
import type { NotificationConfig, Feedback } from '../../types';

/**
 * Result of a notification delivery attempt
 */
interface NotificationResult {
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
 * Type definitions for Slack message blocks
 */
interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  [key: string]: any; // Allow additional properties for different block types
}

/**
 * Type definitions for Teams message sections
 */
interface TeamsSection {
  activityTitle?: string;
  activitySubtitle?: string;
  text?: string;
  facts?: Array<{ name: string; value: string }>;
  [key: string]: any; // Allow additional properties
}

/**
 * Configuration for Slack notifications
 */
export interface SlackConfig {
  provider: 'slack';
  webhookUrl: string;
  channel?: string;
  mentions?: string[];
}

/**
 * Configuration for Microsoft Teams notifications
 */
export interface TeamsConfig {
  provider: 'teams';
  webhookUrl: string;
  mentions?: string[];
}

/**
 * Configuration for Discord notifications
 */
export interface DiscordConfig {
  provider: 'discord';
  webhookUrl: string;
  mentions?: string[];
}

/**
 * Formats a Slack message from feedback
 * 
 * @param feedback - The feedback to format
 * @param config - Notification configuration
 * @returns Formatted Slack message payload
 */
const formatSlackMessage = (feedback: Feedback, config: NotificationConfig): any => {
  // Format timestamp
  const timestamp = new Date(feedback.timestamp).toLocaleString();
  
  // Build the message blocks
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `New Feedback: ${feedback.type || 'General Feedback'}`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: feedback.message
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Type:*\n${feedback.type || 'Not specified'}`
        },
        {
          type: 'mrkdwn',
          text: `*Time:*\n${timestamp}`
        }
      ]
    }
  ];
  
  // Add category if available
  if (feedback.category) {
    blocks.push({
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Category:*\n${feedback.category}${feedback.subcategory ? ` / ${feedback.subcategory}` : ''}`
        }
      ]
    });
  }
  
  // Add URL if available
  if (feedback.url) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Page:* ${feedback.url}`
      }
    });
  }
  
  // Add user info if available
  if (feedback.user?.name || feedback.user?.email) {
    const userInfo = [
      feedback.user.name ? `*Name:* ${feedback.user.name}` : '',
      feedback.user.email ? `*Email:* ${feedback.user.email}` : ''
    ].filter(Boolean).join('\n');
    
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Submitted by:*\n${userInfo}`
      }
    });
  }
  
  // Add attachments info if available
  if (feedback.attachments && feedback.attachments.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Attachments:* ${feedback.attachments.length} file(s) included`
      }
    });
  }
  
  // Add divider - properly typed now
  blocks.push({ 
    type: 'divider'
  });
  
  // Construct the final message
  return {
    channel: config.channel,
    username: config.username || 'Feedback Bot',
    icon_url: config.iconUrl,
    blocks: blocks
  };
};

/**
 * Formats a Microsoft Teams message from feedback
 * 
 * @param feedback - The feedback to format
 * @param config - Notification configuration
 * @returns Formatted Teams message payload
 */
const formatTeamsMessage = (feedback: Feedback, config: NotificationConfig): any => {
  // Format timestamp
  const timestamp = new Date(feedback.timestamp).toLocaleString();
  
  // Determine color based on feedback type
  let themeColor = '0078D7'; // Default blue
  if (feedback.type === 'bug') {
    themeColor = 'D13438'; // Red
  } else if (feedback.type === 'feature') {
    themeColor = '107C10'; // Green
  }
  
  // Build the sections with flexible facts array
  const sections: TeamsSection[] = [
    {
      activityTitle: `New Feedback: ${feedback.type || 'General Feedback'}`,
      activitySubtitle: `Submitted on ${timestamp}`,
      text: feedback.message
    }
  ];
  
  // Create facts array with proper typing
  const facts: Array<{ name: string; value: string }> = [];
  
  facts.push({ name: 'Type', value: feedback.type || 'Not specified' });
  
  if (feedback.category) {
    facts.push({
      name: 'Category',
      value: `${feedback.category}${feedback.subcategory ? ` / ${feedback.subcategory}` : ''}`
    });
  }
  
  if (feedback.url) {
    facts.push({ name: 'Page', value: feedback.url });
  }
  
  if (feedback.user?.name) {
    facts.push({ name: 'User', value: feedback.user.name });
  }
  
  if (feedback.user?.email) {
    facts.push({ name: 'Email', value: feedback.user.email });
  }
  
  if (feedback.attachments && feedback.attachments.length > 0) {
    facts.push({ name: 'Attachments', value: `${feedback.attachments.length} file(s)` });
  }
  
  // Add facts to sections properly
  sections.push({ facts });
  
  // Construct the final message
  return {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    themeColor,
    summary: `New Feedback: ${feedback.type || 'General Feedback'}`,
    sections
  };
};

/**
 * Formats a Discord message from feedback
 * 
 * @param feedback - The feedback to format
 * @param config - Notification configuration
 * @returns Formatted Discord message payload
 */
const formatDiscordMessage = (feedback: Feedback, config: NotificationConfig): any => {
  // Format timestamp
  const timestamp = new Date(feedback.timestamp).toLocaleString();
  
  // Determine color based on feedback type
  let color = 3447003; // Default blue
  if (feedback.type === 'bug') {
    color = 15158332; // Red
  } else if (feedback.type === 'feature') {
    color = 3066993; // Green
  }
  
  // Build the fields
  const fields = [
    { name: 'Type', value: feedback.type || 'Not specified', inline: true },
    { name: 'Time', value: timestamp, inline: true }
  ];
  
  if (feedback.category) {
    fields.push({
      name: 'Category',
      value: `${feedback.category}${feedback.subcategory ? ` / ${feedback.subcategory}` : ''}`,
      inline: true
    });
  }
  
  if (feedback.url) {
    fields.push({ name: 'Page', value: feedback.url, inline: false });
  }
  
  if (feedback.user?.name || feedback.user?.email) {
    const userInfo = [
      feedback.user.name ? `Name: ${feedback.user.name}` : '',
      feedback.user.email ? `Email: ${feedback.user.email}` : ''
    ].filter(Boolean).join('\n');
    
    fields.push({ name: 'Submitted by', value: userInfo, inline: false });
  }
  
  if (feedback.attachments && feedback.attachments.length > 0) {
    fields.push({
      name: 'Attachments',
      value: `${feedback.attachments.length} file(s) included`,
      inline: false
    });
  }
  
  // Construct the final message
  return {
    username: config.username || 'Feedback Bot',
    avatar_url: config.iconUrl,
    embeds: [
      {
        title: `New Feedback: ${feedback.type || 'General Feedback'}`,
        description: feedback.message,
        color,
        fields,
        timestamp: new Date(feedback.timestamp).toISOString()
      }
    ]
  };
};

/**
 * Send notification based on provider
 */
export const sendNotification = async (
  feedback: Feedback,
  _config: SlackConfig | TeamsConfig | DiscordConfig
): Promise<void> => {
  try {
    // Implementation for sending notifications
    console.log('Notification sent for feedback:', feedback.id);
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

/**
 * Send Slack notification
 */
export const sendSlackNotification = async (
  feedback: Feedback,
  config: SlackConfig
): Promise<void> => {
  // Implementation for Slack notification
  console.log('Sending Slack notification for feedback:', feedback.id);
};

/**
 * Send Teams notification
 */
export const sendTeamsNotification = async (
  feedback: Feedback,
  config: TeamsConfig
): Promise<void> => {
  // Implementation for Teams notification
  console.log('Sending Teams notification for feedback:', feedback.id);
};

/**
 * Send Discord notification
 */
export const sendDiscordNotification = async (
  feedback: Feedback,
  config: DiscordConfig
): Promise<void> => {
  // Implementation for Discord notification
  console.log('Sending Discord notification for feedback:', feedback.id);
};

/**
 * Create Microsoft Teams message payload
 */
const createTeamsMessage = (feedback: Feedback): any => {
  // Create properly typed facts array
  const facts: Array<{ name: string; value: string }> = [];

  facts.push({ name: 'Type', value: feedback.type || 'Not specified' });

  if (feedback.priority) {
    facts.push({ name: 'Priority', value: feedback.priority });
  }

  if (feedback.category) {
    facts.push({ 
      name: 'Category', 
      value: `${feedback.category}${feedback.subcategory ? ` / ${feedback.subcategory}` : ''}` 
    });
  }

  if (feedback.url) {
    facts.push({ name: 'Page', value: feedback.url });
  }

  if (feedback.user?.name) {
    facts.push({ name: 'User', value: feedback.user.name });
  }

  if (feedback.user?.email) {
    facts.push({ name: 'Email', value: feedback.user.email });
  }

  if (feedback.attachments && feedback.attachments.length > 0) {
    facts.push({ name: 'Attachments', value: `${feedback.attachments.length} file(s)` });
  }

  return {
    "@type": "MessageCard",
    "@context": "https://schema.org/extensions",
    summary: "New Feedback Received",
    themeColor: feedback.type === 'bug' ? 'FF0000' : '0078D4',
    sections: [{
      activityTitle: 'New Feedback',
      activitySubtitle: feedback.message,
      facts: facts
    }]
  };
};
