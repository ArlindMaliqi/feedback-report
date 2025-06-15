/**
 * Issue tracker integration utilities for creating issues in various platforms
 * 
 * This module provides comprehensive integration with popular issue tracking systems
 * including GitHub, Jira, GitLab, and Azure DevOps. It supports both standard
 * configurations and custom endpoints for maximum flexibility.
 * 
 * @module utils/integrations/issueTracker
 * @version 2.2.0
 * @author ArlindMaliqi
 * @since 1.4.0
 * 
 * @example Basic GitHub integration
 * ```typescript
 * const result = await createGitHubIssue(feedback, {
 *   provider: 'github',
 *   apiToken: 'ghp_xxxxxxxxxxxx',
 *   owner: 'your-org',
 *   repository: 'your-repo',
 *   labels: ['feedback', 'user-reported']
 * });
 * ```
 * 
 * @example Custom issue tracker
 * ```typescript
 * const result = await createIssue(feedback, {
 *   provider: 'custom',
 *   apiEndpoint: 'https://api.yourtracker.com/issues',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * ```
 */
import type { IssueTrackerConfig, Feedback } from '../../types';

/**
 * Standard response interface for all issue creation operations
 * 
 * @interface IssueCreationResult
 * @since 1.4.0
 */
export interface IssueCreationResult {
  /** Whether the issue was created successfully */
  success: boolean;
  /** URL to the created issue (if successful) */
  issueUrl?: string;
  /** Error message (if failed) */
  error?: string;
  /** Additional metadata from the issue tracker */
  metadata?: {
    /** Issue ID from the tracker */
    issueId?: string;
    /** Issue number (for platforms that use numbers) */
    issueNumber?: number;
    /** Issue key (for platforms like Jira) */
    issueKey?: string;
    /** Assignee information */
    assignee?: string;
    /** Labels applied to the issue */
    labels?: string[];
  };
}

/**
 * Configuration interface for GitHub issue creation
 * 
 * @interface GitHubIssueConfig
 * @extends IssueTrackerConfig
 * @since 1.4.0
 */
interface GitHubIssueConfig extends IssueTrackerConfig {
  provider: 'github';
  /** GitHub personal access token with repo permissions */
  apiToken: string;
  /** Repository owner (username or organization) */
  owner: string;
  /** Repository name */
  repository: string;
  /** Optional assignee username */
  assignee?: string;
  /** Labels to apply to the issue */
  labels?: string[];
}

/**
 * Creates a GitHub issue from feedback data
 * 
 * This function creates a comprehensive GitHub issue with properly formatted
 * markdown content, labels, and metadata. It handles rate limiting gracefully
 * and provides detailed error reporting.
 * 
 * @async
 * @function createGitHubIssue
 * @param {Feedback} feedback - The feedback object containing user input
 * @param {IssueTrackerConfig} config - GitHub-specific configuration
 * @returns {Promise<IssueCreationResult>} Result of the issue creation
 * 
 * @throws {Error} When API token, owner, or repository is missing
 * @throws {Error} When GitHub API returns an error response
 * 
 * @example
 * ```typescript
 * const feedback = {
 *   id: 'feedback-123',
 *   message: 'Login button is not working',
 *   type: 'bug',
 *   priority: 'high',
 *   user: { email: 'user@example.com' }
 * };
 * 
 * const config = {
 *   provider: 'github',
 *   apiToken: 'ghp_xxxxxxxxxxxx',
 *   owner: 'acme-corp',
 *   repository: 'main-app',
 *   labels: ['bug', 'user-feedback'],
 *   assignee: 'developer-username'
 * };
 * 
 * const result = await createGitHubIssue(feedback, config);
 * if (result.success) {
 *   console.log(`Issue created: ${result.issueUrl}`);
 * }
 * ```
 * 
 * @since 1.4.0
 */
