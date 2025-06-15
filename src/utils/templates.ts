import type { TemplateConfig } from '../types';

/**
 * Re-export templates from the main templates directory
 * @deprecated Use ../templates/index.ts directly
 */
export {
  BUG_REPORT_TEMPLATE,
  FEATURE_REQUEST_TEMPLATE,
  getTemplateById,
  getAllTemplates
} from '../templates';

// Keep the existing exports for backward compatibility
export const DEFAULT_TEMPLATE: TemplateConfig = {
  id: 'default',
  name: 'General Feedback',
  description: 'Share your thoughts and suggestions',
  fields: [
    {
      id: 'message',
      type: 'textarea' as const,
      label: 'Your Message',
      placeholder: 'Tell us what you think...',
      required: true,
      validation: { minLength: 10, maxLength: 1000 }
    },
    {
      id: 'type',
      type: 'select' as const,
      label: 'Type',
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
