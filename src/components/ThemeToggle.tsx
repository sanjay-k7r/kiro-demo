import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';

/**
 * ThemeToggle component for switching between light and dark themes.
 * 
 * - Displays Sun icon when in dark mode (to switch to light)
 * - Displays Moon icon when in light mode (to switch to dark)
 * - Uses smooth CSS transitions for icon changes
 * 
 * Requirements: 7.2, 7.5
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    // Toggle between light and dark modes
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative overflow-hidden transition-colors duration-300"
    >
      {/* Sun icon - visible in dark mode (to switch to light) */}
      <Sun
        className={`h-5 w-5 transition-all duration-300 ease-in-out ${
          resolvedTheme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0'
        }`}
        aria-hidden="true"
      />
      {/* Moon icon - visible in light mode (to switch to dark) */}
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ease-in-out ${
          resolvedTheme === 'light'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
