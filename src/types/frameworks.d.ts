/**
 * Type declarations for popular React frameworks and routing libraries
 * 
 * This module provides TypeScript declarations for various React frameworks and
 * routing libraries to ensure proper type safety when integrating the feedback
 * widget with different React-based applications and frameworks.
 * 
 * These type definitions are designed for development use only and are not
 * published as part of the package. They provide IntelliSense support and
 * type checking when using the feedback widget with framework-specific features.
 * 
 * Supported Frameworks:
 * - Remix (Full-stack React framework)
 * - React Router (Client-side routing)
 * - Gatsby (Static site generator)
 * - Next.js (Full-stack React framework)
 * 
 * @module types/frameworks
 * @version 1.0.0
 * @author ArlindMaliqi
 * @since 2.0.0
 * 
 * @example Usage in Remix application
 * ```typescript
 * import { useLocation } from '@remix-run/react';
 * import { FeedbackWidget } from 'react-feedback-report-widget';
 * 
 * export default function App() {
 *   const location = useLocation();
 *   
 *   return (
 *     <FeedbackWidget
 *       config={{
 *         apiEndpoint: '/api/feedback',
 *         collectUrl: true,
 *         metadata: { route: location.pathname }
 *       }}
 *     />
 *   );
 * }
 * ```
 */

/**
 * Remix framework declarations for React full-stack applications
 * 
 * @see {@link https://remix.run/docs} Remix Documentation
 */
declare module '@remix-run/react' {
  /**
   * Hook for accessing current location in Remix applications
   * 
   * Returns information about the current URL and navigation state.
   * Essential for capturing context about where feedback was submitted.
   * 
   * @function useLocation
   * @returns {RemixLocation} Location object with URL information
   * 
   * @example Capturing route context
   * ```typescript
   * import { useLocation } from '@remix-run/react';
   * 
   * function FeedbackIntegration() {
   *   const location = useLocation();
   *   
   *   const handleFeedback = (feedback) => {
   *     const enrichedFeedback = {
   *       ...feedback,
   *       context: {
   *         pathname: location.pathname,
   *         search: location.search,
   *         hash: location.hash
   *       }
   *     };
   *     submitFeedback(enrichedFeedback);
   *   };
   *   
   *   return <FeedbackWidget onSubmit={handleFeedback} />;
   * }
   * ```
   */
  export function useLocation(): { 
    /** Current pathname (e.g., '/dashboard/settings') */
    pathname: string; 
    /** Query string parameters (e.g., '?tab=profile&sort=name') */
    search: string; 
    /** URL hash fragment (e.g., '#section-1') */
    hash: string; 
    /** Navigation state passed during routing */
    state: any 
  };
}

/**
 * React Router declarations for client-side routing
 * 
 * @see {@link https://reactrouter.com/docs} React Router Documentation
 */
declare module 'react-router-dom' {
  /**
   * Hook for accessing current location in React Router applications
   * 
   * Provides detailed information about the current route and navigation state.
   * 
   * @function useLocation
   * @returns {RouterLocation} Location object with URL and state information
   * 
   * @example Using location data for feedback context
   * ```typescript
   * import { useLocation } from 'react-router-dom';
   * 
   * function FeedbackButton() {
   *   const location = useLocation();
   *   
   *   const openFeedback = () => {
   *     const context = {
   *       page: location.pathname,
   *       params: new URLSearchParams(location.search).toString(),
   *       previousPage: location.state?.from,
   *       timestamp: Date.now()
   *     };
   *     openFeedbackModal({ context });
   *   };
   *   
   *   return <button onClick={openFeedback}>Feedback</button>;
   * }
   * ```
   */
  export function useLocation(): { 
    /** Current pathname */
    pathname: string; 
    /** URL search parameters */
    search: string; 
    /** URL hash fragment */
    hash: string; 
    /** State passed during navigation */
    state: any 
  };
}

