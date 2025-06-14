/**
 * SSR-safe component wrapper for client-side only features
 * @module core/SSRSafeComponent
 */
import React, { useEffect, useState, ReactNode } from 'react';

/**
 * Props for SSRSafeComponent
 */
interface SSRSafeComponentProps {
  /** Component to render on the client side */
  children: ReactNode;
  /** Fallback component to render during SSR */
  fallback?: ReactNode;
  /** Whether to show a loading state during hydration */
  showLoader?: boolean;
}

/**
 * A wrapper component that ensures client-side only components are SSR-safe
 * 
 * This component prevents hydration mismatches by only rendering children
 * after the component has mounted on the client side.
 * 
 * @param props - Component props
 * @returns SSR-safe component wrapper
 * 
 * @example
 * ```tsx
 * <SSRSafeComponent fallback={<div>Loading feedback...</div>}>
 *   <FeedbackWidget />
 * </SSRSafeComponent>
 * ```
 */
export const SSRSafeComponent: React.FC<SSRSafeComponentProps> = ({
  children,
  fallback = null,
  showLoader = false
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR or before hydration, show fallback
  if (!isMounted) {
    return (
      <>
        {showLoader && (
          <div 
            style={{ 
              display: 'inline-block', 
              opacity: 0.6,
              fontSize: '0.875rem',
              padding: '0.5rem'
            }}
            aria-live="polite"
          >
            Loading...
          </div>
        )}
        {fallback}
      </>
    );
  }

  // On client side after hydration, render children
  return <>{children}</>;
};

export default SSRSafeComponent;
