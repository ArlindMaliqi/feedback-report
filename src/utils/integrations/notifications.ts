/**
 * Chat platform notification utilities for sending feedback alerts to various messaging platforms
 * 
 * This module provides comprehensive integration with popular chat and communication platforms
 * including Slack, Microsoft Teams, Discord, and email notifications. It supports rich message
 * formatting, mentions, attachments, and custom styling for each platform.
 * 
 * @module utils/integrations/notifications
 * @version 2.2.0
 * @author ArlindMaliqi
 * @since 1.4.0
 * 
 * @example Slack notification
 * ```typescript
 * const result = await sendSlackNotification(feedback, {
 *   provider: 'slack',
 *   webhookUrl: 'https://hooks.slack.com/services/...',
 *   channel: '#feedback',
 *   mentions: ['@dev-team', '@channel']
 * });
 * ```
 * 
 * @example Teams notification
 * ```typescript
 * const result = await sendTeamsNotification(feedback, {
 *   provider: 'teams',
 *   webhookUrl: 'https://outlook.office.com/webhook/...',
 *   mentions: ['@team']
 * });
 * ```
 * 
 * @example Discord notification
 * ```typescript
 * const result = await sendDiscordNotification(feedback, {
 *   provider: 'discord',
 *   webhookUrl: 'https://discord.com/api/webhooks/...',
 *   mentions: ['@everyone']
 * });
 * ```
 */
import type { NotificationConfig, Feedback } from '../../types';

/**
 * Standard response interface for all notification operations
 * 
 * @interface NotificationResult
 * @since 1.4.0
 */
export interface NotificationResult {
  /** Whether the notification was sent successfully */
  success: boolean;
  /** Error message if the notification failed */
  error?: string;
  /** Additional metadata from the notification service */
  metadata?: {
    /** Message ID from the platform (if available) */
    messageId?: string;
    /** Timestamp when the message was sent */
    timestamp?: string;
    /** Channel or recipient information */
    channel?: string;
    /** Number of recipients for email notifications */
    recipients?: number;
    /** Email subject for email notifications */
    subject?: string;
  };
}

/**
 * Configuration interface for Slack notifications
 * 
 * @interface SlackConfig
 * @since 1.4.0
 */
export interface SlackConfig {
  /** Provider identifier */
  provider: 'slack';
  /** Slack webhook URL obtained from Slack app configuration */
  webhookUrl: string;
  /** Target channel name (optional, defaults to webhook configuration) */
  channel?: string;
  /** Array of user/group mentions to include in the notification */
  mentions?: string[];
  /** Custom username for the bot (defaults to 'Feedback Bot') */
  username?: string;
  /** Custom emoji icon for the bot */
  iconEmoji?: string;
  /** Whether to use threaded replies */
  useThreads?: boolean;
}

/**
 * Configuration interface for Microsoft Teams notifications
 * 
 * @interface TeamsConfig
 * @since 1.4.0
 */
export interface TeamsConfig {
  /** Provider identifier */
  provider: 'teams';
  /** Teams webhook URL from connector configuration */
  webhookUrl: string;
  /** Array of user mentions to include in the notification */
  mentions?: string[];
  /** Custom theme color for the message card */
  themeColor?: string;
  /** Custom activity title */
  activityTitle?: string;
}

/**
 * Configuration interface for Discord notifications
 * 
 * @interface DiscordConfig
 * @since 1.4.0
 */
export interface DiscordConfig {
  /** Provider identifier */
  provider: 'discord';
  /** Discord webhook URL from server settings */
  webhookUrl: string;
  /** Array of user/role mentions to include in the notification */
  mentions?: string[];
  /** Custom username for the webhook */
  username?: string;
  /** Custom avatar URL for the webhook */
  avatarUrl?: string;
  /** Whether to use Text-to-Speech for the message */
  tts?: boolean;
}

