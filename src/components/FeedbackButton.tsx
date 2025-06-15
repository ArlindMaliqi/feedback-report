'use client';

import React from 'react';
import { useFeedback } from '../hooks/useFeedback';
import type { FeedbackButtonProps } from '../types';

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  position = 'bottom-right',
  className = '',
  children,
  onClick,
  disabled = false,
  size = 'medium',
  variant = 'primary'
}) => {
  const { openModal, pendingCount } = useFeedback();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openModal?.();
    }
  };

  // Position styles
  const positionStyles = {
    'bottom-right': { bottom: '24px', right: '24px' },
    'bottom-left': { bottom: '24px', left: '24px' },
    'top-right': { top: '24px', right: '24px' },
    'top-left': { top: '24px', left: '24px' }
  };

  // Size styles
  const sizeStyles = {
    small: { padding: '12px 16px', fontSize: '14px', minWidth: '120px' },
    medium: { padding: '16px 20px', fontSize: '16px', minWidth: '140px' },
    large: { padding: '20px 24px', fontSize: '18px', minWidth: '160px' }
  };

  const baseStyles = {
    position: 'fixed' as const,
    ...positionStyles[position],
    background: disabled 
      ? '#9ca3af' 
      : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    zIndex: 999998, // High but below modal
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '500',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
    boxShadow: disabled 
      ? 'none' 
      : '0 8px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1)',
    ...sizeStyles[size],
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  return (
    <>
      <style>
        {`
          .feedback-button-container {
            isolation: isolate;
          }
          .feedback-button-container:hover:not([disabled]) {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5), 0 8px 20px rgba(0, 0, 0, 0.15);
          }
          .feedback-button-container:active:not([disabled]) {
            transform: translateY(0) scale(0.98);
          }
          .feedback-button-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border-radius: 12px;
            min-width: 20px;
            height: 20px;
            font-size: 10px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
            animation: feedbackPulse 2s infinite;
          }
          @keyframes feedbackPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}
      </style>
      
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`feedback-button-container ${className}`}
        style={baseStyles}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.5), 0 8px 20px rgba(0, 0, 0, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1)';
          }
        }}
        onMouseDown={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
          }
        }}
        onMouseUp={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          }
        }}
        aria-label="Open feedback modal"
        title="Send us your feedback"
      >
        {children || (
          <>
            💬
            <span>Feedback</span>
          </>
        )}
        
        {/* Pending count badge */}
        {pendingCount > 0 && (
          <div className="feedback-button-badge">
            {pendingCount > 9 ? '9+' : pendingCount}
          </div>
        )}
      </button>
    </>
  );
};

export default FeedbackButton;
