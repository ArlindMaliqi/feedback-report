/**
 * Enhanced feedback modal component with advanced features
 * @module components/FeedbackModal
 */
import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react';
import { 
  FeedbackConfig, 
  FeedbackModalStyles, 
  AnimationConfig, 
  FeedbackTemplate, 
  UserIdentity,
  Feedback,
  FeedbackAttachment,
  TemplateField
} from '../types';
import { useTheme } from '../hooks/useTheme';
import { useFeedback } from '../hooks/useFeedback';
import { LocalizationContext } from '../contexts/FeedbackContext';
import { CategorySelector } from './CategorySelector';
import { UserIdentityFields } from './UserIdentityFields';
import { FileAttachmentInput } from './FileAttachmentInput';
import { showInfo } from '../utils/notifications';

/**
 * Props for the FeedbackModal component
 */
export interface FeedbackModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Function to handle feedback submission */
  onSubmit: (feedback: any) => Promise<void>;
  /** Custom styling options */
  styles?: FeedbackModalStyles;
  /** Animation configuration */
  animation?: AnimationConfig;
  /** Template ID to use */
  templateId?: FeedbackTemplate;
  /** Configuration options */
  config?: FeedbackConfig;
}

/**
 * Default template for feedback modal
 */
const getTemplateById = (templateId: FeedbackTemplate) => {
  const templates: Record<string, {
    id: string;
    name: string;
    fields: TemplateField[];
  }> = {
    default: {
      id: 'default',
      name: 'Default Feedback',
      fields: [
        { id: 'message', type: 'textarea', label: 'Your Feedback', required: true },
        { id: 'type', type: 'select', label: 'Type', required: true, options: [
          { value: 'bug', label: 'Bug Report' },
          { value: 'feature', label: 'Feature Request' },
          { value: 'improvement', label: 'Improvement' },
          { value: 'other', label: 'Other' }
        ]}
      ]
    },
    bug: {
      id: 'bug',
      name: 'Bug Report',
      fields: [
        { id: 'message', type: 'textarea', label: 'Describe the bug', required: true },
        { id: 'steps', type: 'textarea', label: 'Steps to reproduce', required: false },
        { id: 'expected', type: 'textarea', label: 'Expected behavior', required: false }
      ]
    },
    'bug-report': {
      id: 'bug-report',
      name: 'Bug Report',
      fields: [
        { id: 'message', type: 'textarea', label: 'Describe the bug', required: true },
        { id: 'steps', type: 'textarea', label: 'Steps to reproduce', required: false },
        { id: 'expected', type: 'textarea', label: 'Expected behavior', required: false }
      ]
    },
    feature: {
      id: 'feature',
      name: 'Feature Request',
      fields: [
        { id: 'message', type: 'textarea', label: 'Describe the feature', required: true },
        { id: 'use_case', type: 'textarea', label: 'Use case', required: false }
      ]
    },
    'feature-request': {
      id: 'feature-request',
      name: 'Feature Request',
      fields: [
        { id: 'message', type: 'textarea', label: 'Describe the feature', required: true },
        { id: 'use_case', type: 'textarea', label: 'Use case', required: false }
      ]
    }
  };
  
  return templates[templateId] || templates.default;
};

/**
 * Mock function to check if Sonner is available
 */
const isSonnerAvailable = () => false;

/**
 * Mock function to get animation styles
 */
const getAnimationStyles = (animation: AnimationConfig, isEntering: boolean) => ({
  transition: `all ${animation.duration}ms ease-in-out`,
  opacity: isEntering ? 1 : 0
});

/**
 * Main feedback modal component with enhanced features
 */