export const createGitHubIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResult> => {
  if (!config.apiToken || !config.owner || !config.repository) {
    return { 
      success: false, 
      error: 'Missing required GitHub configuration: apiToken, owner, and repository are required' 
    };
  }

  // Generate issue title with type and truncated message
  const issueTitle = `[Feedback] ${feedback.type}: ${feedback.message.substring(0, 100)}${feedback.message.length > 100 ? '...' : ''}`;
  
  // Create comprehensive issue body with markdown formatting
  const issueBody = `
## 📋 Feedback Details

| Field | Value |
|-------|-------|
| **Type** | \`${feedback.type}\` |
| **Category** | ${feedback.category || 'Not specified'} |
| **Subcategory** | ${feedback.subcategory || 'Not specified'} |
| **Priority** | ${feedback.priority || 'Not specified'} |
| **Status** | ${feedback.status} |
| **Feedback ID** | \`${feedback.id}\` |

## 📝 Description

${feedback.message}

## 👤 User Information

${feedback.user?.name ? `**Name:** ${feedback.user.name}\n` : ''}${feedback.user?.email ? `**Email:** ${feedback.user.email}\n` : ''}${!feedback.user?.name && !feedback.user?.email ? '_Anonymous feedback_\n' : ''}

## 🔧 Technical Details

| Field | Value |
|-------|-------|
| **URL** | ${feedback.url || 'Not provided'} |
| **User Agent** | \`${feedback.userAgent || 'Not provided'}\` |
| **Timestamp** | ${feedback.timestamp.toISOString()} |
| **Submission Status** | ${feedback.submissionStatus || 'synced'} |

${feedback.metadata ? `
## 📊 Additional Metadata

\`\`\`json
${JSON.stringify(feedback.metadata, null, 2)}
\`\`\`
` : ''}

${feedback.attachments && feedback.attachments.length > 0 ? `
## 📎 Attachments

${feedback.attachments.map((attachment, index) => 
  `${index + 1}. **${attachment.name}** (${Math.round(attachment.size / 1024)}KB) - ${attachment.type}`
).join('\n')}

_Note: Attachments may need to be uploaded separately due to GitHub API limitations._
` : ''}

---

