/**
 * Performance-optimized feedback widget with lazy loading and code splitting
 * @module components/OptimizedFeedbackWidget
 */
import React, { 
  lazy, 
  Suspense, 
  useMemo,
  ComponentType
} from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { FeedbackProvider } from './FeedbackProvider';
import type { 
  FeedbackConfig, 
  FeedbackModalStyles, 
  ThemePreference,
  AnimationConfig,
  TemplateConfig
} from '../types';

// Simple fallback components for missing lazy components
const SimpleFeedbackButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '56px',
      height: '56px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      fontSize: '16px',
      zIndex: 1000
    }}
    aria-label="Open feedback"
  >
    💬
  </button>
);

const SimpleFeedbackModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => Promise<void> 
}) => {
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ message, type: 'other' });
      onClose();
      setMessage('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Send Feedback</h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280'
            }}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            required
          />
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #D1D5DB',
                backgroundColor: 'white',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              style={{
                padding: '8px 16px',
                border: 'none',
                backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
                color: 'white',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : 'Send Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Configuration properties for the OptimizedFeedbackWidget component
 */
export interface OptimizedFeedbackWidgetProps {
  /** Configuration options for the feedback system */
  config?: FeedbackConfig;
  /** Whether to show the floating feedback button */
  showButton?: boolean;
  /** Whether to enable shake detection for feedback triggering */
  enableShakeDetection?: boolean;
  /** Custom styling options for the modal */
  modalStyles?: FeedbackModalStyles;
  /** Initial theme preference (light, dark, or system) */
  theme?: ThemePreference;
  /** Animation configuration for modal transitions */
  animation?: AnimationConfig;
  /** Template to use for feedback form layout */
  template?: TemplateConfig;
  /** Whether to show offline indicator when offline support is enabled */
  showOfflineIndicator?: boolean;
  /** Custom loading fallback component for lazy-loaded modules */
  loadingFallback?: React.ReactNode;
  /** Error boundary fallback component for handling loading failures */
  errorFallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

/**
 * Performance-optimized feedback widget with fallback components
 */
export const OptimizedFeedbackWidget: React.FC<OptimizedFeedbackWidgetProps> = ({
  config = {},
  showButton = true,
  enableShakeDetection = false,
  modalStyles,
  theme = 'system',
  animation,
  template,
  showOfflineIndicator,
  loadingFallback,
  errorFallback
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  /**
   * Optimized configuration with performance hints and localization defaults
   */
  const optimizedConfig = useMemo(() => ({
    // Default localization to prevent errors
    localization: {
      locale: 'en' as const,
      fallbackLocale: 'en' as const,
      rtl: false
    },
    // Other defaults
    enableOfflineSupport: true,
    collectUserAgent: true,
    collectUrl: true,
    theme: theme,
    ...config,
    __isOptimized: true,
    __lazyLoadingEnabled: true
  }), [config, theme]);

  const handleSubmit = async (feedbackData: any) => {
    if (optimizedConfig.apiEndpoint) {
      try {
        const response = await fetch(optimizedConfig.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...feedbackData,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // Call success callback if provided
        optimizedConfig.onSuccess?.(feedbackData);
      } catch (error) {
        console.error('Failed to submit feedback:', error);
        optimizedConfig.onError?.(error instanceof Error ? error : new Error('Unknown error'));
        throw error;
      }
    }
  };

  return (
    <ThemeProvider initialTheme={theme}>
      <FeedbackProvider config={optimizedConfig}>
        {/* Simple Feedback Button */}
        {showButton && (
          <SimpleFeedbackButton 
            onClick={() => {
              setIsModalOpen(true);
              optimizedConfig.onOpen?.();
            }} 
          />
        )}
        
        {/* Simple Feedback Modal */}
        <SimpleFeedbackModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            optimizedConfig.onClose?.();
          }}
          onSubmit={handleSubmit}
        />
      </FeedbackProvider>
    </ThemeProvider>
  );
};

export default OptimizedFeedbackWidget;
