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

  // Base styles with theme support
  const styles = {
    container: {
      marginBottom: '1rem',
    },
    dropzone: {
      border: `2px dashed ${theme === 'dark' ? '#4b5563' : '#ccc'}`,
      borderRadius: '4px',
      padding: '1rem',
      textAlign: 'center' as const,
      backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
      cursor: canAddMoreAttachments && !disabled ? 'pointer' : 'not-allowed',
      opacity: canAddMoreAttachments && !disabled ? 1 : 0.5,
    },
    previewsContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    previewItem: {
      position: 'relative' as const,
      width: '80px',
      height: '80px',
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
      borderRadius: '4px',
      overflow: 'hidden',
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    previewFile: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: theme === 'dark' ? '#2d3748' : '#edf2f7',
      color: theme === 'dark' ? '#e2e8f0' : '#4a5568',
      fontSize: '0.75rem',
      padding: '0.25rem',
      textAlign: 'center' as const,
    },
    removeButton: {
      position: 'absolute' as const,
      top: '2px',
      right: '2px',
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)',
      color: theme === 'dark' ? 'white' : 'black',
      border: 'none',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      cursor: 'pointer',
      fontSize: '0.75rem',
    },
    error: {
      color: theme === 'dark' ? '#f87171' : '#e53e3e',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
    },
    buttonRow: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    button: {
      backgroundColor: theme === 'dark' ? '#4b5563' : '#e2e8f0',
      color: theme === 'dark' ? '#e5e7eb' : '#1a202c',
      border: 'none',
      borderRadius: '4px',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      cursor: canAddMoreAttachments && !disabled ? 'pointer' : 'not-allowed',
      opacity: canAddMoreAttachments && !disabled ? 1 : 0.5,
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.dropzone} onClick={() => canAddMoreAttachments && !disabled && fileInputRef.current?.click()}>
        <p>
          {canAddMoreAttachments 
            ? `Drag files here or click to attach (${attachments.length}/${maxAttachments})`
            : 'Maximum number of attachments reached'}
        </p>
        <small style={{ display: 'block', marginTop: '0.25rem', color: theme === 'dark' ? '#9ca3af' : '#718096' }}>
          Allowed types: {allowedTypes.map((t: string) => t.replace('image/', '.')).join(', ')}
          <br />
          Max size: {formatFileSize(maxSize)}
        </small>
      </div>
      
      {error && <div style={styles.error} role="alert">{error}</div>}
      
      <div style={styles.buttonRow}>
        <button 
          type="button"
          style={styles.button}
          onClick={() => fileInputRef.current?.click()}
          disabled={!canAddMoreAttachments || disabled}
        >
          Choose Files
        </button>
        
        <button 
          type="button"
          style={styles.button}
          onClick={handleTakeScreenshot}
          disabled={!canAddMoreAttachments || disabled}
        >
          Capture Screenshot
        </button>
      </div>
      
      {attachments.length > 0 && (
        <div style={styles.previewsContainer}>
          {attachments.map(attachment => (
            <div key={attachment.id} style={styles.previewItem}>
              {attachment.mimeType?.startsWith('image/') && attachment.previewUrl ? (
                <img 
                  src={attachment.previewUrl} 
                  alt={attachment.filename} 
                  style={styles.previewImage}
                />
              ) : (
                <div style={styles.previewFile}>
                  {attachment.filename?.split('.').pop()?.toUpperCase() || 'FILE'}
                  <br />
                  {formatFileSize(attachment.size)}
                </div>
              )}
              
              <button 
                type="button"
                style={styles.removeButton}
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
        className='bg-white text-black placeholder:bg-zinc-200'
        disabled={!canAddMoreAttachments || disabled}
      />
    </div>
  );
};

export default FileAttachmentInput;
