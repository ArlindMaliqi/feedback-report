import React, { createContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import type { ThemeContextType, ThemePreference } from '../types';

/**
 * Context for theme management throughout the application
 * @public
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Props for the ThemeProvider component
 */
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
 * It provides theme context to all child components, enabling them to adapt
 * their appearance based on the current theme.
 * 
 * @param props - Component props
 * @param props.children - Child components
 * @param props.initialTheme - Initial theme preference ('light', 'dark', or 'system')
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider initialTheme="system">
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'system' 
}) => {
  /**
   * Gets system preference for dark mode
   * @returns Current system theme preference
   */
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  /**
   * Detects website theme if available
   * @returns Website theme or null if not detected
   */
  const getWebsiteTheme = useCallback((): 'light' | 'dark' | null => {
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
  }, []);

  /**
   * Gets initial theme based on preference
   * @returns Theme to initialize with
   */
  const getInitialTheme = useCallback((): 'light' | 'dark' => {
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
  }, [initialTheme, getWebsiteTheme, getSystemTheme]);

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
    
    return undefined;
  }, [preference, getWebsiteTheme]);

  // Listen for website theme changes
  useEffect(() => {
    if (preference !== 'system') return;

    // Use MutationObserver to detect class changes on body or html
    const observer = new MutationObserver(() => {
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
  }, [preference, getWebsiteTheme, getSystemTheme]);

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
      const websiteTheme = getWebsiteTheme();
      setThemeState(websiteTheme || getSystemTheme());
    } else {
      setThemeState(newTheme);
    }
  }, [getWebsiteTheme, getSystemTheme]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<ThemeContextType>(() => ({
    theme,
    toggleTheme,
    setTheme
  }), [theme, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
