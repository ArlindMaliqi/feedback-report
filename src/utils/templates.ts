import type { TemplateConfig } from '../types';

/**
 * Default feedback template
 */
export const defaultTemplate: TemplateConfig = {
  id: 'default',
  title: 'Send Feedback',
  description: 'We value your feedback to improve our product.',
  fields: [
    {
      id: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'improvement', label: 'Improvement' },
        { value: 'other', label: 'Other' }
      ],
      defaultValue: 'other'
    },
    {
      id: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Please describe your feedback...',
      helpText: 'Please be as specific as possible.'
    }
  ]
};

/**
 * Bug report template with structured fields
 */
export const bugReportTemplate: TemplateConfig = {
  id: 'bug-report',
  title: 'Report a Bug',
  description: 'Help us squash bugs by providing detailed information.',
  fields: [
    {
      id: 'title',
      label: 'Bug Title',
      type: 'text',
      required: true,
      placeholder: 'Short description of the issue',
      helpText: 'Provide a concise title for this bug.'
    },
    {
      id: 'steps',
      label: 'Steps to Reproduce',
      type: 'textarea',
      required: true,
      placeholder: '1. Click on...\n2. Navigate to...\n3. Observe that...',
      helpText: 'List the exact steps needed to reproduce the issue.'
    },
    {
      id: 'expected',
      label: 'Expected Behavior',
      type: 'textarea',
      required: true,
      placeholder: 'What should have happened?',
      helpText: 'Describe what you expected to happen.'
    },
    {
      id: 'actual',
      label: 'Actual Behavior',
      type: 'textarea',
      required: true,
      placeholder: 'What actually happened?',
      helpText: 'Describe what actually happened instead.'
    },
    {
      id: 'severity',
      label: 'Severity',
      type: 'select',
      required: true,
      options: [
        { value: 'critical', label: 'Critical - Application crashes or data loss' },
        { value: 'high', label: 'High - Major functionality broken' },
        { value: 'medium', label: 'Medium - Feature partially working' },
        { value: 'low', label: 'Low - Minor or cosmetic issue' }
      ],
      defaultValue: 'medium'
    },
    {
      id: 'additional',
      label: 'Additional Information',
      type: 'textarea',
      required: false,
      placeholder: 'Any other details that might help us fix the issue',
      helpText: 'Browser version, device type, screenshots, etc.'
    }
  ]
};

/**
 * Feature request template
 */
export const featureRequestTemplate: TemplateConfig = {
  id: 'feature-request',
  title: 'Request a Feature',
  description: 'Share your ideas to help us improve the product.',
  fields: [
    {
      id: 'title',
      label: 'Feature Title',
      type: 'text',
      required: true,
      placeholder: 'Short description of the feature',
      helpText: 'Provide a concise title for this feature request.'
    },
    {
      id: 'problem',
      label: 'Problem Statement',
      type: 'textarea',
      required: true,
      placeholder: 'What problem would this feature solve?',
      helpText: 'Describe the problem or pain point that this feature would address.'
    },
    {
      id: 'solution',
      label: 'Proposed Solution',
      type: 'textarea',
      required: true,
      placeholder: 'How would this feature work?',
      helpText: 'Describe your idea for implementing this feature.'
    },
    {
      id: 'alternatives',
      label: 'Alternatives Considered',
      type: 'textarea',
      required: false,
      placeholder: 'Any alternatives or workarounds you\'ve tried?',
      helpText: 'Describe any alternative solutions or features you\'ve considered.'
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'select',
      required: true,
      options: [
        { value: 'high', label: 'High - Critical for my workflow' },
        { value: 'medium', label: 'Medium - Would significantly improve experience' },
        { value: 'low', label: 'Low - Nice to have' }
      ],
      defaultValue: 'medium'
    }
  ]
};

/**
 * General feedback template
 */
export const generalTemplate: TemplateConfig = {
  id: 'general',
  title: 'General Feedback',
  description: 'Share your thoughts, ideas, or suggestions.',
  fields: [
    {
      id: 'rating',
      label: 'Overall Rating',
      type: 'select',
      required: true,
      options: [
        { value: '5', label: '5 - Excellent' },
        { value: '4', label: '4 - Good' },
        { value: '3', label: '3 - Average' },
        { value: '2', label: '2 - Below Average' },
        { value: '1', label: '1 - Poor' }
      ],
      defaultValue: '5'
    },
    {
      id: 'message',
      label: 'Your Feedback',
      type: 'textarea',
      required: true,
      placeholder: 'Please share your thoughts...',
      helpText: 'What do you like or dislike? Any suggestions for improvement?'
    },
    {
      id: 'contact',
      label: 'Contact Email (Optional)',
      type: 'text',
      required: false,
      placeholder: 'your.email@example.com',
      helpText: 'If you\'d like us to follow up with you, please provide your email.'
    }
  ]
};

/**
 * Gets a template by ID
 */
export const getTemplateById = (id: string): TemplateConfig => {
  switch (id) {
    case 'bug-report':
      return bugReportTemplate;
    case 'feature-request':
      return featureRequestTemplate;
    case 'general':
      return generalTemplate;
    case 'default':
    default:
      return defaultTemplate;
  }
};

/**
 * Gets all available templates
 */
export const getAllTemplates = (): TemplateConfig[] => [
  defaultTemplate,
  bugReportTemplate,
  featureRequestTemplate,
  generalTemplate
];