/**
 * Sends a rich Slack notification with comprehensive feedback information
 * 
 * This function creates a beautifully formatted Slack message using Block Kit components
 * for optimal readability and engagement. It includes priority indicators, user information,
 * attachments metadata, and configurable mentions.
 * 
 * @async
 * @function sendSlackNotification
 * @param {Feedback} feedback - The feedback object containing user input and metadata
 * @param {SlackConfig} config - Slack-specific configuration including webhook and formatting options
 * @returns {Promise<NotificationResult>} Result of the notification operation
 * 
 * @throws {Error} When webhook URL is invalid or network request fails
 * @throws {Error} When Slack API returns an error response
 * 
 * @example Basic Slack notification
 * ```typescript
 * const feedback = {
 *   id: 'feedback-123',
 *   message: 'The login button is not responsive on mobile',
 *   type: 'bug',
 *   priority: 'high',
 *   user: { name: 'John Doe', email: 'john@example.com' },
 *   url: 'https://app.example.com/login'
 * };
 * 
 * const result = await sendSlackNotification(feedback, {
 *   provider: 'slack',
 *   webhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
 *   channel: '#bug-reports',
 *   mentions: ['@dev-team'],
 *   username: 'Bug Reporter Bot',
 *   iconEmoji: ':bug:'
 * });
 * 
 * if (result.success) {
 *   console.log('Slack notification sent successfully');
 * } else {
 *   console.error('Failed to send Slack notification:', result.error);
 * }
 * ```
 * 
 * @example Advanced Slack notification with threading
 * ```typescript
 * const result = await sendSlackNotification(feedback, {
 *   provider: 'slack',
 *   webhookUrl: process.env.SLACK_WEBHOOK_URL,
 *   channel: '#feedback',
 *   mentions: ['@channel', '@product-team'],
 *   useThreads: true,
 *   iconEmoji: ':speech_balloon:'
 * });
 * ```
 * 
 * @since 1.4.0
 */
export const sendSlackNotification = async (
  feedback: Feedback,
  config: SlackConfig
): Promise<NotificationResult> => {
  // Priority-based emoji mapping for visual priority indicators
  const priorityEmoji = {
    critical: '🚨',
    high: '⚠️',
    medium: '📝',
    low: '💭'
  } as const;

  // Feedback type emoji mapping for better visual identification
  const typeEmoji = {
    bug: '🐛',
    feature: '💡',
    improvement: '📈',
    other: '💬'
  } as const;

  // Build comprehensive Slack Block Kit message structure
  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${typeEmoji[feedback.type]} New ${feedback.type} feedback received`,
        emoji: true
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Type:* ${feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}`
        },
        {
          type: 'mrkdwn',
          text: `*Priority:* ${priorityEmoji[feedback.priority || 'medium']} ${(feedback.priority || 'Medium').charAt(0).toUpperCase() + (feedback.priority || 'medium').slice(1)}`
        },
        {
          type: 'mrkdwn',
          text: `*Category:* ${feedback.category || 'Not specified'}`
        },
        {
          type: 'mrkdwn',
          text: `*Submitted:* <!date^${Math.floor(feedback.timestamp.getTime() / 1000)}^{date_short} at {time}|${feedback.timestamp.toLocaleString()}>`
        }
      ]
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Message:*\n${feedback.message.length > 500 ? feedback.message.substring(0, 500) + '...' : feedback.message}`
      }
    }
  ];

  // Add user information if available
  if (feedback.user?.name || feedback.user?.email) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*User:* ${feedback.user.name || 'Anonymous'}${feedback.user.email ? ` (${feedback.user.email})` : ''}`
      }
    });
  }

  // Add page URL if available
  if (feedback.url) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Page:* <${feedback.url}|View Page>`
      }
    });
  }

  // Add attachment information if present
  if (feedback.attachments && feedback.attachments.length > 0) {
    const attachmentText = feedback.attachments.map((attachment, index) => 
      `${index + 1}. \`${attachment.name}\` (${Math.round(attachment.size / 1024)}KB)`
    ).join('\n');
    
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Attachments:*\n${attachmentText}`
      }
    });
  }

  // Add feedback ID and metadata in a context block
  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Feedback ID: \`${feedback.id}\` | Status: ${feedback.status || 'open'}`
      }
    ]
  });

  // Add mentions as a separate context block if they exist
  if (config.mentions && config.mentions.length > 0) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: config.mentions.join(' ')
        }
      ]
    });
  }

  // Construct the complete Slack payload
  const payload = {
    channel: config.channel,
    username: config.username || 'Feedback Bot',
    icon_emoji: config.iconEmoji || ':speech_balloon:',
    blocks,
    text: `New ${feedback.type} feedback: ${feedback.message.substring(0, 100)}...`,
    unfurl_links: false,
    unfurl_media: false
  };

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'React-Feedback-Widget/2.2.0'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return { 
        success: false, 
        error: `Slack API error: HTTP ${response.status} - ${errorText}` 
      };
    }

    return { 
      success: true,
      metadata: {
        timestamp: new Date().toISOString(),
        channel: config.channel || 'webhook-default'
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during Slack notification' 
    };
  }
};

