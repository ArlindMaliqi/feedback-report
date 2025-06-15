/**
 * Enhanced feedback modal component with advanced features
 * @module components/FeedbackModal
 */
'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef, useContext } from 'react';
import { 
  FeedbackConfig, 
  FeedbackModalStyles, 
  AnimationConfig, 
  TemplateConfig, 
  UserIdentity,
  Feedback,
  FeedbackAttachment,
  TemplateField,
  Category
} from '../types';
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
  isOpen?: boolean;
  /** Function to close the modal */
  onClose?: () => void;
  /** Function to handle feedback submission */
  onSubmit?: (feedback: any) => Promise<void>;
  /** Custom styling options */
  styles?: FeedbackModalStyles;
  /** Animation configuration */
  animation?: AnimationConfig;
  /** Template to use */
  template?: TemplateConfig;
  /** Configuration options */
  config?: FeedbackConfig;
}

/**
 * Get template by ID helper function
 */
const getTemplate = (templateId: string | TemplateConfig): TemplateConfig => {
  // If it's already an object, return it
  if (typeof templateId === 'object' && templateId !== null) {
    return templateId;
  }
  
  const templates: Record<string, TemplateConfig> = {
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
    }
  };
  
  return templates[templateId as string] || templates.default;
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
  template: customTemplate,
  config = {}
}) => {
  const { submitFeedback, isSubmitting, error: submitError, openModal, closeModal, isOpen: contextIsOpen, categories } = useFeedback();
  const localizationContext = useContext(LocalizationContext);
  const { t, locale } = localizationContext || { 
    t: (key: string) => key, 
    locale: 'en' as const 
  };
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  // Use props or context values
  const modalIsOpen = isOpen !== undefined ? isOpen : contextIsOpen;
  const handleClose = onClose || closeModal;

  // State management
  const [attachments, setAttachments] = useState<FeedbackAttachment[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isClosing, setIsClosing] = useState(false);

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLElement | null>(null);

  // Default categories if not provided
  const defaultCategories: Category[] = categories || [
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
  const template = useMemo(() => 
    customTemplate || getTemplate(config.defaultTemplate || 'default'), 
    [customTemplate, config.defaultTemplate]
  );

  // Initialize form data when template changes
  useEffect(() => {
    const initialData: Record<string, any> = {};
    template.fields.forEach((field: TemplateField) => {
      initialData[field.id] = field.type === 'checkbox' ? false : '';
    });
    setFormData(initialData);
  }, [template]);

  // Auto-focus on form when opened
  useEffect(() => {
    if (modalIsOpen) {
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
  }, [modalIsOpen, template]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalIsOpen) {
        handleCloseModal();
      }
    };

    if (modalIsOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [modalIsOpen]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  }, []);

  // Handle close with animation
  const handleCloseModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleClose?.();
    }, animation.duration);
  }, [handleClose, animation.duration]);

  // Handle input changes
  const handleInputChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

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
      template: template.id
    };

    try {
      if (onSubmit) {
        await onSubmit(additionalData);
      } else {
        await submitFeedback(message, type as Feedback["type"], additionalData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  }, [formData, template.fields, attachments, template.id, submitFeedback, handleCloseModal, onSubmit]);

  // Handle attachment changes
  const handleAttachmentsChange = useCallback((newAttachments: FeedbackAttachment[]) => {
    setAttachments(newAttachments);
  }, []);

  // Validate form
  const isFormValid = template.fields
    .filter((field: TemplateField) => field.required)
    .every((field: TemplateField) => {
      const value = formData[field.id];
      return value && (typeof value === 'string' ? value.trim() : value);
    });

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
            className="w-full bg-white text-black placeholder:bg-zinc-200 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="rounded bg-white text-black placeholder:bg-zinc-200 bg-white border-gray-300 focus:ring-2 bg-white focus:ring-blue-500"
            />
            <span>{field.label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  if (!modalIsOpen && !isClosing) {
    return null;
  }

  // Show error notifications
  const shouldShowInternalError = submitError && !isSonnerAvailable();

  return (
    <div
      className="feedback-modal-overlay"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999, // Extremely high z-index
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        padding: '20px',
        boxSizing: 'border-box',
        ...getAnimationStyles(animation, !isClosing),
      }}
    >
      <style>
        {`
          .feedback-modal-overlay * {
            box-sizing: border-box;
          }
          .feedback-modal-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.5;
          }
          .feedback-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 14px;
            background-color: #fafafa;
            color: #111827;
            transition: all 0.2s ease;
            outline: none;
            font-family: inherit;
          }
          .feedback-input:focus {
            border-color: #3b82f6;
            background-color: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .feedback-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .feedback-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }
          .feedback-button-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            border: none;
            border-radius: 10px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .feedback-button-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
          }
          .feedback-button-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
          .feedback-button-secondary {
            background: white;
            color: #374151;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .feedback-button-secondary:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateY(20px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div
        ref={modalRef}
        className="feedback-modal-container"
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '0',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          animation: 'slideUp 0.3s ease-out',
          ...getAnimationStyles(animation, !isClosing),
        }}
        dir={dir}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '24px 24px 20px 24px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.3'
            }}>
              💬 {template.name}
            </h2>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '14px', 
              color: '#6b7280',
              lineHeight: '1.4'
            }}>
              {template.description || 'Help us improve by sharing your thoughts'}
            </p>
          </div>
          <button
            onClick={handleCloseModal}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '4px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Template fields */}
            {template.fields.map((field: TemplateField) => {
              if (field.type === 'checkbox') {
                return (
                  <label key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      id={field.id}
                      type="checkbox"
                      checked={!!formData[field.id]}
                      onChange={(e) => handleInputChange(field.id, e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#3b82f6',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{field.label}</span>
                  </label>
                );
              }

              return (
                <div key={field.id}>
                  <label htmlFor={field.id} className="feedback-label">
                    {field.label}
                    {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.id}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="feedback-input"
                      rows={4}
                      style={{ 
                        resize: 'vertical',
                        minHeight: '120px',
                        lineHeight: '1.5'
                      }}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.id}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                      className="feedback-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="feedback-input"
                    />
                  )}
                  {field.helpText && (
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6b7280', 
                      margin: '6px 0 0 0',
                      lineHeight: '1.4'
                    }}>
                      {field.helpText}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Category selector */}
            <CategorySelector
              categories={defaultCategories}
              selectedCategory={formData.category || ''}
              selectedSubcategory={formData.subcategory}
              onSelectionChange={(categoryId: string, subcategoryId?: string) => {
                handleInputChange('category', categoryId);
                handleInputChange('subcategory', subcategoryId);
              }}
              disabled={isSubmitting}
            />

            {/* User identity fields */}
            {config.collectUserIdentity && (
              <UserIdentityFields
                value={formData.user}
                onChange={(user: any) => handleInputChange('user', user)}
                config={config}
              />
            )}

            {/* File attachments */}
            {config.enableFileAttachments && (
              <FileAttachmentInput
                attachments={attachments}
                onAttachmentsChange={handleAttachmentsChange}
                config={{
                  maxAttachments: config.maxAttachments || 5,
                  maxAttachmentSize: config.maxFileSize || 5 * 1024 * 1024,
                  allowedAttachmentTypes: config.allowedAttachmentTypes || ['image/*', 'application/pdf', 'text/*']
                }}
                disabled={isSubmitting}
              />
            )}

            {/* Error display */}
            {shouldShowInternalError && (
              <div style={{
                padding: '16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                color: '#dc2626'
              }}>
                <p style={{ margin: 0, fontSize: '14px' }}>{submitError}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #f3f4f6'
          }}>
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="feedback-button-secondary"
              style={{ flex: '1' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="feedback-button-primary"
              style={{ flex: '2' }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Sending...
                </>
              ) : (
                <>
                  📤 Send Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
