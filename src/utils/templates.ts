import type { TemplateConfig } from '../types';

/**
 * Default feedback template
 */
export const DEFAULT_TEMPLATE: TemplateConfig = {
  id: 'default',
  name: 'Default Feedback',
  description: 'A simple feedback form for general comments',
  fields: [
    {
      id: 'message',
      type: 'textarea',
      label: 'Your Feedback',
      placeholder: 'Please describe your feedback...',
      required: true,
      helpText: 'Please be as specific as possible.'
    },
    {
      id: 'type',
      type: 'select',
      label: 'Feedback Type',
      required: true,
      options: [
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'improvement', label: 'Improvement' },
        { value: 'other', label: 'Other' }
      ]
    }
  ]
};

/**
 * Bug report template with structured fields
 */
export const BUG_REPORT_TEMPLATE: TemplateConfig = {
  id: 'bug-report',
  name: 'Bug Report',
  description: 'Report a problem or issue',
  fields: [
    {
      id: 'title',
      type: 'text',
      label: 'Bug Title',
      placeholder: 'Brief description of the bug',
      required: true,
      helpText: 'Provide a concise title for this bug.'
    },
    {
      id: 'description',
      type: 'textarea',
      label: 'Bug Description',
      placeholder: 'Detailed description of the issue...',
      required: true,
      helpText: 'List the exact steps needed to reproduce the issue.'
    },
    {
      id: 'expected',
      type: 'textarea',
      label: 'Expected Behavior',
      placeholder: 'What should have happened?',
      required: false,
      helpText: 'Describe what you expected to happen.'
    },
    {
      id: 'actual',
      type: 'textarea',
      label: 'Actual Behavior',
      placeholder: 'What actually happened?',
      required: false,
      helpText: 'Describe what actually happened instead.'
    },
    {
      id: 'priority',
      type: 'select',
      label: 'Priority',
      required: false,
      options: [
        { value: 'critical', label: 'Critical - Application crashes or data loss' },
        { value: 'high', label: 'High - Major functionality broken' },
        { value: 'medium', label: 'Medium - Feature partially working' },
        { value: 'low', label: 'Low - Minor or cosmetic issue' }
      ]
    },
    {
      id: 'environment',
      type: 'textarea',
      label: 'Environment Details',
      placeholder: 'Browser, OS, device information...',
      required: false,
      helpText: 'Browser version, device type, screenshots, etc.'
    }
  ]
};

/**
 * Feature request template
 */
export const FEATURE_REQUEST_TEMPLATE: TemplateConfig = {
  id: 'feature-request',
  name: 'Feature Request',
  title: 'Request a Feature',
  description: 'Suggest new features',
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
export const GENERAL_FEEDBACK_TEMPLATE: TemplateConfig = {
  id: 'general',
  name: 'General Feedback',
  title: 'General Feedback',
  description: 'General feedback and suggestions',
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
      return BUG_REPORT_TEMPLATE;
    case 'feature-request':
      return FEATURE_REQUEST_TEMPLATE;
    case 'general':
      return GENERAL_FEEDBACK_TEMPLATE;
    case 'default':
    default:
      return DEFAULT_TEMPLATE;
  }
};

/**
 * Gets all available templates
 */
export const getAllTemplates = (): TemplateConfig[] => [
  DEFAULT_TEMPLATE,
  BUG_REPORT_TEMPLATE,
  FEATURE_REQUEST_TEMPLATE,
  GENERAL_FEEDBACK_TEMPLATE
];
