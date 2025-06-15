/**
 * Chat platform notification utilities for sending feedback alerts
 * @module integrations/notifications
 * @version 2.0.0
 * @author ArlindMaliqi
 * @since 1.4.0
 */
import type { NotificationConfig, Feedback } from '../../types';

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
 * Send Slack notification
 */
export const sendSlackNotification = async (
  feedback: Feedback,
  config: SlackConfig
): Promise<{ success: boolean; error?: string }> => {
  const priorityEmoji = {
    critical: '🚨',
    high: '⚠️',
    medium: '📝',
    low: '💭'
  };

  const typeEmoji = {
    bug: '🐛',
    feature: '💡',
    improvement: '📈',
    other: '💬'
  };

  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${typeEmoji[feedback.type]} New ${feedback.type} feedback received`
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Type:* ${feedback.type}`
        },
        {
          type: 'mrkdwn',
          text: `*Priority:* ${priorityEmoji[feedback.priority || 'medium']} ${feedback.priority || 'Medium'}`
        },
        {
          type: 'mrkdwn',
          text: `*Category:* ${feedback.category || 'Not specified'}`
        },
        {
          type: 'mrkdwn',
          text: `*Submitted:* ${feedback.timestamp.toLocaleString()}`
        }
      ]
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Message:*\n${feedback.message}`
      }
    }
  ];

  if (feedback.user?.name || feedback.user?.email) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*User:* ${feedback.user.name || 'Anonymous'}${feedback.user.email ? ` (${feedback.user.email})` : ''}`
      }
    });
  }

  if (feedback.url) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Page:* <${feedback.url}|View Page>`
      }
    });
  }

  if (feedback.attachments && feedback.attachments.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Attachments:* ${feedback.attachments.length} file(s) attached`
      }
    });
  }

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

  const payload = {
    channel: config.channel,
    username: 'Feedback Bot',
    icon_emoji: ':speech_balloon:',
    blocks,
    text: `New ${feedback.type} feedback: ${feedback.message.substring(0, 100)}...`
  };

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Send Teams notification
 */
export const sendTeamsNotification = async (
  feedback: Feedback,
  config: TeamsConfig
): Promise<{ success: boolean; error?: string }> => {
  const priorityColor = {
    critical: 'attention',
    high: 'warning',
    medium: 'good',
    low: 'accent'
  };

  const card = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: `New ${feedback.type} feedback`,
    themeColor: priorityColor[feedback.priority || 'medium'] === 'attention' ? 'FF0000' : 
                priorityColor[feedback.priority || 'medium'] === 'warning' ? 'FFA500' : '0078D4',
    sections: [
      {
        activityTitle: `New ${feedback.type} feedback received`,
        activitySubtitle: `Priority: ${feedback.priority || 'Medium'}`,
        facts: [
          { name: 'Type', value: feedback.type },
          { name: 'Category', value: feedback.category || 'Not specified' },
          { name: 'Submitted', value: feedback.timestamp.toLocaleString() },
          ...(feedback.user?.name ? [{ name: 'User', value: feedback.user.name }] : []),
          ...(feedback.url ? [{ name: 'Page', value: feedback.url }] : [])
        ],
        text: feedback.message
      }
    ]
  };

  if (config.mentions && config.mentions.length > 0) {
    card.sections.push({
      text: config.mentions.join(' ')
    } as any);
  }

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Send Discord notification
 */
export const sendDiscordNotification = async (
  feedback: Feedback,
  config: DiscordConfig
): Promise<{ success: boolean; error?: string }> => {
  const priorityColor = {
    critical: 0xFF0000, // Red
    high: 0xFFA500,     // Orange
    medium: 0x0078D4,   // Blue
    low: 0x808080       // Gray
  };

  const typeEmoji = {
    bug: '🐛',
    feature: '💡',
    improvement: '📈',
    other: '💬'
  };

  const embed = {
    title: `${typeEmoji[feedback.type]} New ${feedback.type} feedback`,
    description: feedback.message,
    color: priorityColor[feedback.priority || 'medium'],
    fields: [
      { name: 'Type', value: feedback.type, inline: true },
      { name: 'Priority', value: feedback.priority || 'Medium', inline: true },
      { name: 'Category', value: feedback.category || 'Not specified', inline: true },
      ...(feedback.user?.name ? [{ name: 'User', value: feedback.user.name, inline: true }] : []),
      ...(feedback.url ? [{ name: 'Page', value: feedback.url, inline: false }] : [])
    ],
    timestamp: feedback.timestamp.toISOString(),
    footer: {
      text: `Feedback ID: ${feedback.id}`
    }
  };

  const payload = {
    username: 'Feedback Bot',
    avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
    embeds: [embed],
    content: config.mentions && config.mentions.length > 0 ? config.mentions.join(' ') : undefined
  };

  try {
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Send email notification
 */
export const sendEmailNotification = async (
  feedback: Feedback,
  config: NotificationConfig['email']
): Promise<{ success: boolean; error?: string }> => {
  if (!config?.smtp || !config?.from || !config?.to) {
    return { success: false, error: 'Email configuration incomplete' };
  }

  // This would require a server-side implementation
  // For client-side, we can only prepare the data
  const emailData = {
    from: config.from,
    to: config.to,
    subject: config.subject || `New ${feedback.type} feedback: ${feedback.message.substring(0, 50)}...`,
    html: `
      <h2>New ${feedback.type} feedback received</h2>
      <p><strong>Type:</strong> ${feedback.type}</p>
      <p><strong>Category:</strong> ${feedback.category || 'Not specified'}</p>
      <p><strong>Priority:</strong> ${feedback.priority || 'Medium'}</p>
      <p><strong>Submitted:</strong> ${feedback.timestamp.toLocaleString()}</p>
      ${feedback.user?.name ? `<p><strong>User:</strong> ${feedback.user.name}${feedback.user.email ? ` (${feedback.user.email})` : ''}</p>` : ''}
      ${feedback.url ? `<p><strong>Page:</strong> <a href="${feedback.url}">${feedback.url}</a></p>` : ''}
      <h3>Message</h3>
      <p>${feedback.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Feedback ID: ${feedback.id}</small></p>
    `
  };

  console.log('Email notification prepared:', emailData);
  return { success: true };
};

/**
 * Send notification based on provider
 */
export const sendNotification = async (
  feedback: Feedback,
  config: SlackConfig | TeamsConfig | DiscordConfig | NotificationConfig
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Handle different config types
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

    // Handle direct provider configs
    if ('provider' in config) {
      switch (config.provider) {
        case 'slack':
          return sendSlackNotification(feedback, config as SlackConfig);
        case 'teams':
          return sendTeamsNotification(feedback, config as TeamsConfig);
        case 'discord':
          return sendDiscordNotification(feedback, config as DiscordConfig);
        default:
          return { success: false, error: `Unknown notification provider: ${(config as any).provider}` };
      }
    }

    return { success: false, error: 'No valid notification configuration found' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