/**
 * Sends a Microsoft Teams notification using Adaptive Cards format
 * 
 * This function creates a visually appealing Teams message card with color-coded
 * priority indicators, structured information layout, and actionable elements.
 * It follows Microsoft's Adaptive Cards schema for optimal Teams integration.
 * 
 * @async
 * @function sendTeamsNotification
 * @param {Feedback} feedback - The feedback object containing user input and metadata
 * @param {TeamsConfig} config - Teams-specific configuration including webhook and styling options
 * @returns {Promise<NotificationResult>} Result of the notification operation
 * 
 * @throws {Error} When webhook URL is invalid or malformed
 * @throws {Error} When Teams API returns an error response
 * 
 * @example Basic Teams notification
 * ```typescript
 * const result = await sendTeamsNotification(feedback, {
 *   provider: 'teams',
 *   webhookUrl: 'https://outlook.office.com/webhook/...',
 *   mentions: ['John Doe', 'DevTeam'],
 *   themeColor: '0078D4',
 *   activityTitle: 'New Feedback Alert'
 * });
 * ```
 * 
 * @since 1.4.0
 */
export const sendTeamsNotification = async (
  feedback: Feedback,
  config: TeamsConfig
): Promise<NotificationResult> => {
  // Priority-based color mapping for visual distinction
  const priorityColor = {
    critical: 'FF0000', // Red
    high: 'FFA500',     // Orange  
    medium: '0078D4',   // Microsoft Blue
    low: '808080'       // Gray
  } as const;

  // Build Microsoft Teams MessageCard payload
  const card = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: `New ${feedback.type} feedback: ${feedback.message.substring(0, 100)}...`,
    themeColor: config.themeColor || priorityColor[feedback.priority || 'medium'],
    sections: [
      {
        activityTitle: config.activityTitle || `🔔 New ${feedback.type} feedback received`,
        activitySubtitle: `Priority: ${(feedback.priority || 'Medium').charAt(0).toUpperCase() + (feedback.priority || 'medium').slice(1)} | Status: ${feedback.status || 'Open'}`,
        activityImage: 'https://github.com/ArlindMaliqi/feedback-report/raw/main/assets/feedback-icon.png',
        facts: [
          { name: 'Type', value: feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1) },
          { name: 'Category', value: feedback.category || 'Not specified' },
          { name: 'Submitted', value: feedback.timestamp.toLocaleString() },
          { name: 'Feedback ID', value: feedback.id },
          ...(feedback.user?.name ? [{ name: 'User', value: feedback.user.name }] : []),
          ...(feedback.user?.email ? [{ name: 'Email', value: feedback.user.email }] : []),
          ...(feedback.url ? [{ name: 'Page URL', value: feedback.url }] : []),
          ...(feedback.attachments?.length ? [{ name: 'Attachments', value: `${feedback.attachments.length} file(s)` }] : [])
        ],
        text: feedback.message
      }
    ],
    potentialAction: [
      {
        '@type': 'OpenUri',
        name: 'View Feedback Dashboard',
        targets: [
          {
            os: 'default',
            uri: feedback.url || 'https://yourapp.com/admin/feedback'
          }
        ]
      }
    ]
  };

  // Add mentions section if configured
  if (config.mentions && config.mentions.length > 0) {
    card.sections.push({
      text: `👥 **Mentions:** ${config.mentions.join(', ')}`
    } as any);
  }

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'React-Feedback-Widget/2.2.0'
      },
      body: JSON.stringify(card)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return { 
        success: false, 
        error: `Teams API error: HTTP ${response.status} - ${errorText}` 
      };
    }

    return { 
      success: true,
      metadata: {
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during Teams notification' 
    };
  }
};