export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  styles = {},
  animation = { enter: 'fade', exit: 'fade', duration: 300 },
  templateId = 'default',
  config = {}
}) => {
  const { submitFeedback, isSubmitting, error: submitError } = useFeedback();
  const localizationContext = useContext(LocalizationContext);
  const { t, locale } = localizationContext || { 
    t: (key: string) => key, 
    locale: 'en' as const 
  };
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  // State management
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isClosing, setIsClosing] = useState(false);

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLElement | null>(null);

  // Default categories if not provided in config
  const categories = config.categories || [
    {
      id: 'bug',
      name: 'Bug Report',
      description: 'Report a problem or issue',
      subcategories: [
        { id: 'ui', name: 'User Interface', description: 'Visual or layout issues' },
        { id: 'performance', name: 'Performance', description: 'Slow or unresponsive behavior' },
        { id: 'functionality', name: 'Functionality', description: 'Feature not working as expected' }
      ]
    },
    {
      id: 'feature',
      name: 'Feature Request',
      description: 'Suggest a new feature or improvement',
      subcategories: [
        { id: 'enhancement', name: 'Enhancement', description: 'Improve existing feature' },
        { id: 'new-feature', name: 'New Feature', description: 'Add completely new functionality' }
      ]
    },
    {
      id: 'other',
      name: 'Other',
      description: 'General feedback or questions',
      subcategories: []
    }
  ];

  // Get template configuration
  const template = useMemo(() => getTemplateById(templateId), [templateId]);

  // Initialize form data when template changes
  useEffect(() => {
    const initialData: Record<string, any> = {};
    template.fields.forEach((field: TemplateField) => {
      initialData[field.id] = field.type === 'checkbox' ? false : '';
    });
    setFormData(initialData);
  }, [template]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElement = modalRef.current.querySelector(
        'input, textarea, button, select'
      ) as HTMLElement;
      if (focusableElement) {
        focusableElement.focus();
        initialFocusRef.current = focusableElement;
      }
    }
  }, [isOpen]);

  // Show error notifications
  const shouldShowInternalError = submitError && !isSonnerAvailable();

  // Auto-focus on form when opened
  useEffect(() => {
    if (isOpen) {
      template.fields.forEach((field: TemplateField) => {
        if (field.id === 'message') { // Focus on message field by default
          const element = document.getElementById(field.id);
          if (element) {
            element.focus();
          }
        }
      });

      // Show helpful tooltip if available
      if (isSonnerAvailable()) {
        showInfo("Please provide your feedback in the form below");
      }
    }
  }, [isOpen, template]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, []);

  // Handle close with animation
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, animation.duration);
  }, [onClose, animation.duration]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = formData.message || '';
    const type = formData.type || 'other';
    
    // Validate required fields
    const missingFields = template.fields
      .filter((field: TemplateField) => field.required)
      .filter((field: TemplateField) => !formData[field.id]);

    if (missingFields.length > 0) {
      console.warn('Missing required fields:', missingFields);
      return;
    }

    const additionalData = {
      ...formData,
      attachments: attachments.map(att => att.file),
      template: templateId
    };

    try {
      await submitFeedback(message, type as Feedback["type"], additionalData);
      handleClose();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  }, [formData, template.fields, attachments, templateId, submitFeedback, handleClose]);

  // Validate form
  const isFormValid = template.fields
    .filter((field: TemplateField) => field.required)
    .every((field: TemplateField) => {
      const value = formData[field.id];
      return value && (typeof value === 'string' ? value.trim() : value);
    });

  // Handle input changes
  const handleInputChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  // Handle attachment changes
  const handleAttachmentsChange = useCallback((newAttachments: FeedbackAttachment[]) => {
    setAttachments(newAttachments);
  }, []);

  // Render form field
  const renderField = (field: TemplateField) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            key={field.id}
            id={field.id}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'textarea':
        return (
          <textarea
            key={field.id}
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        );

      case 'select':
        return (
          <select
            key={field.id}
            id={field.id}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            {field.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label key={field.id} className="flex items-center space-x-2">
            <input
              id={field.id}
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span>{field.label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        ...getAnimationStyles(animation, !isClosing),
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
        dir={dir}
        style={{
          ...getAnimationStyles(animation, !isClosing),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {template.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Template fields */}
            {template.fields.map((field: TemplateField) => {
              if (field.type === 'checkbox') {
                return renderField(field);
              }

              return (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              );
            })}

            {/* Category selector */}
            <CategorySelector
              categories={categories}
              selectedCategory={formData.category || ''}
              selectedSubcategory={formData.subcategory}
              onSelectionChange={(categoryId: string, subcategoryId?: string) => {
                handleInputChange('category', categoryId);
                handleInputChange('subcategory', subcategoryId);
              }}
              disabled={isSubmitting}
            />

            {/* User identity fields */}
            <UserIdentityFields
              value={formData.user}
              onChange={(user: any) => handleInputChange('user', user)}
            />

            {/* File attachments */}
            <FileAttachmentInput
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
              config={{
                maxAttachments: 5,
                maxAttachmentSize: 5 * 1024 * 1024,
                allowedAttachmentTypes: ['image/*', 'application/pdf', 'text/*']
              }}
            />

            {/* Error display */}
            {shouldShowInternalError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !isFormValid || 
                isSubmitting || 
                template.fields
                  .filter((field: TemplateField) => field.required)
                  .some((field: TemplateField) => !formData[field.id])
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
