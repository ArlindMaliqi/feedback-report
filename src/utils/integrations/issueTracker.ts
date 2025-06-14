/**
 * Issue tracker integration utilities for creating issues from feedback
 * @module issueTracker
 */
import type { 
  IssueTrackerConfig, 
  Feedback, 
  IssueCreationResponse,
  FeedbackAttachment,
  AnyIssueTrackerConfig
} from '../../types';
import { showError, showSuccess } from '../notifications';

/**
 * Creates an issue in GitHub using the GitHub API
 * 
 * @param feedback - The feedback to create an issue for
 * @param config - GitHub issue tracker configuration
 * @returns Promise resolving to issue creation response
 */
const createGitHubIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResponse> => {
  if (!config.owner || !config.repository) {
    return {
      success: false,
      error: 'GitHub owner and repository must be specified'
    };
  }
  
  try {
    // Prepare the GitHub API endpoint
    const apiUrl = config.apiEndpoint || 'https://api.github.com';
    const endpoint = `${apiUrl}/repos/${config.owner}/${config.repository}/issues`;
    
    // Prepare the issue data
    const issueTitle = formatIssueTitle(feedback, config);
    const issueBody = formatIssueBody(feedback, config);
    
    // Map feedback labels to GitHub labels
    let labels = config.labels || [];
    if (feedback.type) {
      labels.push(feedback.type);
    }
    
    // Create the issue
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `token ${config.apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: labels
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `GitHub API error: ${errorData.message || response.statusText}`
      };
    }
    
    const issueData = await response.json();
    
    return {
      success: true,
      issueId: issueData.number.toString(),
      issueUrl: issueData.html_url
    };
  } catch (error) {
    return {
      success: false,
      error: `Error creating GitHub issue: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Creates an issue in Jira using the Jira API
 * 
 * @param feedback - The feedback to create an issue for
 * @param config - Jira issue tracker configuration
 * @returns Promise resolving to issue creation response
 */
const createJiraIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResponse> => {
  if (!config.repository) {
    return {
      success: false,
      error: 'Jira project key must be specified in the repository field'
    };
  }
  
  try {
    // Prepare issue data
    const issueTitle = formatIssueTitle(feedback, config);
    const issueBody = formatIssueBody(feedback, config);
    
    // Default issue type if not specified
    const issueType = config.issueType || 'Task';
    
    // Create the issue
    const response = await fetch(`${config.apiEndpoint}/rest/api/2/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(config.apiToken)}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          project: {
            key: config.repository
          },
          summary: issueTitle,
          description: issueBody,
          issuetype: {
            name: issueType
          },
          labels: config.labels || []
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `Jira API error: ${errorData.message || response.statusText}`
      };
    }
    
    const issueData = await response.json();
    
    return {
      success: true,
      issueId: issueData.key,
      issueUrl: `${config.apiEndpoint}/browse/${issueData.key}`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error creating Jira issue: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Creates an issue in GitLab using the GitLab API
 * 
 * @param feedback - The feedback to create an issue for
 * @param config - GitLab issue tracker configuration
 * @returns Promise resolving to issue creation response
 */
const createGitLabIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResponse> => {
  if (!config.projectId) {
    return {
      success: false,
      error: 'GitLab project ID must be specified'
    };
  }
  
  try {
    // Prepare issue data
    const issueTitle = formatIssueTitle(feedback, config);
    const issueBody = formatIssueBody(feedback, config);
    
    // Create the issue
    const response = await fetch(`${config.apiEndpoint}/api/v4/projects/${config.projectId}/issues`, {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN': config.apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: issueTitle,
        description: issueBody,
        labels: config.labels?.join(',') || ''
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `GitLab API error: ${errorData.message || response.statusText}`
      };
    }
    
    const issueData = await response.json();
    
    return {
      success: true,
      issueId: issueData.iid.toString(),
      issueUrl: issueData.web_url
    };
  } catch (error) {
    return {
      success: false,
      error: `Error creating GitLab issue: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Creates an issue in Azure DevOps using the Azure DevOps API
 * 
 * @param feedback - The feedback to create an issue for
 * @param config - Azure DevOps issue tracker configuration
 * @returns Promise resolving to issue creation response
 */
const createAzureDevOpsIssue = async (
  feedback: Feedback,
  config: IssueTrackerConfig
): Promise<IssueCreationResponse> => {
  if (!config.owner || !config.repository) {
    return {
      success: false,
      error: 'Azure DevOps organization and project must be specified'
    };
  }
  
  try {
    // Prepare issue data
    const issueTitle = formatIssueTitle(feedback, config);
    const issueBody = formatIssueBody(feedback, config);
    
    // Default work item type if not specified
    const workItemType = config.issueType || 'Bug';
    
    // Create the work item
    const response = await fetch(
      `${config.apiEndpoint}/${config.owner}/${config.repository}/_apis/wit/workitems/$${workItemType}?api-version=6.0`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`:${config.apiToken}`)}`,
          'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify([
          {
            op: 'add',
            path: '/fields/System.Title',
            value: issueTitle
          },
          {
            op: 'add',
            path: '/fields/System.Description',
            value: issueBody
          }
        ])
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: `Azure DevOps API error: ${errorData.message || response.statusText}`
      };
    }
    
    const issueData = await response.json();
    
    return {
      success: true,
      issueId: issueData.id.toString(),
      issueUrl: `${config.apiEndpoint}/${config.owner}/${config.repository}/_workitems/edit/${issueData.id}`
    };
  } catch (error) {
    return {
      success: false,
      error: `Error creating Azure DevOps work item: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Formats the issue title based on feedback and configuration
 * 
 * @param feedback - The feedback to create an issue for
 * @param config - Issue tracker configuration
 * @returns Formatted issue title
 */
const formatIssueTitle = (feedback: Feedback, config: IssueTrackerConfig): string => {
  if (config.titleTemplate) {
    return replacePlaceholders(config.titleTemplate, feedback);
  }
  
  // Default title format
  const prefix = feedback.type ? `[${feedback.type.toUpperCase()}]` : '';
  const category = feedback.category ? `${feedback.category}` : '';
  const subcategory = feedback.subcategory ? ` - ${feedback.subcategory}` : '';
  
  // Use the first line of feedback as the title, truncated if needed
  let title = feedback.message.split('\n')[0];
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }
  
  return `${prefix}${category}${subcategory}: ${title}`;
};

/**
 * Formats the issue body based on feedback and configuration
 * 
 * @param feedback - The feedback to create an issue for
 * @param config - Issue tracker configuration
 * @returns Formatted issue body
 */
const formatIssueBody = (feedback: Feedback, config: IssueTrackerConfig): string => {
  if (config.bodyTemplate) {
    return replacePlaceholders(config.bodyTemplate, feedback);
  }
  
  // Default body format
  let body = `## Feedback Details\n\n${feedback.message}\n\n`;
  
  // Add metadata
  body += `## Metadata\n\n`;
  body += `- **Type**: ${feedback.type || 'Not specified'}\n`;
  
  if (feedback.category) {
    body += `- **Category**: ${feedback.category}`;
    if (feedback.subcategory) {
      body += ` / ${feedback.subcategory}`;
    }
    body += `\n`;
  }
  
  body += `- **Submitted**: ${new Date(feedback.timestamp).toISOString()}\n`;
  
  if (feedback.url) {
    body += `- **URL**: ${feedback.url}\n`;
  }
  
  if (feedback.user?.name || feedback.user?.email) {
    body += `\n## User\n\n`;
    if (feedback.user.name) {
      body += `- **Name**: ${feedback.user.name}\n`;
    }
    if (feedback.user.email) {
      body += `- **Email**: ${feedback.user.email}\n`;
    }
  }
  
  // Add browser info if available
  if (feedback.userAgent) {
    body += `\n## Browser Information\n\n\`\`\`\n${feedback.userAgent}\n\`\`\`\n`;
  }
  
  // Add attachments info if available
  if (feedback.attachments && feedback.attachments.length > 0) {
    body += `\n## Attachments\n\n`;
    body += `${feedback.attachments.length} attachment(s) were included in the feedback but are not automatically uploaded to this issue.\n`;
  }
  
  return body;
};

/**
 * Replaces placeholders in a template string with feedback values
 * 
 * @param template - Template string with placeholders
 * @param feedback - Feedback object with values to replace placeholders
 * @returns Template string with placeholders replaced
 */
const replacePlaceholders = (template: string, feedback: Feedback): string => {
  return template
    .replace(/\{id\}/g, feedback.id)
    .replace(/\{message\}/g, feedback.message)
    .replace(/\{type\}/g, feedback.type || '')
    .replace(/\{category\}/g, feedback.category || '')
    .replace(/\{subcategory\}/g, feedback.subcategory || '')
    .replace(/\{timestamp\}/g, new Date(feedback.timestamp).toISOString())
    .replace(/\{url\}/g, feedback.url || '')
    .replace(/\{userName\}/g, feedback.user?.name || '')
    .replace(/\{userEmail\}/g, feedback.user?.email || '')
    .replace(/\{userAgent\}/g, feedback.userAgent || '');
};

/**
 * Creates an issue in the configured issue tracker from feedback
 * 
 * @param feedback - The feedback to create an issue for
 * @param config - Issue tracker configuration
 * @returns Promise resolving to issue creation response
 */
export const createIssueFromFeedback = async (
  feedback: Feedback,
  config: AnyIssueTrackerConfig
): Promise<IssueCreationResponse> => {
  if (!config) {
    return {
      success: false,
      error: 'Issue tracker configuration is missing'
    };
  }
  
  try {
    // Use custom issue creation function if provided
    if (typeof config.createIssue === 'function') {
      try {
        const issueId = await config.createIssue(feedback);
        return {
          success: true,
          issueId,
          issueUrl: ''
        };
      } catch (error) {
        return {
          success: false,
          error: `Custom issue creation failed: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    }
    
    // Transform feedback data if a transform function is provided
    let transformedFeedback = feedback;
    if (typeof config.transformData === 'function') {
      const transformedData = config.transformData(feedback);
      transformedFeedback = { ...feedback, ...transformedData };
    }
    
    // Create issue based on the configured provider
    switch (config.provider) {
      case 'github':
        // For GitHub, we need the required properties
        if (!config.apiToken) {
          return {
            success: false,
            error: 'GitHub API token is required'
          };
        }
        return createGitHubIssue(transformedFeedback, config as IssueTrackerConfig);
        
      case 'jira':
        // For Jira, we need the required properties
        if (!config.apiToken) {
          return {
            success: false,
            error: 'Jira API token is required'
          };
        }
        return createJiraIssue(transformedFeedback, config as IssueTrackerConfig);
        
      case 'gitlab':
        // For GitLab, we need the required properties
        if (!config.apiToken) {
          return {
            success: false,
            error: 'GitLab API token is required'
          };
        }
        return createGitLabIssue(transformedFeedback, config as IssueTrackerConfig);
        
      case 'azure-devops':
        // For Azure DevOps, we need the required properties
        if (!config.apiToken) {
          return {
            success: false,
            error: 'Azure DevOps API token is required'
          };
        }
        return createAzureDevOpsIssue(transformedFeedback, config as IssueTrackerConfig);
        
      case 'custom':
        return {
          success: false,
          error: 'Custom provider requires a createIssue function to be specified'
        };
        
      default:
        // Fix the TypeScript error by properly typing the default case
        const exhaustiveCheck: never = config;
        return {
          success: false,
          error: `Unsupported issue tracker provider: ${(config as any).provider}`
        };
    }
  } catch (error) {
    return {
      success: false,
      error: `Error creating issue: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