*This issue was automatically created from user feedback via the React Feedback Widget.*
  `.trim();

  try {
    const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repository}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'React-Feedback-Widget/2.2.0'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: [
          ...(config.labels || []), 
          `type:${feedback.type}`, 
          'feedback',
          feedback.priority ? `priority:${feedback.priority}` : null
        ].filter(Boolean),
        assignees: config.assignee ? [config.assignee] : undefined
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
      
      // Handle specific GitHub API errors
      if (response.status === 401) {
        return { success: false, error: 'Invalid GitHub API token or insufficient permissions' };
      } else if (response.status === 404) {
        return { success: false, error: 'Repository not found or access denied' };
      } else if (response.status === 422) {
        return { success: false, error: `Validation failed: ${errorMessage}` };
      }
      
      return { success: false, error: errorMessage };
    }

    const issue = await response.json();
    return { 
      success: true, 
      issueUrl: issue.html_url,
      metadata: {
        issueId: issue.id.toString(),
        issueNumber: issue.number,
        assignee: issue.assignee?.login,
        labels: issue.labels?.map((label: any) => label.name) || []
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during GitHub issue creation' 
    };
  }
};

/**
 * Creates a Jira issue from feedback data
 * 
 * This function integrates with Jira Cloud or Server instances using the REST API.
 * It creates issues with proper formatting using Atlassian Document Format (ADF)
 * for rich text content.
 * 
 * @async
 * @function createJiraIssue
 * @param {Feedback} feedback - The feedback object containing user input
 * @param {IssueTrackerConfig} config - Jira-specific configuration
 * @returns {Promise<IssueCreationResult>} Result of the issue creation
 * 
 * @throws {Error} When API token, baseUrl, or project is missing
 * @throws {Error} When Jira API returns an error response
 * 
 * @example
 * ```typescript
 * const result = await createJiraIssue(feedback, {
 *   provider: 'jira',
 *   apiToken: 'your-api-token',
 *   baseUrl: 'https://your-domain.atlassian.net',
 *   project: 'PROJ',
 *   labels: ['feedback', 'user-reported']
 * });
 * ```
 * 
 * @since 1.4.0
 */
export const createJiraIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResult> => {
  if (!config.apiToken || !config.baseUrl || !config.project) {
    return { 
      success: false, 
      error: 'Missing required Jira configuration: apiToken, baseUrl, and project are required' 
    };
  }

  // Generate issue summary
  const issueSummary = `[Feedback] ${feedback.type}: ${feedback.message.substring(0, 100)}${feedback.message.length > 100 ? '...' : ''}`;

  // Create issue description using Atlassian Document Format (ADF)
  const issueData = {
    fields: {
      project: { key: config.project },
      summary: issueSummary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '📋 Feedback Details' }]
          },
          {
            type: 'table',
            attrs: { isNumberColumnEnabled: false, layout: 'default' },
            content: [
              {
                type: 'tableRow',
                content: [
                  { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Field', marks: [{ type: 'strong' }] }] }] },
                  { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Value', marks: [{ type: 'strong' }] }] }] }
                ]
              },
              {
                type: 'tableRow',
                content: [
                  { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Type' }] }] },
                  { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: feedback.type, marks: [{ type: 'code' }] }] }] }
                ]
              },
              {
                type: 'tableRow',
                content: [
                  { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Category' }] }] },
                  { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: feedback.category || 'Not specified' }] }] }
                ]
              },
              {
                type: 'tableRow',
                content: [
                  { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Priority' }] }] },
                  { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: feedback.priority || 'Not specified' }] }] }
                ]
              }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '📝 Description' }]
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: feedback.message }]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '🔧 Technical Information' }]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: `URL: ${feedback.url || 'Not provided'}`, marks: [{ type: 'strong' }] }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: `Timestamp: ${feedback.timestamp.toISOString()}`, marks: [{ type: 'strong' }] }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: `Feedback ID: ${feedback.id}`, marks: [{ type: 'code' }] }] }]
              }
            ]
          }
        ]
      },
      issuetype: { name: 'Task' },
      priority: { 
        name: feedback.priority === 'critical' ? 'Highest' : 
              feedback.priority === 'high' ? 'High' : 
              feedback.priority === 'low' ? 'Low' : 'Medium' 
      },
      labels: [
        ...(config.labels || []), 
        'feedback', 
        feedback.type,
        feedback.priority ? `priority-${feedback.priority}` : null
      ].filter(Boolean)
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
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.errorMessages?.[0] || 
                          errorData.errors ? Object.values(errorData.errors)[0] : 
                          `HTTP ${response.status}: ${response.statusText}`;
      
      // Handle specific Jira API errors
      if (response.status === 401) {
        return { success: false, error: 'Invalid Jira API token or insufficient permissions' };
      } else if (response.status === 404) {
        return { success: false, error: 'Jira project not found or access denied' };
      } else if (response.status === 400) {
        return { success: false, error: `Invalid request: ${errorMessage}` };
      }
      
      return { success: false, error: errorMessage as string };
    }

    const issue = await response.json();
    return { 
      success: true, 
      issueUrl: `${config.baseUrl}/browse/${issue.key}`,
      metadata: {
        issueId: issue.id,
        issueKey: issue.key,
        labels: issue.fields?.labels?.map((label: any) => label.name) || []
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during Jira issue creation' 
    };
  }
};

/**
 * Creates an Azure DevOps work item from feedback data
 * 
 * This function integrates with Azure DevOps Services or Server using the REST API.
 * It creates work items using JSON Patch operations for maximum compatibility.
 * 
 * @async
 * @function createAzureDevOpsIssue
 * @param {Feedback} feedback - The feedback object containing user input
 * @param {IssueTrackerConfig} config - Azure DevOps-specific configuration
 * @returns {Promise<IssueCreationResult>} Result of the work item creation
 * 
 * @example
 * ```typescript
 * const result = await createAzureDevOpsIssue(feedback, {
 *   provider: 'azure-devops',
 *   apiToken: 'your-pat-token',
 *   baseUrl: 'https://dev.azure.com/your-org',
 *   project: 'your-project'
 * });
 * ```
 * 
 * @since 1.4.0
 */
export const createAzureDevOpsIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResult> => {
  if (!config.apiToken || !config.baseUrl || !config.project) {
    return { 
      success: false, 
      error: 'Missing required Azure DevOps configuration: apiToken, baseUrl, and project are required' 
    };
  }

  const workItemTitle = `[Feedback] ${feedback.type}: ${feedback.message.substring(0, 100)}${feedback.message.length > 100 ? '...' : ''}`;

  // Create work item description with HTML formatting
  const descriptionHtml = `
    <h2>📋 Feedback Details</h2>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr><th>Field</th><th>Value</th></tr>
      <tr><td><strong>Type</strong></td><td><code>${feedback.type}</code></td></tr>
      <tr><td><strong>Category</strong></td><td>${feedback.category || 'Not specified'}</td></tr>
      <tr><td><strong>Priority</strong></td><td>${feedback.priority || 'Not specified'}</td></tr>
      <tr><td><strong>Status</strong></td><td>${feedback.status}</td></tr>
    </table>
    
    <h2>📝 Description</h2>
    <p>${feedback.message.replace(/\n/g, '<br>')}</p>
    
    <h2>👤 User Information</h2>
    ${feedback.user?.name ? `<p><strong>Name:</strong> ${feedback.user.name}</p>` : ''}
    ${feedback.user?.email ? `<p><strong>Email:</strong> ${feedback.user.email}</p>` : ''}
    ${!feedback.user?.name && !feedback.user?.email ? '<p><em>Anonymous feedback</em></p>' : ''}
    
    <h2>🔧 Technical Details</h2>
    <ul>
      <li><strong>URL:</strong> ${feedback.url || 'Not provided'}</li>
      <li><strong>User Agent:</strong> <code>${feedback.userAgent || 'Not provided'}</code></li>
      <li><strong>Timestamp:</strong> ${feedback.timestamp.toISOString()}</li>
      <li><strong>Feedback ID:</strong> <code>${feedback.id}</code></li>
    </ul>
    
    ${feedback.attachments && feedback.attachments.length > 0 ? `
    <h2>📎 Attachments</h2>
    <ul>
      ${feedback.attachments.map(attachment => 
        `<li><strong>${attachment.name}</strong> (${Math.round(attachment.size / 1024)}KB) - ${attachment.type}</li>`
      ).join('')}
    </ul>
    ` : ''}
  `.trim();

  // Create JSON Patch operations for work item creation
  const workItemData = [
    {
      op: 'add',
      path: '/fields/System.Title',
      value: workItemTitle
    },
    {
      op: 'add',
      path: '/fields/System.Description',
      value: descriptionHtml
    },
    {
      op: 'add',
      path: '/fields/System.Tags',
      value: [
        ...(config.labels || []), 
        'feedback', 
        feedback.type,
        feedback.priority ? `priority-${feedback.priority}` : null
      ].filter(Boolean).join(';')
    }
  ];

  try {
    const response = await fetch(
      `${config.baseUrl}/${config.project}/_apis/wit/workitems/$Bug?api-version=7.0`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`:${config.apiToken}`)}`,
          'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify(workItemData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 
                          errorData.value?.message || 
                          `HTTP ${response.status}: ${response.statusText}`;
      
      // Handle specific Azure DevOps API errors
      if (response.status === 401) {
        return { success: false, error: 'Invalid Azure DevOps personal access token' };
      } else if (response.status === 404) {
        return { success: false, error: 'Azure DevOps project not found or access denied' };
      } else if (response.status === 400) {
        return { success: false, error: `Invalid request: ${errorMessage}` };
      }
      
      return { success: false, error: errorMessage };
    }

    const workItem = await response.json();
    return { 
      success: true, 
      issueUrl: workItem._links.html.href,
      metadata: {
        issueId: workItem.id.toString(),
        issueNumber: workItem.id,
        labels: workItem.fields['System.Tags']?.split(';').filter(Boolean) || []
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during Azure DevOps work item creation' 
    };
  }
};

