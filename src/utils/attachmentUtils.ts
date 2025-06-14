import { FeedbackAttachment } from '../types';
import { generateId } from './index';

/**
 * Default allowed MIME types for attachments
 */
export const DEFAULT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
];

/**
 * Default maximum file size (5MB)
 */
export const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

/**
 * Validates a file against size and type restrictions
 * @param file - File to validate
 * @param maxSize - Maximum allowed size in bytes
 * @param allowedTypes - Array of allowed MIME types
 * @returns Object with validation result and error message if invalid
 */
export const validateAttachment = (
  file: File,
  maxSize: number = DEFAULT_MAX_SIZE,
  allowedTypes: string[] = DEFAULT_ALLOWED_TYPES
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatFileSize(maxSize)}.`
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.map(t => t.replace('image/', '.')).join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Creates a FeedbackAttachment object from a File
 * @param file - File to process
 * @returns Promise resolving to a FeedbackAttachment
 */
export const createAttachment = async (file: File): Promise<FeedbackAttachment> => {
  const attachment: FeedbackAttachment = {
    id: generateId(),
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    file,
    status: 'pending',
  };

  // Create preview for images
  if (file.type.startsWith('image/')) {
    attachment.previewUrl = URL.createObjectURL(file);
  }

  // Create data URL for offline storage
  try {
    attachment.dataUrl = await fileToDataUrl(file);
  } catch (error) {
    console.error('Failed to convert file to data URL:', error);
  }

  return attachment;
};

/**
 * Converts a File to a data URL
 * @param file - File to convert
 * @returns Promise resolving to a data URL string
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Cleans up resources used by attachments
 * @param attachments - Array of attachments to clean up
 */
export const cleanupAttachments = (attachments: FeedbackAttachment[]): void => {
  for (const attachment of attachments) {
    if (attachment.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
  }
};

/**
 * Takes a screenshot of the current viewport
 * @returns Promise resolving to a FeedbackAttachment containing the screenshot
 */
export const captureScreenshot = async (): Promise<FeedbackAttachment | null> => {
  try {
    // Check if browser supports the required APIs
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      console.warn('Screenshot capture not supported in this browser');
      return null;
    }

    // Use proper TypeScript declaration for display media options
    // Define browser-specific interface to fix TS error
    interface CustomDisplayMediaStreamOptions extends DisplayMediaStreamOptions {
      video?: boolean | MediaTrackConstraints;
      audio?: boolean | MediaTrackConstraints;
    }

    const displayMediaOptions: CustomDisplayMediaStreamOptions = { 
      video: true,
      audio: false
    };
    
    // Request screen capture
    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    
    // Create a video element to play the stream
    const video = document.createElement('video');
    video.srcObject = stream;
    
    // Wait for video to load enough data
    await new Promise<void>(resolve => {
      video.onloadedmetadata = () => {
        video.play().catch(console.error);
        resolve();
      };
    });

    // Create canvas to capture the frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create image blob'));
      }, 'image/png');
    });

    // Stop all tracks
    stream.getTracks().forEach(track => track.stop());

    // Create a file from the blob
    const file = new File([blob], 'screenshot.png', { type: 'image/png' });
    
    // Create attachment
    return await createAttachment(file);
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    return null;
  }
};
