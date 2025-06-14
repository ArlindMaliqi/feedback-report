import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ThemeContextType, ThemePreference } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  /** Initial theme preference */
  initialTheme?: ThemePreference;
}

/**
 * Provider component for theme management
 * 
 * This component detects and responds to system or website theme settings.
 * It doesn't provide UI controls but ensures the feedback components
 * match the user's preferred theme.
 * 
 * @param props - Component props
 * @param props.children - Child components
 * @param props.initialTheme - Initial theme preference ('light', 'dark', or 'system')
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'system' 
}) => {
  // Get system preference for dark mode
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Detect website theme if available (by checking for theme classes on document body or html)
  const getWebsiteTheme = (): 'light' | 'dark' | null => {
    if (typeof document === 'undefined') return null;
    
    const html = document.documentElement;
    const body = document.body;
    
    // Check for common theme class patterns
    if (
      body.classList.contains('dark') || 
      html.classList.contains('dark') ||
      body.dataset.theme === 'dark' ||
      html.dataset.theme === 'dark' ||
      body.getAttribute('data-bs-theme') === 'dark' || // Bootstrap 5
      document.documentElement.style.getPropertyValue('--is-dark') === 'true' // CSS variable pattern
    ) {
      return 'dark';
    }
    
    if (
      body.classList.contains('light') || 
      html.classList.contains('light') ||
      body.dataset.theme === 'light' ||
      html.dataset.theme === 'light' ||
      body.getAttribute('data-bs-theme') === 'light'
    ) {
      return 'light';
    }
    
    return null;
  };

  // Get initial theme based on preference
  const getInitialTheme = (): 'light' | 'dark' => {
    if (initialTheme !== 'system') {
      return initialTheme;
    }
    
    // First check website theme
    const websiteTheme = getWebsiteTheme();
    if (websiteTheme) {
      return websiteTheme;
    }
    
    // Fall back to system preference
    return getSystemTheme();
  };

  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme());
  const [preference, setPreference] = useState<ThemePreference>(initialTheme);

  // Listen for system theme changes
  useEffect(() => {
    if (preference !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if website doesn't specify a theme
      if (!getWebsiteTheme()) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Older implementations
    else if ('addListener' in mediaQuery) {
      // @ts-ignore - For older browsers
      mediaQuery.addListener(handleChange);
      return () => {
        // @ts-ignore - For older browsers
        mediaQuery.removeListener(handleChange);
      };
    }
  }, [preference]);

  // Listen for website theme changes
  useEffect(() => {
    if (preference !== 'system') return;

    // Use MutationObserver to detect class changes on body or html
    const observer = new MutationObserver((mutations) => {
      const websiteTheme = getWebsiteTheme();
      if (websiteTheme) {
        setThemeState(websiteTheme);
      } else {
        setThemeState(getSystemTheme());
      }
    });

    // Observe both html and body for class and attribute changes
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme', 'data-bs-theme'] 
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'data-theme', 'data-bs-theme'] 
    });

    return () => observer.disconnect();
  }, [preference]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setThemeState(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      setPreference(newTheme);
      return newTheme;
    });
  }, []);

  // Set specific theme
  const setTheme = useCallback((newTheme: ThemePreference) => {
    setPreference(newTheme);
    
    if (newTheme === 'system') {
      setThemeState(getSystemTheme());
    } else {
      setThemeState(newTheme);
    }
  }, []);

  // Provide context, but don't include toggleTheme since we're not exposing that
  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