/**
 * Creates a GitLab issue from feedback data
 * 
 * This function integrates with GitLab.com or self-hosted GitLab instances
 * using the REST API v4. It supports both project ID and project path formats.
 * 
 * @async
 * @function createGitLabIssue
 * @param {Feedback} feedback - The feedback object containing user input
 * @param {IssueTrackerConfig} config - GitLab-specific configuration
 * @returns {Promise<IssueCreationResult>} Result of the issue creation
 * 
 * @example
 * ```typescript
 * const result = await createGitLabIssue(feedback, {
 *   provider: 'gitlab',
 *   apiToken: 'glpat-xxxxxxxxxxxx',
 *   baseUrl: 'https://gitlab.com',
 *   project: 'group/project-name' // or project ID number
 * });
 * ```
 * 
 * @since 1.4.0
 */
export const createGitLabIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResult> => {
  if (!config.apiToken || !config.baseUrl || !config.project) {
    return { 
      success: false, 
      error: 'Missing required GitLab configuration: apiToken, baseUrl, and project are required' 
    };
  }

  const issueTitle = `[Feedback] ${feedback.type}: ${feedback.message.substring(0, 100)}${feedback.message.length > 100 ? '...' : ''}`;

  // Create issue description with GitLab-flavored markdown
  const issueDescription = `
## 📋 Feedback Details

| Field | Value |
|-------|-------|
| **Type** | \`${feedback.type}\` |
| **Category** | ${feedback.category || 'Not specified'} |
| **Subcategory** | ${feedback.subcategory || 'Not specified'} |
| **Priority** | ${feedback.priority || 'Not specified'} |
| **Status** | ${feedback.status} |
| **Feedback ID** | \`${feedback.id}\` |

## 📝 Description

${feedback.message}

## 👤 User Information

${feedback.user?.name ? `**Name:** ${feedback.user.name}\n` : ''}${feedback.user?.email ? `**Email:** ${feedback.user.email}\n` : ''}${!feedback.user?.name && !feedback.user?.email ? '_Anonymous feedback_\n' : ''}

## 🔧 Technical Details

- **URL:** ${feedback.url || 'Not provided'}
- **User Agent:** \`${feedback.userAgent || 'Not provided'}\`
- **Timestamp:** ${feedback.timestamp.toISOString()}
- **Submission Status:** ${feedback.submissionStatus || 'synced'}

${feedback.metadata ? `
## 📊 Additional Metadata

\`\`\`json
${JSON.stringify(feedback.metadata, null, 2)}
\`\`\`
` : ''}