/**
 * Gatsby framework declarations for static site generation
 * 
 * @see {@link https://www.gatsbyjs.com/docs/} Gatsby Documentation
 */
declare namespace Gatsby {
  /**
   * Analytics interface for tracking custom events in Gatsby applications
   * 
   * Provides methods for tracking user interactions and custom events.
   * Essential for tracking feedback-related analytics and user engagement.
   * 
   * @interface Analytics
   * @since 2.0.0
   * 
   * @example Tracking feedback events
   * ```typescript
   * import { trackCustomEvent } from 'gatsby';
   * 
   * const handleFeedbackSubmit = (feedback) => {
   *   trackCustomEvent({
   *     eventCategory: 'Feedback',
   *     eventAction: 'Submit',
   *     eventLabel: feedback.type,
   *     eventValue: feedback.priority === 'high' ? 10 : 5
   *   });
   * };
   * ```
   */
  interface Analytics {
    /**
     * Track a custom event in Gatsby analytics
     * 
     * Records custom user interactions and events for analytics purposes.
     * Particularly useful for tracking feedback widget usage patterns.
     * 
     * @param event - Event data to track
     * @param event.eventCategory - Category of the event (e.g., 'Feedback')
     * @param event.eventAction - Action performed (e.g., 'Submit', 'Open Modal')
     * @param event.eventValue - Optional descriptive label
     * @param [key: string] - Additional custom properties
     * 
     * @example Tracking feedback submissions
     * ```typescript
     * trackEvent({
     *   eventCategory: 'Feedback',
     *   eventAction: 'Submit',
     *   eventLabel: 'Bug Report',
     *   eventValue: 1,
     *   customProperty: 'mobile-user'
     * });
     * ```
     */
    trackEvent(event: {
      /** Category grouping for the event */
      eventCategory: string;
      /** Specific action that was performed */
      eventAction: string;
      /** Optional descriptive label */
      eventValue?: string;
      /** Additional custom properties */
      [key: string]: any;
    }): void;
  }
}

/**
 * Next.js framework declarations for full-stack React applications
 * 
 * @see {@link https://nextjs.org/docs} Next.js Documentation
 */
declare namespace NextJS {
  /**
   * Router interface for navigation and route information in Next.js
   * 
   * Provides access to routing information and navigation methods.
   * Essential for enhancing feedback submissions with routing context.
   * 
   * @interface Router
   * @since 2.0.0
   * 
   * @example Using router for feedback context
   * ```typescript
   * import { useRouter } from 'next/router';
   * 
   * function FeedbackSection() {
   *   const router: NextJS.Router = useRouter();
   *   
   *   const submitFeedback = async (feedback) => {
   *     const contextualFeedback = {
   *       ...feedback,
   *       metadata: {
   *         route: router.pathname,
   *         dynamicRoute: router.asPath,
   *         queryParams: router.query,
   *         locale: router.locale
   *       }
   *     };
   *     
   *     await fetch('/api/feedback', {
   *       method: 'POST',
   *       body: JSON.stringify(contextualFeedback)
   *     });
   *   };
   *   
   *   return <FeedbackWidget onSubmit={submitFeedback} />;
   * }
   * ```
   */
  interface Router {
    /** 
     * Current pathname (route pattern)
     * @example '/products/[id]' for dynamic routes
     */
    pathname: string;
    
    /** 
     * Query string parameters as an object
     * @example { id: '123', tab: 'reviews' }
     */
    query: Record<string, string>;
    
    /** 
     * Actual path as shown in browser
     * @example '/products/123?tab=reviews'
     */
    asPath: string;
    
    /**
     * Navigate to a new route programmatically
     * 
     * @param url - Target URL or route
     * @returns Promise that resolves when navigation completes
     * 
     * @example Navigate after feedback submission
     * ```typescript
     * router.push('/feedback/thank-you');
     * ```
     */
    push(url: string): Promise<boolean>;
  }
}
