import React, { useState } from 'react';
import { useFeedback } from '../hooks/useFeedback';
import { useTheme } from '../hooks/useTheme';

/**
 * Props for the FeedbackVoteButton component
 */
interface FeedbackVoteButtonProps {
  /** ID of the feedback to vote for */
  feedbackId: string;
  /** Current number of votes */
  votes: number;
  /** Whether the user has already voted */
  hasVoted?: boolean;
  /** Size of the button */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Button component for upvoting feedback items
 * 
 * Allows users to upvote feedback items to indicate their importance
 * or agreement with the feedback.
 * 
 * @param props - Component props
 */
export const FeedbackVoteButton: React.FC<FeedbackVoteButtonProps> = ({
  feedbackId,
  votes = 0,
  hasVoted = false,
  size = 'medium'
}) => {
  const { voteFeedback } = useFeedback();
  const { theme } = useTheme();
  const [isVoting, setIsVoting] = useState(false);

  // Get size-specific values
  const getSizeValues = () => {
    switch (size) {
      case 'small':
        return {
          height: '24px',
          fontSize: '0.75rem',
          iconSize: '0.75rem',
          padding: '0 0.5rem',
        };
      case 'large':
        return {
          height: '36px',
          fontSize: '1rem',
          iconSize: '1.25rem',
          padding: '0 1rem',
        };
      case 'medium':
      default:
        return {
          height: '30px',
          fontSize: '0.875rem',
          iconSize: '1rem',
          padding: '0 0.75rem',
        };
    }
  };

  const sizeValues = getSizeValues();

  // Handle vote click
  const handleVoteClick = async () => {
    if (hasVoted || isVoting) return;
    
    setIsVoting(true);
    try {
      if (!voteFeedback) {
        console.warn('voteFeedback function not available');
        return;
      }
      
      await voteFeedback(feedbackId, 'up');
    } catch (error) {
      console.error('Error voting for feedback:', error);
    } finally {
      setIsVoting(false);
    }
  };

  // Base styles with theme support
  const styles = {
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      height: sizeValues.height,
      padding: sizeValues.padding,
      borderRadius: '9999px',
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e2e8f0'}`,
      backgroundColor: hasVoted 
        ? (theme === 'dark' ? '#3b82f6' : '#dbeafe') 
        : (theme === 'dark' ? '#1f2937' : 'white'),
      color: hasVoted 
        ? (theme === 'dark' ? 'white' : '#2563eb') 
        : (theme === 'dark' ? '#e5e7eb' : '#4b5563'),
      cursor: hasVoted ? 'default' : 'pointer',
      fontSize: sizeValues.fontSize,
      transition: 'all 0.2s ease',
      userSelect: 'none' as const,
      opacity: isVoting ? 0.7 : 1,
    },
    icon: {
      fontSize: sizeValues.iconSize,
    },
    count: {
      fontWeight: hasVoted ? 'bold' : 'normal',
    }
  };

  return (
    <button
      type="button"
      onClick={handleVoteClick}
      disabled={hasVoted || isVoting}
      style={styles.button}
      title={hasVoted ? "You've already voted" : "Upvote this feedback"}
      aria-label={hasVoted ? "You've already voted" : "Upvote this feedback"}
      aria-pressed={hasVoted}
    >
      <span style={styles.icon} aria-hidden="true">
        {hasVoted ? '★' : '☆'}
      </span>
      <span style={styles.count}>{votes}</span>
    </button>
  );
};

export default FeedbackVoteButton;
