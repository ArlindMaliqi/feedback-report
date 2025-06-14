/**
 * Type declarations for frameworks 
 * These type definitions are for development use only and not published
 */

// Remix
declare module '@remix-run/react' {
  export function useLocation(): { pathname: string; search: string; hash: string; state: any };
}

// React Router
declare module 'react-router-dom' {
  export function useLocation(): { pathname: string; search: string; hash: string; state: any };
}

// Gatsby
declare namespace Gatsby {
  interface Analytics {
    trackEvent(event: {
      eventCategory: string;
      eventAction: string;
      eventValue?: string;
      [key: string]: any;
    }): void;
  }
}

// Next.js
declare namespace NextJS {
  interface Router {
    pathname: string;
    query: Record<string, string>;
    asPath: string;
    push(url: string): Promise<boolean>;
  }
}
