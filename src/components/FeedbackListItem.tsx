import React from 'react';
import { Feedback } from '../types';
import { formatTimestamp } from '../utils';
import { FeedbackVoteButton } from './FeedbackVoteButton';
import { getCategoryDisplayName } from '../utils/categories';
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
  const hasVoted = feedback.voters?.includes(currentUserId || '') || false;

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
            <span className="text-yellow-600 text-sm">Pending...</span>
          )}
        </div>
        {enableVoting && (
          <FeedbackVoteButton 
            feedbackId={feedback.id} 
            votes={feedback.votes || 0}
            hasVoted={hasVoted}
            size="small"
          />
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
          <a href={feedback.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            📍 {new URL(feedback.url).pathname}
          </a>
        )}
      </div>
    </div>
  );
};

export default FeedbackListItem;
