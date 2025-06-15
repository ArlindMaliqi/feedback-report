import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import type { ThemeContextType } from '../types';

/**
 * Hook for accessing theme context
 * 
 * @returns Theme context with current theme and theme controls
 * @throws Error if used outside of ThemeProvider
 * 
 * @example
 * ```tsx
 * const { theme, isDark, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default useTheme;