${feedback.attachments && feedback.attachments.length > 0 ? `
## 📎 Attachments

${feedback.attachments.map((attachment, index) => 
  `${index + 1}. **${attachment.name}** (${Math.round(attachment.size / 1024)}KB) - ${attachment.type}`
).join('\n')}
` : ''}

---

*This issue was automatically created from user feedback via the React Feedback Widget.*
  `.trim();

  const issueData = {
    title: issueTitle,
    description: issueDescription,
    labels: [
      ...(config.labels || []), 
      'feedback', 
      feedback.type,
      feedback.priority ? `priority::${feedback.priority}` : null
    ].filter(Boolean).join(','),
    assignee_ids: config.assignee ? [config.assignee] : undefined
  };

  try {
    // Encode project path for URL if it contains special characters
    const encodedProject = encodeURIComponent(config.project);
    
    const response = await fetch(`${config.baseUrl}/api/v4/projects/${encodedProject}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 
                          (Array.isArray(errorData.error) ? errorData.error.join(', ') : errorData.error) ||
                          `HTTP ${response.status}: ${response.statusText}`;
      
      // Handle specific GitLab API errors
      if (response.status === 401) {
        return { success: false, error: 'Invalid GitLab API token or insufficient permissions' };
      } else if (response.status === 404) {
        return { success: false, error: 'GitLab project not found or access denied' };
      } else if (response.status === 400) {
        return { success: false, error: `Invalid request: ${errorMessage}` };
      }
      
      return { success: false, error: errorMessage };
    }

    const issue = await response.json();
    return { 
      success: true, 
      issueUrl: issue.web_url,
      metadata: {
        issueId: issue.id.toString(),
        issueNumber: issue.iid,
        assignee: issue.assignee?.username,
        labels: issue.labels || []
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during GitLab issue creation' 
    };
  }
};