/**
 * Sends a Discord notification using rich embed formatting
 * 
 * This function creates a visually rich Discord embed with color-coded priority,
 * structured field layout, and Discord-specific formatting. It supports mentions,
 * custom avatars, and embed styling for optimal Discord integration.
 * 
 * @async
 * @function sendDiscordNotification
 * @param {Feedback} feedback - The feedback object containing user input and metadata
 * @param {DiscordConfig} config - Discord-specific configuration including webhook and styling options
 * @returns {Promise<NotificationResult>} Result of the notification operation
 * 
 * @throws {Error} When webhook URL is invalid or Discord API is unavailable
 * @throws {Error} When Discord API returns an error response
 * 
 * @example Basic Discord notification
 * ```typescript
 * const result = await sendDiscordNotification(feedback, {
 *   provider: 'discord',
 *   webhookUrl: 'https://discord.com/api/webhooks/...',
 *   mentions: ['@everyone', '@developers'],
 *   username: 'Feedback Bot',
 *   avatarUrl: 'https://example.com/bot-avatar.png'
 * });
 * ```
 * 
 * @since 1.4.0
 */
export const sendDiscordNotification = async (
  feedback: Feedback,
  config: DiscordConfig
): Promise<NotificationResult> => {
  // Priority-based color mapping using Discord's color system
  const priorityColor = {
    critical: 0xFF0000, // Red
    high: 0xFFA500,     // Orange
    medium: 0x0078D4,   // Blue
    low: 0x808080       // Gray
  } as const;

  // Feedback type emoji mapping for Discord
  const typeEmoji = {
    bug: '🐛',
    feature: '💡',
    improvement: '📈',
    other: '💬'
  } as const;

  // Build Discord embed object
  const embed = {
    title: `${typeEmoji[feedback.type]} New ${feedback.type} feedback received`,
    description: feedback.message.length > 2000 ? feedback.message.substring(0, 1997) + '...' : feedback.message,
    color: priorityColor[feedback.priority || 'medium'],
    fields: [
      { name: '📝 Type', value: feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1), inline: true },
      { name: '⚡ Priority', value: (feedback.priority || 'Medium').charAt(0).toUpperCase() + (feedback.priority || 'medium').slice(1), inline: true },
      { name: '📂 Category', value: feedback.category || 'Not specified', inline: true },
      { name: '🆔 Feedback ID', value: `\`${feedback.id}\``, inline: true },
      { name: '📊 Status', value: (feedback.status || 'Open').charAt(0).toUpperCase() + (feedback.status || 'open').slice(1), inline: true },
      ...(feedback.user?.name ? [{ name: '👤 User', value: feedback.user.name, inline: true }] : []),
      ...(feedback.user?.email ? [{ name: '📧 Email', value: feedback.user.email, inline: true }] : []),
      ...(feedback.url ? [{ name: '🔗 Page URL', value: `[View Page](${feedback.url})`, inline: false }] : []),
      ...(feedback.attachments?.length ? [{ 
        name: '📎 Attachments', 
        value: feedback.attachments.map((att, i) => `${i + 1}. \`${att.name}\` (${Math.round(att.size / 1024)}KB)`).join('\n'),
        inline: false 
      }] : [])
    ],
    timestamp: feedback.timestamp.toISOString(),
    footer: {
      text: `React Feedback Widget • ${feedback.timestamp.toLocaleDateString()}`,
      icon_url: 'https://github.com/ArlindMaliqi/feedback-report/raw/main/assets/widget-icon.png'
    },
    thumbnail: {
      url: feedback.user?.avatar || 'https://github.com/ArlindMaliqi/feedback-report/raw/main/assets/default-avatar.png'
    }
  };

  // Construct Discord webhook payload
  const payload = {
    username: config.username || 'Feedback Bot',
    avatar_url: config.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png',
    embeds: [embed],
    content: config.mentions && config.mentions.length > 0 ? config.mentions.join(' ') : undefined,
    tts: config.tts || false
  };

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'React-Feedback-Widget/2.2.0'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      
      // Handle specific Discord API errors
      if (response.status === 400) {
        return { success: false, error: `Discord API validation error: ${errorMessage}` };
      } else if (response.status === 404) {
        return { success: false, error: 'Discord webhook not found or invalid URL' };
      } else if (response.status === 429) {
        return { success: false, error: 'Discord API rate limit exceeded. Please try again later.' };
      }
      
      return { success: false, error: `Discord API error: ${errorMessage}` };
    }

    return { 
      success: true,
      metadata: {
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during Discord notification' 
    };
  }
};

