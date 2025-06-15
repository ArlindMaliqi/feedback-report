'use client';

import React from 'react';
import { useFeedback } from '../hooks/useFeedback';
import type { FeedbackButtonProps } from '../types';

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  position = 'bottom-right',
  className,
  children
}) => {
  const { openModal } = useFeedback();

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6', 
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const baseClasses = `
    fixed z-50 px-4 py-3 bg-blue-600 hover:bg-blue-700 
    text-white font-medium rounded-full shadow-lg 
    transition-all duration-200 ease-in-out
    hover:shadow-xl transform hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  `;

  return (
    <button
      onClick={openModal}
      className={`${baseClasses} ${positionClasses[position]} ${className || ''}`}
      aria-label="Open feedback form"
    >
      {children || (
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
          Feedback
        </span>
      )}
    </button>
  );
};

export default FeedbackButton;