/**
 * Main issue creation function that routes to the appropriate provider
 * 
 * This is the primary entry point for issue creation. It automatically
 * selects the correct provider implementation based on the configuration
 * and handles provider-specific logic.
 * 
 * @async
 * @function createIssue
 * @param {Feedback} feedback - The feedback object containing user input
 * @param {IssueTrackerConfig} config - Provider-specific configuration
 * @returns {Promise<IssueCreationResult>} Result of the issue creation
 * 
 * @throws {Error} When an unsupported provider is specified
 * @throws {Error} When required configuration is missing for the provider
 * 
 * @example
 * ```typescript
 * // GitHub issue
 * const githubResult = await createIssue(feedback, {
 *   provider: 'github',
 *   apiToken: 'token',
 *   owner: 'owner',
 *   repository: 'repo'
 * });
 * 
 * // Custom endpoint
 * const customResult = await createIssue(feedback, {
 *   provider: 'custom',
 *   apiEndpoint: 'https://api.custom.com/issues',
 *   headers: { 'Authorization': 'Bearer token' }
 * });
 * ```
 * 
 * @since 1.4.0
 */
export const createIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResult> => {
  // Validate feedback object
  if (!feedback || !feedback.id || !feedback.message) {
    return { 
      success: false, 
      error: 'Invalid feedback object: id and message are required' 
    };
  }

  // Route to appropriate provider
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
      return createCustomIssue(feedback, config);
      
    default:
      return { 
        success: false, 
        error: `Unsupported issue tracker provider: ${config.provider}. Supported providers: github, jira, azure-devops, gitlab, custom` 
      };
  }
};

/**
 * Creates an issue using a custom endpoint
 * 
 * This function provides integration with custom issue tracking systems
 * by making HTTP requests to user-defined endpoints. It supports flexible
 * header configuration and custom payload formatting.
 * 
 * @async
 * @function createCustomIssue
 * @param {Feedback} feedback - The feedback object containing user input
 * @param {IssueTrackerConfig} config - Custom endpoint configuration
 * @returns {Promise<IssueCreationResult>} Result of the issue creation
 * 
 * @example
 * ```typescript
 * const result = await createCustomIssue(feedback, {
 *   provider: 'custom',
 *   apiEndpoint: 'https://api.yourtracker.com/v1/issues',
 *   headers: {
 *     'Authorization': 'Bearer your-token',
 *     'X-API-Version': '1.0'
 *   }
 * });
 * ```
 * 
 * @since 1.4.0
 */
async function createCustomIssue(
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResult> {
  if (!config.apiEndpoint) {
    return { 
      success: false, 
      error: 'Custom issue tracker requires apiEndpoint configuration' 
    };
  }

  try {
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify({ 
        feedback, 
        config: {
          labels: config.labels,
          assignee: config.assignee,
          project: config.project
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return { 
        success: false, 
        error: `Custom endpoint error: HTTP ${response.status} - ${errorData}` 
      };
    }

    const result = await response.json();
    return { 
      success: true, 
      issueUrl: result.issueUrl || result.url,
      metadata: {
        issueId: result.id || result.issueId,
        issueNumber: result.number || result.issueNumber,
        ...result.metadata
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during custom issue creation' 
    };
  }
}
