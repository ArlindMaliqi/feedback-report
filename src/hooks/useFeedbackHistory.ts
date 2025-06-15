import { useMemo } from 'react';
import { useFeedback } from './useFeedback';
import type { Feedback } from '../types';

/**
 * Options for useFeedbackHistory hook
 */
interface FeedbackHistoryOptions {
  /** Maximum number of items to include in history */
  limit?: number;
  /** Filter function to include only certain feedback */
  filter?: (feedback: Feedback) => boolean;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Grouped feedback by date
 */
interface FeedbackGroup {
  /** Date in ISO format */
  date: string;
  /** Formatted date string */
  formattedDate: string;
  /** Feedback items for this date */
  items: Feedback[];
}

/**
 * Hook to access and manage feedback history
 * 
 * Provides access to the user's feedback history with filtering,
 * sorting, and grouping capabilities.
 * 
 * @param options - Configuration options
 * @returns Feedback history utilities
 * 
 * @example
 * ```tsx
 * function FeedbackHistory() {
 *   const { 
 *     feedbackItems, 
 *     groupedByDate,
 *     mostVoted
 *   } = useFeedbackHistory({
 *     limit: 10,
 *     filter: (item) => item.type === 'bug'
 *   });
 *   
 *   return (
 *     <div>
 *       <h2>Your Recent Bug Reports</h2>
 *       <ul>
 *         {feedbackItems.map(item => (
 *           <li key={item.id}>{item.message}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFeedbackHistory(options: FeedbackHistoryOptions = {}) {
  const { feedbacks = [] } = useFeedback();
  const { limit, filter, sortDirection = 'desc' } = options;
  
  // Process the feedback items with filtering and sorting
  const feedbackItems = useMemo(() => {
    let items = [...(feedbacks || [])];
    
    // Apply filter if provided
    if (filter) {
      items = items.filter(filter);
    }
    
    // Sort by timestamp
    items.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    // Apply limit if provided
    if (limit && limit > 0) {
      items = items.slice(0, limit);
    }
    
    return items;
  }, [feedbacks, filter, limit, sortDirection]);
  
  // Group feedback by date
  const groupedByDate = useMemo(() => {
    const groups: FeedbackGroup[] = [];
    const groupMap = new Map<string, Feedback[]>();
    
    feedbackItems.forEach(item => {
      const date = new Date(item.timestamp);
      const dateString = date.toISOString().split('T')[0];
      
      if (!groupMap.has(dateString)) {
        groupMap.set(dateString, []);
      }
      
      groupMap.get(dateString)?.push(item);
    });
    
    // Create the groups array
    groupMap.forEach((items, date) => {
      groups.push({
        date,
        formattedDate: new Date(date).toLocaleDateString(),
        items
      });
    });
    
    // Sort groups by date
    groups.sort((a, b) => {
      return sortDirection === 'desc' 
        ? b.date.localeCompare(a.date) 
        : a.date.localeCompare(b.date);
    });
    
    return groups;
  }, [feedbackItems, sortDirection]);
  
  // Get most voted feedback items
  const mostVoted = useMemo(() => {
    return [...feedbackItems]
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, limit || feedbackItems.length);
  }, [feedbackItems, limit]);
  
  // Get items by status
  const getByStatus = (status: Feedback['submissionStatus']) => {
    return feedbackItems.filter(item => item.submissionStatus === status);
  };
  
  // Get items by type
  const getByType = (type: Feedback['type']) => {
    return feedbackItems.filter(item => item.type === type);
  };
  
  return {
    feedbackItems,
    groupedByDate,
    mostVoted,
    getByStatus,
    getByType,
    pendingItems: getByStatus('pending'),
    syncedItems: getByStatus('submitted'), // Fix: use 'submitted' instead of 'synced'
    failedItems: getByStatus('failed')
  };
}

export default useFeedbackHistory;