/**
 * Sends an email notification with comprehensive feedback information
 * 
 * This function prepares email data for server-side processing since email
 * sending requires server-side SMTP configuration. It creates a well-formatted
 * HTML email template with all feedback details.
 * 
 * @async
 * @function sendEmailNotification
 * @param {Feedback} feedback - The feedback object containing user input and metadata
 * @param {NotificationConfig['email']} config - Email-specific configuration including SMTP settings
 * @returns {Promise<NotificationResult>} Result of the email preparation (actual sending requires server-side implementation)
 * 
 * @example Email notification configuration
 * ```typescript
 * const emailConfig = {
 *   smtp: {
 *     host: 'smtp.gmail.com',
 *     port: 587,
 *     secure: false,
 *     auth: {
 *       user: 'your-email@gmail.com',
 *       pass: 'your-app-password'
 *     }
 *   },
 *   from: 'feedback@yourapp.com',
 *   to: ['admin@yourapp.com', 'support@yourapp.com'],
 *   subject: 'New Feedback Received'
 * };
 * 
 * const result = await sendEmailNotification(feedback, emailConfig);
 * ```
 * 
 * @since 1.4.0
 */
export const sendEmailNotification = async (
  feedback: Feedback,
  config: NotificationConfig['email']
): Promise<NotificationResult> => {
  if (!config?.from || !config?.to) {
    return { 
      success: false, 
      error: 'Email configuration incomplete: from and to addresses are required' 
    };
  }

  // Priority-based styling for email
  const priorityStyles = {
    critical: { color: '#dc2626', backgroundColor: '#fef2f2', border: '2px solid #dc2626' },
    high: { color: '#ea580c', backgroundColor: '#fff7ed', border: '2px solid #ea580c' },
    medium: { color: '#2563eb', backgroundColor: '#eff6ff', border: '2px solid #2563eb' },
    low: { color: '#6b7280', backgroundColor: '#f9fafb', border: '2px solid #6b7280' }
  } as const;

  const priorityStyle = priorityStyles[feedback.priority || 'medium'];

  // Generate comprehensive HTML email template
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New ${feedback.type} Feedback</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .priority-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-left: 10px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .info-item { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; }
        .info-label { font-weight: bold; color: #495057; margin-bottom: 5px; }
        .info-value { color: #6c757d; }
        .message-box { background: #f1f3f4; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #34a853; }
        .attachments { background: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #6c757d; }
        .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New ${feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)} Feedback</h1>
          <span class="priority-badge" style="background: ${priorityStyle.backgroundColor}; color: ${priorityStyle.color}; border: 1px solid ${priorityStyle.color};">
            ${(feedback.priority || 'Medium').toUpperCase()} PRIORITY
          </span>
        </div>
        
        <div class="content">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">📝 Type</div>
              <div class="info-value">${feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">📂 Category</div>
              <div class="info-value">${feedback.category || 'Not specified'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">📅 Submitted</div>
              <div class="info-value">${feedback.timestamp.toLocaleString()}</div>
            </div>
            <div class="info-item">
              <div class="info-label">🆔 Feedback ID</div>
              <div class="info-value">${feedback.id}</div>
            </div>
            ${feedback.user?.name ? `
            <div class="info-item">
              <div class="info-label">👤 User</div>
              <div class="info-value">${feedback.user.name}${feedback.user.email ? ` (${feedback.user.email})` : ''}</div>
            </div>
            ` : ''}
            ${feedback.url ? `
            <div class="info-item">
              <div class="info-label">🔗 Page URL</div>
              <div class="info-value"><a href="${feedback.url}" target="_blank">${feedback.url}</a></div>
            </div>
            ` : ''}
          </div>
          
          <div class="message-box">
            <h3>💬 Message</h3>
            <p>${feedback.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          ${feedback.attachments && feedback.attachments.length > 0 ? `
          <div class="attachments">
            <h3>📎 Attachments (${feedback.attachments.length})</h3>
            <ul>
              ${feedback.attachments.map(attachment => 
                `<li><strong>${attachment.name}</strong> (${Math.round(attachment.size / 1024)}KB) - ${attachment.type}</li>`
              ).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${feedback.url ? `
          <div style="text-align: center; margin: 20px 0;">
            <a href="${feedback.url}" class="button">🔗 View Original Page</a>
          </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>This email was automatically generated by React Feedback Widget v2.2.0</p>
          <p>Feedback received at ${feedback.timestamp.toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Prepare email data structure for server-side processing
  const emailData = {
    from: config.from,
    to: Array.isArray(config.to) ? config.to : [config.to],
    subject: config.subject || `🔔 New ${feedback.type} feedback: ${feedback.message.substring(0, 50)}...`,
    html: htmlTemplate,
    text: `
New ${feedback.type} feedback received

Type: ${feedback.type}
Category: ${feedback.category || 'Not specified'}  
Priority: ${feedback.priority || 'Medium'}
Submitted: ${feedback.timestamp.toLocaleString()}
${feedback.user?.name ? `User: ${feedback.user.name}${feedback.user.email ? ` (${feedback.user.email})` : ''}` : ''}
${feedback.url ? `Page: ${feedback.url}` : ''}

Message:
${feedback.message}

${feedback.attachments?.length ? `Attachments: ${feedback.attachments.length} file(s)` : ''}

Feedback ID: ${feedback.id}
    `.trim(),
    attachments: feedback.attachments?.map(att => ({
      filename: att.name,
      content: att.data,
      contentType: att.type
    })) || []
  };

  // Note: Actual email sending requires server-side implementation
  console.log('📧 Email notification prepared:', {
    to: emailData.to,
    subject: emailData.subject,
    attachmentCount: emailData.attachments.length
  });

  return { 
    success: true,
    metadata: {
      timestamp: new Date().toISOString(),
      recipients: emailData.to.length,
      subject: emailData.subject
    }
  };
};

/**
 * Universal notification dispatcher that routes to the appropriate platform
 * 
 * This is the main entry point for sending notifications. It automatically
 * detects the notification configuration type and routes to the appropriate
 * platform-specific implementation.
 * 
 * @async
 * @function sendNotification
 * @param {Feedback} feedback - The feedback object to send notifications for
 * @param {SlackConfig | TeamsConfig | DiscordConfig | NotificationConfig} config - Platform-specific or multi-platform configuration
 * @returns {Promise<NotificationResult>} Result of the notification operation
 * 
 * @throws {Error} When no valid notification configuration is provided
 * @throws {Error} When the specified provider is not supported
 * 
 * @example Single platform notification
 * ```typescript
 * const slackResult = await sendNotification(feedback, {
 *   provider: 'slack',
 *   webhookUrl: 'https://hooks.slack.com/services/...',
 *   channel: '#feedback'
 * });
 * ```
 * 
 * @example Multi-platform notification configuration
 * ```typescript
 * const multiPlatformConfig = {
 *   slack: {
 *     webhookUrl: 'https://hooks.slack.com/services/...',
 *     channel: '#feedback'
 *   },
 *   discord: {
 *     webhookUrl: 'https://discord.com/api/webhooks/...',
 *     mentions: ['@developers']
 *   },
 *   email: {
 *     from: 'feedback@app.com',
 *     to: ['admin@app.com']
 *   }
 * };
 * 
 * const result = await sendNotification(feedback, multiPlatformConfig);
 * ```
 * 
 * @since 1.4.0
 */
export const sendNotification = async (
  feedback: Feedback,
  config: SlackConfig | TeamsConfig | DiscordConfig | NotificationConfig
): Promise<NotificationResult> => {
  // Validate feedback object
  if (!feedback || !feedback.id || !feedback.message) {
    return { 
      success: false, 
      error: 'Invalid feedback object: id and message are required' 
    };
  }

  try {
    // Handle multi-platform notification configuration
    if ('slack' in config && config.slack) {
      return sendSlackNotification(feedback, { provider: 'slack', ...config.slack });
    }
    
    if ('teams' in config && config.teams) {
      return sendTeamsNotification(feedback, { provider: 'teams', ...config.teams });
    }
    
    if ('discord' in config && config.discord) {
      return sendDiscordNotification(feedback, { provider: 'discord', ...config.discord });
    }

    if ('email' in config && config.email) {
      return sendEmailNotification(feedback, config.email);
    }

    // Handle direct provider configurations
    if ('provider' in config) {
      switch (config.provider) {
        case 'slack':
          return sendSlackNotification(feedback, config as SlackConfig);
        case 'teams':
          return sendTeamsNotification(feedback, config as TeamsConfig);
        case 'discord':
          return sendDiscordNotification(feedback, config as DiscordConfig);
        default:
          return { 
            success: false, 
            error: `Unsupported notification provider: ${(config as any).provider}. Supported providers: slack, teams, discord` 
          };
      }
    }

    return { 
      success: false, 
      error: 'No valid notification configuration found. Please provide slack, teams, discord, or email configuration.' 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during notification processing' 
    };
  }
};

/**
 * Sends notifications to multiple platforms simultaneously
 * 
 * This function allows sending the same feedback notification to multiple
 * platforms at once, with individual error handling for each platform.
 * 
 * @async
 * @function sendMultiPlatformNotification
 * @param {Feedback} feedback - The feedback object to send notifications for
 * @param {Array<SlackConfig | TeamsConfig | DiscordConfig>} configs - Array of platform configurations
 * @returns {Promise<Array<{platform: string; result: NotificationResult}>>} Results for each platform
 * 
 * @example
 * ```typescript
 * const results = await sendMultiPlatformNotification(feedback, [
 *   { provider: 'slack', webhookUrl: '...', channel: '#feedback' },
 *   { provider: 'discord', webhookUrl: '...', mentions: ['@team'] },
 *   { provider: 'teams', webhookUrl: '...' }
 * ]);
 * 
 * results.forEach(({ platform, result }) => {
 *   if (result.success) {
 *     console.log(`✅ ${platform} notification sent successfully`);
 *   } else {
 *     console.error(`❌ ${platform} notification failed:`, result.error);
 *   }
 * });
 * ```
 * 
 * @since 2.0.0
 */
export const sendMultiPlatformNotification = async (
  feedback: Feedback,
  configs: Array<SlackConfig | TeamsConfig | DiscordConfig>
): Promise<Array<{platform: string; result: NotificationResult}>> => {
  const promises = configs.map(async (config) => {
    const result = await sendNotification(feedback, config);
    return {
      platform: config.provider,
      result
    };
  });

  return Promise.all(promises);
};
