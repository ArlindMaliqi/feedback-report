/**
 * Issue tracker integration utilities
 * @module issueTracker
 */
import type { IssueTrackerConfig, Feedback } from '../../types';

/**
 * GitHub issue creation
 */
export const createGitHubIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<{ success: boolean; issueUrl?: string; error?: string }> => {
  if (!config.apiToken || !config.owner || !config.repository) {
    return { success: false, error: 'Missing GitHub configuration' };
  }

  const issueTitle = `[Feedback] ${feedback.type}: ${feedback.message.substring(0, 100)}${feedback.message.length > 100 ? '...' : ''}`;
  
  const issueBody = `
## Feedback Details

**Type:** ${feedback.type}
**Category:** ${feedback.category || 'Not specified'}
**Subcategory:** ${feedback.subcategory || 'Not specified'}
**Priority:** ${feedback.priority || 'Not specified'}

## Description

${feedback.message}

## User Information

${feedback.user?.name ? `**Name:** ${feedback.user.name}` : ''}
${feedback.user?.email ? `**Email:** ${feedback.user.email}` : ''}

## Technical Details

**URL:** ${feedback.url || 'Not provided'}
**User Agent:** ${feedback.userAgent || 'Not provided'}
**Timestamp:** ${feedback.timestamp.toISOString()}
**Feedback ID:** ${feedback.id}

${feedback.attachments && feedback.attachments.length > 0 ? `\n## Attachments\n\n${feedback.attachments.length} file(s) attached` : ''}
  `.trim();

  try {
    const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repository}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: [...(config.labels || []), `type:${feedback.type}`, 'feedback']
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || `HTTP ${response.status}` };
    }

    const issue = await response.json();
    return { success: true, issueUrl: issue.html_url };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Jira issue creation
 */
export const createJiraIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<{ success: boolean; issueUrl?: string; error?: string }> => {
  if (!config.apiToken || !config.baseUrl || !config.project) {
    return { success: false, error: 'Missing Jira configuration' };
  }

  const issueData = {
    fields: {
      project: { key: config.project },
      summary: `[Feedback] ${feedback.type}: ${feedback.message.substring(0, 100)}${feedback.message.length > 100 ? '...' : ''}`,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Feedback Details' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: `Type: ${feedback.type}`, marks: [{ type: 'strong' }] },
              { type: 'hardBreak' },
              { type: 'text', text: `Category: ${feedback.category || 'Not specified'}`, marks: [{ type: 'strong' }] },
              { type: 'hardBreak' },
              { type: 'text', text: `Priority: ${feedback.priority || 'Not specified'}`, marks: [{ type: 'strong' }] }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Description' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: feedback.message }]
          }
        ]
      },
      issuetype: { name: 'Task' },
      priority: { name: feedback.priority === 'critical' ? 'Highest' : feedback.priority === 'high' ? 'High' : 'Medium' },
      labels: [...(config.labels || []), 'feedback', feedback.type]
    }
  };

  try {
    const response = await fetch(`${config.baseUrl}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.errorMessages?.[0] || `HTTP ${response.status}` };
    }

    const issue = await response.json();
    return { success: true, issueUrl: `${config.baseUrl}/browse/${issue.key}` };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Azure DevOps work item creation
 */
export const createAzureDevOpsIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<{ success: boolean; issueUrl?: string; error?: string }> => {
  if (!config.apiToken || !config.baseUrl || !config.project) {
    return { success: false, error: 'Missing Azure DevOps configuration' };
  }

  const workItemData = [
    {
      op: 'add',
      path: '/fields/System.Title',
      value: `[Feedback] ${feedback.type}: ${feedback.message.substring(0, 100)}${feedback.message.length > 100 ? '...' : ''}`
    },
    {
      op: 'add',
      path: '/fields/System.Description',
      value: `<h2>Feedback Details</h2>
        <p><strong>Type:</strong> ${feedback.type}</p>
        <p><strong>Category:</strong> ${feedback.category || 'Not specified'}</p>
        <p><strong>Priority:</strong> ${feedback.priority || 'Not specified'}</p>
        <h2>Description</h2>
        <p>${feedback.message.replace(/\n/g, '<br>')}</p>
        <h2>Technical Details</h2>
        <p><strong>URL:</strong> ${feedback.url || 'Not provided'}</p>
        <p><strong>Timestamp:</strong> ${feedback.timestamp.toISOString()}</p>
        <p><strong>Feedback ID:</strong> ${feedback.id}</p>`
    },
    {
      op: 'add',
      path: '/fields/System.Tags',
      value: [...(config.labels || []), 'feedback', feedback.type].join(';')
    }
  ];

  try {
    const response = await fetch(`${config.baseUrl}/${config.project}/_apis/wit/workitems/$Bug?api-version=7.0`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`:${config.apiToken}`)}`,
        'Content-Type': 'application/json-patch+json'
      },
      body: JSON.stringify(workItemData)
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || `HTTP ${response.status}` };
    }

    const workItem = await response.json();
    return { success: true, issueUrl: workItem._links.html.href };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * GitLab issue creation
 */
export const createGitLabIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<{ success: boolean; issueUrl?: string; error?: string }> => {
  if (!config.apiToken || !config.baseUrl || !config.project) {
    return { success: false, error: 'Missing GitLab configuration' };
  }

  const issueData = {
    title: `[Feedback] ${feedback.type}: ${feedback.message.substring(0, 100)}${feedback.message.length > 100 ? '...' : ''}`,
    description: `## Feedback Details

**Type:** ${feedback.type}
**Category:** ${feedback.category || 'Not specified'}
**Priority:** ${feedback.priority || 'Not specified'}

## Description

${feedback.message}

## Technical Details

**URL:** ${feedback.url || 'Not provided'}
**Timestamp:** ${feedback.timestamp.toISOString()}
**Feedback ID:** ${feedback.id}`,
    labels: [...(config.labels || []), 'feedback', feedback.type].join(',')
  };

  try {
    const response = await fetch(`${config.baseUrl}/api/v4/projects/${config.project}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || `HTTP ${response.status}` };
    }

    const issue = await response.json();
    return { success: true, issueUrl: issue.web_url };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Main issue creation function
 */
export const createIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<{ success: boolean; issueUrl?: string; error?: string }> => {
  switch (config.provider) {
    case 'github':
      return createGitHubIssue(feedback, config);
    case 'jira':
      return createJiraIssue(feedback, config);
    case 'azure-devops':
      return createAzureDevOpsIssue(feedback, config);
    case 'gitlab':
      return createGitLabIssue(feedback, config);
    case 'custom':
      // Custom endpoint for issue creation
      if (config.apiEndpoint) {
        try {
          const response = await fetch(config.apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...config.headers
            },
            body: JSON.stringify({ feedback, config })
          });

          if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}` };
          }

          const result = await response.json();
          return { success: true, issueUrl: result.issueUrl };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }
      return { success: false, error: 'Custom endpoint not configured' };
    default:
      return { success: false, error: `Unknown provider: ${config.provider}` };
  }
};
