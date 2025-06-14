import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import type { ThemeContextType } from '../types';

/**
 * Custom hook to access the current theme
 * 
 * This hook provides access to the current theme setting (light or dark)
 * based on system preferences or website theme settings.
 * 
 * @returns ThemeContextType object containing theme state
 * @throws Error if used outside of ThemeProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { theme } = useTheme();
 *   
 *   return (
 *     <div>
 *       Current theme: {theme}
 *     </div>
 *   );
 * }
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
