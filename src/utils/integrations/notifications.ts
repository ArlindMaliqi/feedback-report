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
  
  // Build the sections
  const sections: TeamsSection[] = [
    {
      activityTitle: `New Feedback: ${feedback.type || 'General Feedback'}`,
      activitySubtitle: `Submitted on ${timestamp}`,
      text: feedback.message
    }
  ];
  
  // Add facts
  const facts = [
    { name: 'Type', value: feedback.type || 'Not specified' }
  ];
  
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
  
  // Fix the facts assignment by adding a new section with proper type
  sections.push({ 
    facts: facts
  });
  
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
 * Sends a notification to the configured chat platform
 * 
 * @param feedback - The feedback to send notification about
 * @param config - Notification configuration
 * @returns Promise resolving to notification result
 */
export const sendNotification = async (
  feedback: Feedback,
  config: NotificationConfig
): Promise<NotificationResult> => {
  if (!config || !config.webhookUrl) {
    return {
      success: false,
      error: 'Notification configuration or webhook URL is missing'
    };
  }
  
  try {
    // Check if this notification should be sent for this feedback type
    if (config.feedbackTypes && 
        feedback.type && 
        !config.feedbackTypes.includes(feedback.type)) {
      return {
        success: false,
        error: `Notification not configured for feedback type: ${feedback.type}`
      };
    }
    
    // Prepare the message payload
    let payload: any;
    
    // Use custom transform if provided
    if (typeof config.transformMessage === 'function') {
      payload = config.transformMessage(feedback);
    } else {
      // Format based on platform
      switch (config.platform) {
        case 'slack':
          payload = formatSlackMessage(feedback, config);
          break;
          
        case 'teams':
          payload = formatTeamsMessage(feedback, config);
          break;
          
        case 'discord':
          payload = formatDiscordMessage(feedback, config);
          break;
          
        case 'custom':
          // For custom, we expect the user to handle formatting
          payload = { feedback };
          break;
          
        default:
          return {
            success: false,
            error: `Unsupported notification platform: ${config.platform}`
          };
      }
    }
    
    // Send the notification
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    // Parse the response
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }
    
    // Return the result
    return {
      success: response.ok,
      statusCode: response.status,
      response: responseData,
      error: response.ok ? undefined : `Notification responded with status ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error sending notification: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
