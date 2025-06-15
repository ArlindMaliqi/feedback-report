import type { TemplateConfig } from '../types';

export const DEFAULT_TEMPLATE: TemplateConfig = {
  id: 'default',
  name: 'General Feedback',
  description: 'Share your thoughts and suggestions',
  fields: [
    {
      id: 'message',
      type: 'textarea',
      label: 'Your Message',
      placeholder: 'Tell us what you think...',
      required: true,
      validation: { minLength: 10, maxLength: 1000 }
    },
    {
      id: 'type',
      type: 'select',
      label: 'Type',
      required: true,
      options: [
        { value: 'bug', label: 'Bug Report' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'improvement', label: 'Improvement' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'priority',
      type: 'select',
      label: 'Priority',
      required: false,
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
      ],
      defaultValue: 'medium'
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email (Optional)',
      placeholder: 'your@email.com',
      helpText: 'We may contact you for follow-up questions'
    }
  ]
};

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
      validation: { minLength: 5, maxLength: 100 }
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Bug Description',
      placeholder: 'Describe what happened and what you expected...',
      required: true,
      validation: { minLength: 20, maxLength: 2000 }
    },
    {
      id: 'steps',
      type: 'textarea',
      label: 'Steps to Reproduce',
      placeholder: '1. Go to...\n2. Click on...\n3. See error',
      helpText: 'List the exact steps needed to reproduce the issue'
    },
    {
      id: 'expected',
      type: 'textarea',
      label: 'Expected Behavior',
      placeholder: 'What should have happened?'
    },
    {
      id: 'actual',
      type: 'textarea',
      label: 'Actual Behavior',
      placeholder: 'What actually happened?'
    },
    {
      id: 'severity',
      type: 'select',
      label: 'Severity',
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
      id: 'reproducible',
      type: 'select',
      label: 'Reproducible',
      options: [
        { value: 'always', label: 'Always' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'rarely', label: 'Rarely' },
        { value: 'unable', label: 'Unable to reproduce' }
      ]
    },
    {
      id: 'environment',
      type: 'textarea',
      label: 'Environment Details',
      placeholder: 'Browser, OS, device information...',
      helpText: 'Browser version, device type, screenshots, etc.'
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email (Optional)',
      placeholder: 'your@email.com'
    }
  ]
};

export const FEATURE_REQUEST_TEMPLATE: TemplateConfig = {
  id: 'feature-request',
  name: 'Feature Request',
  description: 'Suggest a new feature or improvement',
  fields: [
    {
      id: 'title',
      type: 'text',
      label: 'Feature Title',
      placeholder: 'What feature would you like?',
      required: true,
      validation: { minLength: 5, maxLength: 100 }
    },
    {
      id: 'problem',
      type: 'textarea',
      label: 'Problem Statement',
      placeholder: 'What problem would this feature solve?',
      required: true,
      helpText: 'Describe the problem or pain point that this feature would address'
    },
    {
      id: 'solution',
      type: 'textarea',
      label: 'Proposed Solution',
      placeholder: 'How would this feature work?',
      required: true,
      helpText: 'Describe your idea for implementing this feature'
    },
    {
      id: 'alternatives',
      type: 'textarea',
      label: 'Alternatives Considered',
      placeholder: 'Any alternatives or workarounds you\'ve tried?',
      helpText: 'Describe any alternative solutions or features you\'ve considered'
    },
    {
      id: 'usecase',
      type: 'textarea',
      label: 'Use Case',
      placeholder: 'How would you use this feature?',
      helpText: 'Provide specific examples of how you would use this feature'
    },
    {
      id: 'priority',
      type: 'select',
      label: 'Priority',
      required: true,
      options: [
        { value: 'high', label: 'High - Critical for my workflow' },
        { value: 'medium', label: 'Medium - Would significantly improve experience' },
        { value: 'low', label: 'Low - Nice to have' }
      ],
      defaultValue: 'medium'
    },
    {
      id: 'urgency',
      type: 'select',
      label: 'Urgency',
      options: [
        { value: 'immediate', label: 'Immediate - Needed ASAP' },
        { value: 'soon', label: 'Soon - Within next month' },
        { value: 'eventually', label: 'Eventually - No rush' }
      ]
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email (Optional)',
      placeholder: 'your@email.com'
    }
  ]
};

export const GENERAL_FEEDBACK_TEMPLATE: TemplateConfig = {
  id: 'general',
  name: 'General Feedback',
  description: 'Share your thoughts and suggestions',
  fields: [
    {
      id: 'rating',
      type: 'select',
      label: 'Overall Rating',
      required: true,
      options: [
        { value: '5', label: '⭐⭐⭐⭐⭐ Excellent (5/5)' },
        { value: '4', label: '⭐⭐⭐⭐ Good (4/5)' },
        { value: '3', label: '⭐⭐⭐ Average (3/5)' },
        { value: '2', label: '⭐⭐ Below Average (2/5)' },
        { value: '1', label: '⭐ Poor (1/5)' }
      ],
      defaultValue: '5'
    },
    {
      id: 'category',
      type: 'select',
      label: 'Feedback Category',
      options: [
        { value: 'usability', label: 'Usability & Design' },
        { value: 'performance', label: 'Performance' },
        { value: 'content', label: 'Content & Information' },
        { value: 'features', label: 'Features & Functionality' },
        { value: 'support', label: 'Support & Help' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Your Feedback',
      placeholder: 'Please share your thoughts...',
      required: true,
      helpText: 'What do you like or dislike? Any suggestions for improvement?',
      validation: { minLength: 10, maxLength: 1500 }
    },
    {
      id: 'recommend',
      type: 'select',
      label: 'Would you recommend this to others?',
      options: [
        { value: 'definitely', label: 'Definitely' },
        { value: 'probably', label: 'Probably' },
        { value: 'not-sure', label: 'Not sure' },
        { value: 'probably-not', label: 'Probably not' },
        { value: 'definitely-not', label: 'Definitely not' }
      ]
    },
    {
      id: 'improvements',
      type: 'textarea',
      label: 'Suggested Improvements',
      placeholder: 'What could we improve?',
      helpText: 'Any specific suggestions for making this better?'
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email (Optional)',
      placeholder: 'your@email.com',
      helpText: 'If you\'d like us to follow up with you'
    }
  ]
};

const TEMPLATES = {
  'default': DEFAULT_TEMPLATE,
  'bug-report': BUG_REPORT_TEMPLATE,
  'feature-request': FEATURE_REQUEST_TEMPLATE,
  'general': GENERAL_FEEDBACK_TEMPLATE
};

export const getTemplateById = (id: string): TemplateConfig => {
  return TEMPLATES[id as keyof typeof TEMPLATES] || DEFAULT_TEMPLATE;
};

export const getAllTemplates = (): TemplateConfig[] => {
  return Object.values(TEMPLATES);
};
