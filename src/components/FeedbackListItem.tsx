import React from 'react';
import { Feedback } from '../types';
import { useTheme } from '../hooks/useTheme';

/**
 * Props for the FeedbackListItem component
 */
interface FeedbackListItemProps {
  /** The feedback item to display */
  feedback: Feedback;
  /** Whether voting is enabled */
  enableVoting?: boolean;
  /** ID of the current user for checking votes */
  currentUserId?: string;
  /** Available categories for display */
  categories?: any[];
}

/**
 * Component that displays a single feedback item
 * 
 * Shows feedback details with optional voting capabilities.
 * 
 * @param props - Component props
 */
export const FeedbackListItem: React.FC<FeedbackListItemProps> = ({
  feedback,
  enableVoting = false,
  currentUserId,
  categories = []
}) => {
  const { theme } = useTheme();
  // Fix: Use votedBy array to check if user has voted
  const hasVoted = feedback.votedBy?.includes(currentUserId || '') || false;

  // Get category display name if available
  const categoryDisplay = feedback.category && categories.length > 0
    ? getCategoryDisplayName(categories, feedback.category, feedback.subcategory)
    : feedback.type || 'Other';

  // Base styles with theme support
  const styles = {
    container: {
      borderRadius: '8px',
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
    title: {
      fontSize: '1rem',
      fontWeight: 'bold' as const,
      margin: 0,
      color: theme === 'dark' ? '#e5e7eb' : 'inherit',
    },
    meta: {
      fontSize: '0.75rem',
      color: theme === 'dark' ? '#9ca3af' : '#718096',
      marginBottom: '0.5rem',
    },
    message: {
      margin: '0.5rem 0',
      whiteSpace: 'pre-wrap' as const,
      color: theme === 'dark' ? '#e5e7eb' : 'inherit',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '0.5rem',
      fontSize: '0.75rem',
      color: theme === 'dark' ? '#9ca3af' : '#718096',
    },
    badge: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
      color: theme === 'dark' ? '#e5e7eb' : '#4b5563',
    },
    attachmentIcon: {
      marginLeft: '0.25rem',
    },
    userInfo: {
      fontSize: '0.75rem',
      fontStyle: 'italic' as const,
    },
    offline: {
      color: theme === 'dark' ? '#f87171' : '#dc2626',
      fontSize: '0.75rem',
      marginLeft: '0.5rem',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <span style={styles.badge}>
            {categoryDisplay}
          </span>
          {feedback.submissionStatus === 'pending' && (
            <span style={styles.offline}>Pending...</span>
          )}
        </div>
        {enableVoting && (
          <div>
            <button disabled={hasVoted}>
              👍 {feedback.votes || 0}
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.meta}>
        Submitted {formatTimestamp(feedback.timestamp)}
        {feedback.attachments && feedback.attachments.length > 0 && (
          <span style={styles.attachmentIcon} title={`${feedback.attachments.length} attachment(s)`}>
            📎 {feedback.attachments.length}
          </span>
        )}
      </div>
      
      <p style={styles.message}>
        {feedback.message}
      </p>
      
      {feedback.user?.name && (
        <div style={styles.userInfo}>
          By: {feedback.user.name} {feedback.user.email ? `(${feedback.user.email})` : ''}
        </div>
      )}
      
      <div style={styles.footer}>
        {feedback.url && (
          <a href={feedback.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            📍 {new URL(feedback.url).pathname}
          </a>
        )}
      </div>
    </div>
  );
};

export default FeedbackListItem;

// Add local utility function since it's missing from utils
const formatTimestamp = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Add missing utility function
const getCategoryDisplayName = (categories: any[], categoryId?: string, subcategoryId?: string): string => {
  if (!categoryId || !categories.length) return 'Other';
  
  const category = categories.find(cat => cat.id === categoryId);
  if (!category) return categoryId;
  
  if (subcategoryId && category.subcategories) {
    const subcategory = category.subcategories.find((sub: any) => sub.id === subcategoryId);
    if (subcategory) return `${category.name} - ${subcategory.name}`;
  }
  
  return category.name;
};

