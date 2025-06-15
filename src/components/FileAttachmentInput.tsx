/**
 * File attachment input component for feedback
 * @module components/FileAttachmentInput
 */
import React, { useCallback, useRef, useState } from 'react';
import { FeedbackAttachment, FeedbackConfig } from '../types';
import {
  validateAttachment,
  createAttachment,
  formatFileSize,
  DEFAULT_ALLOWED_TYPES,
  DEFAULT_MAX_SIZE,
  captureScreenshot
} from '../utils/attachmentUtils';
import { useTheme } from '../hooks/useTheme';

/**
 * Props for the FileAttachmentInput component
 */
export interface FileAttachmentInputProps {
  /** Current attachments */
  attachments: FeedbackAttachment[];
  /** Function to update attachments */
  onAttachmentsChange: (attachments: FeedbackAttachment[]) => void;
  /** Configuration options */
  config?: Pick<FeedbackConfig,
    'maxAttachments' |
    'allowedAttachmentTypes'
  > & {
    maxAttachmentSize?: number;
  };
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Component for managing file attachments in feedback forms
 * 
 * Allows users to attach files to their feedback submissions with
 * validation, previews, and the ability to capture screenshots.
 * 
 * @param props - Component props
 */
export const FileAttachmentInput: React.FC<FileAttachmentInputProps> = ({
  attachments,
  onAttachmentsChange,
  config = {},
  disabled = false
}) => {
  const { theme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxAttachments = config.maxAttachments || 3;
  const maxSize = config?.maxAttachmentSize || 5 * 1024 * 1024;
  const allowedTypes = config?.allowedAttachmentTypes || ['image/*', 'application/pdf'];

  const canAddMoreAttachments = attachments.length < maxAttachments;

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setError(null);
    
    // Check if adding these files would exceed the limit
    if (attachments.length + files.length > maxAttachments) {
      setError(`Maximum ${maxAttachments} attachments allowed`);
      return;
    }
    
    const newAttachments: FeedbackAttachment[] = [...attachments];
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file
      const validation = validateAttachment(file, maxSize, allowedTypes);
      
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        continue;
      }
      
      try {
        // Create attachment object
        const attachment = await createAttachment(file);
        newAttachments.push(attachment);
      } catch (err) {
        console.error('Error processing attachment:', err);
        setError('Failed to process file');
      }
    }
    
    // Update attachments
    onAttachmentsChange(newAttachments);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove an attachment
  const handleRemoveAttachment = (id: string) => {
    const updatedAttachments = attachments.filter(a => a.id !== id);
    onAttachmentsChange(updatedAttachments);
    setError(null);
  };
  
  // Take a screenshot
  const handleTakeScreenshot = async () => {
    if (!canAddMoreAttachments || disabled) return;
    
    setError(null);
    
    try {
      const screenshotAttachment = await captureScreenshot();
      
      if (!screenshotAttachment) {
        setError('Failed to capture screenshot');
        return;
      }
      
      onAttachmentsChange([...attachments, screenshotAttachment]);
    } catch (err) {
      console.error('Error capturing screenshot:', err);
      setError('Failed to capture screenshot');
    }
  };

  return (
    <>
      <style>
        {`
          .feedback-attachment-container * {
            box-sizing: border-box;
          }
          .feedback-attachment-dropzone {
            border: 2px dashed #e5e7eb;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            background-color: #fafafa;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .feedback-attachment-dropzone:hover:not(.disabled) {
            border-color: #3b82f6;
            background-color: #eff6ff;
          }
          .feedback-attachment-dropzone.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: #f3f4f6;
          }
          .feedback-attachment-button {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            color: #374151;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
          }
          .feedback-attachment-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
            border-color: #d1d5db;
            transform: translateY(-1px);
          }
          .feedback-attachment-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .feedback-attachment-preview {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
          }
          .feedback-attachment-item {
            position: relative;
            width: 80px;
            height: 80px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            background: white;
          }
          .feedback-attachment-remove {
            position: absolute;
            top: -6px;
            right: -6px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          .feedback-attachment-remove:hover {
            background: #dc2626;
            transform: scale(1.1);
          }
          .feedback-attachment-error {
            color: #dc2626;
            font-size: 13px;
            margin-top: 8px;
            padding: 8px 12px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
          }
        `}
      </style>
      
      <div className="feedback-attachment-container" style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '8px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          📎 Attachments (Optional)
        </label>
        
        <div 
          className={`feedback-attachment-dropzone ${!canAddMoreAttachments || disabled ? 'disabled' : ''}`}
          onClick={() => canAddMoreAttachments && !disabled && fileInputRef.current?.click()}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
          <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            {canAddMoreAttachments 
              ? `Drop files here or click to attach (${attachments.length}/${maxAttachments})`
              : 'Maximum number of attachments reached'}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
            Allowed types: {allowedTypes.map((t: string) => t.replace('image/', '.')).join(', ')}
            <br />
            Max size: {formatFileSize(maxSize)}
          </p>
        </div>
        
        {error && <div className="feedback-attachment-error" role="alert">{error}</div>}
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button 
            type="button"
            className="feedback-attachment-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!canAddMoreAttachments || disabled}
          >
            📁 Choose Files
          </button>
          
          <button 
            type="button"
            className="feedback-attachment-button"
            onClick={handleTakeScreenshot}
            disabled={!canAddMoreAttachments || disabled}
          >
            📸 Screenshot
          </button>
        </div>
        
        {attachments.length > 0 && (
          <div className="feedback-attachment-preview">
            {attachments.map(attachment => (
              <div key={attachment.id} className="feedback-attachment-item">
                {attachment.mimeType?.startsWith('image/') && attachment.previewUrl ? (
                  <img 
                    src={attachment.previewUrl} 
                    alt={attachment.filename} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '10px',
                    padding: '4px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '16px', marginBottom: '2px' }}>📄</div>
                    <div>{attachment.filename?.split('.').pop()?.toUpperCase() || 'FILE'}</div>
                    <div>{formatFileSize(attachment.size)}</div>
                  </div>
                )}
                
                <button 
                  type="button"
                  className="feedback-attachment-remove"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  disabled={disabled}
                  aria-label={`Remove ${attachment.filename}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept={allowedTypes.join(',')}
          disabled={!canAddMoreAttachments || disabled}
        />
      </div>
    </>
  );
};

export default FileAttachmentInput;
