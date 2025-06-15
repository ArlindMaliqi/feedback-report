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
    small: { width: '48px', height: '48px', fontSize: '18px' },
    medium: { width: '60px', height: '60px', fontSize: '24px' },
    large: { width: '72px', height: '72px', fontSize: '28px' }
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    secondary: {
      backgroundColor: 'white',
      color: '#3B82F6',
      border: '2px solid #3B82F6',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#3B82F6',
      border: '2px solid #3B82F6',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(8px)'
    }
  };

  const baseStyles = {
    position: 'fixed' as const,
    borderRadius: '50%',
    cursor: disabled ? 'not-allowed' : 'pointer',
    zIndex: 1000,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    outline: 'none',
    transform: 'scale(1)',
    opacity: disabled ? 0.5 : 1,
    ...positionStyles[position],
    ...sizeStyles[size],
    ...variantStyles[variant]
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.1)';
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = '#2563EB';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.5), 0 8px 16px rgba(0, 0, 0, 0.15)';
          } else {
            e.currentTarget.style.backgroundColor = '#EFF6FF';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor;
          e.currentTarget.style.boxShadow = variantStyles[variant].boxShadow;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(0.95)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'scale(1.1)';
        }
      }}
      aria-label="Open feedback modal"
      title="Send us your feedback"
    >
      {children || '💬'}
      
      {/* Pending count badge */}
      {pendingCount > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            backgroundColor: '#EF4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            animation: 'pulse 2s infinite'
          }}
        >
          {pendingCount > 9 ? '9+' : pendingCount}
        </div>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}
      </style>
    </button>
  );
};

export default FeedbackButton;
