import { useMemo, useCallback } from 'react';
import { useFeedback } from './useFeedback';
import type { Feedback } from '../types';

/**
 * Feedback counts by type
 */
interface FeedbackTypeCounts {
  /** Count of bug feedback */
  bug: number;
  /** Count of feature feedback */
  feature: number;
  /** Count of improvement feedback */
  improvement: number;
  /** Count of other feedback */
  other: number;
  /** Count of all feedback */
  total: number;
}

/**
 * Feedback statistics with various metrics
 */
interface FeedbackStatistics {
  /** Total number of feedback items */
  totalCount: number;
  /** Number of feedback items by type */
  countsByType: FeedbackTypeCounts;
  /** Average votes per feedback */
  averageVotes: number;
  /** Total number of votes across all feedback */
  totalVotes: number;
  /** Feedback with the most votes */
  mostVoted: Feedback | null;
  /** Number of pending feedback items */
  pendingCount: number;
  /** Submission rate (percentage of successfully submitted feedback) */
  submissionRate: number;
  /** Average feedback length in characters */
  averageLength: number;
}

/**
 * Hook for analyzing feedback data
 * 
 * Provides statistics and analytics about the collected feedback.
 * 
 * @returns Statistics and analytics functions
 * 
 * @example
 * ```tsx
 * function FeedbackAnalytics() {
 *   const { 
 *     statistics,
 *     getRecentTrends,
 *     getFeedbackDistribution 
 *   } = useFeedbackAnalytics();
 *   
 *   return (
 *     <div>
 *       <h2>Feedback Statistics</h2>
 *       <p>Total feedback: {statistics.totalCount}</p>
 *       <p>Bugs reported: {statistics.countsByType.bug}</p>
 *       <p>Feature requests: {statistics.countsByType.feature}</p>
 *       <p>Average votes: {statistics.averageVotes.toFixed(1)}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFeedbackAnalytics() {
  const { feedbacks = [] } = useFeedback();
  
  // Calculate overall statistics
  const statistics = useMemo<FeedbackStatistics>(() => {
    // Skip calculation if no feedback
    if (!feedbacks || feedbacks.length === 0) {
      return {
        totalCount: 0,
        countsByType: { bug: 0, feature: 0, improvement: 0, other: 0, total: 0 },
        averageVotes: 0,
        totalVotes: 0,
        mostVoted: null,
        pendingCount: 0,
        submissionRate: 0,
        averageLength: 0
      };
    }
    
    // Initialize counters
    let bugCount = 0;
    let featureCount = 0;
    let improvementCount = 0;
    let otherCount = 0;
    let totalVotes = 0;
    let pendingCount = 0;
    let totalLength = 0;
    let mostVotedItem: Feedback | null = null;
    let maxVotes = -1;
    
    // Process each feedback item
    feedbacks.forEach(feedback => {
      // Count by type
      switch (feedback.type) {
        case 'bug':
          bugCount++;
          break;
        case 'feature':
          featureCount++;
          break;
        case 'improvement':
          improvementCount++;
          break;
        default:
          otherCount++;
          break;
      }
      
      // Track votes
      const votes = feedback.votes || 0;
      totalVotes += votes;
      
      // Track most voted
      if (votes > maxVotes) {
        maxVotes = votes;
        mostVotedItem = feedback;
      }
      
      // Track pending items
      if (feedback.submissionStatus === 'pending') {
        pendingCount++;
      }
      
      // Track message length
      totalLength += feedback.message.length;
    });
    
    // Calculate derived statistics
    const totalCount = feedbacks.length;
    const averageVotes = totalCount > 0 ? totalVotes / totalCount : 0;
    const submissionRate = totalCount > 0 
      ? ((totalCount - pendingCount) / totalCount) * 100 
      : 0;
    const averageLength = totalCount > 0 ? totalLength / totalCount : 0;
    
    return {
      totalCount,
      countsByType: {
        bug: bugCount,
        feature: featureCount,
        improvement: improvementCount,
        other: otherCount,
        total: totalCount
      },
      averageVotes,
      totalVotes,
      mostVoted: mostVotedItem,
      pendingCount,
      submissionRate,
      averageLength
    };
  }, [feedbacks]);

  /**
   * Calculates feedback trends over time
   * @param days - Number of days to analyze
   * @returns Feedback counts by day
   */
  const getRecentTrends = (days: number = 30) => {
    const result: Record<string, number> = {};
    const now = new Date();
    
    // Initialize with zeros for all days
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      result[dateString] = 0;
    }
    
    // Count feedback by date
    if (feedbacks) {
      feedbacks.forEach(feedback => {
        const date = new Date(feedback.timestamp);
        const dateString = date.toISOString().split('T')[0];
        
        // Only include dates within the specified range
        const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo <= days && result[dateString] !== undefined) {
          result[dateString]++;
        }
      });
    }
    
    return result;
  };

  /**
   * Calculates the distribution of feedback by a property
   * @param property - Property to group by
   * @returns Distribution counts
   */
  const getFeedbackDistribution = <T extends keyof Feedback>(property: T) => {
    const distribution: Record<string, number> = {};
    
    if (feedbacks) {
      feedbacks.forEach(feedback => {
        const value = String(feedback[property] || 'unknown');
        distribution[value] = (distribution[value] || 0) + 1;
      });
    }
    
    return distribution;
  };

  // New callback to get pending count
  const getPendingCount = useCallback(() => {
    return (feedbacks || []).filter(feedback => 
      feedback.submissionStatus === 'pending'
    ).length;
  }, [feedbacks]);

  return {
    statistics,
    getRecentTrends,
    getFeedbackDistribution,
    getPendingCount,
    // Helper method to get feedback items by type
    getByType: (type: Feedback['type']) => (feedbacks || []).filter(f => f.type === type),
    // Helper method to calculate votes distribution
    getVotesDistribution: () => {
      return (feedbacks || []).reduce((acc, item) => {
        const votes = item.votes || 0;
        acc[votes] = (acc[votes] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
    }
  };
}

export default useFeedbackAnalytics;
