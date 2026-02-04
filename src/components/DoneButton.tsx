import type { JSX } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

/**
 * Props for the DoneButton component
 */
export interface DoneButtonProps {
  /** Callback invoked when button is clicked */
  onComplete: () => void;
  /** Whether the todo is already completed (hides button if true) */
  isCompleted: boolean;
}

/**
 * DoneButton Component
 * 
 * A standard, user-friendly button for marking todos as complete.
 * Replaces the troll button with straightforward single-click behavior.
 * 
 * Features:
 * - Single click triggers completion immediately
 * - Static position (no hover evasion)
 * - Consistent size and appearance
 * - Full keyboard accessibility
 * - Comic-style visual design consistent with app theme
 * 
 * @param onComplete - Callback when todo is marked complete
 * @param isCompleted - Whether the todo is already completed (hides button if true)
 */
export function DoneButton({ onComplete, isCompleted }: DoneButtonProps): JSX.Element | null {
  // Don't render if already completed (Requirement 4.2)
  if (isCompleted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="default"
      onClick={onComplete}
      aria-label="Mark as complete"
      data-testid="done-button"
      className={cn(
        // Comic-style: Yellow background with black border and text
        'bg-yellow-400 text-black border-[3px] border-black',
        // Hover state
        'hover:bg-yellow-300 hover:text-black',
        // Dark mode (same styling for consistency)
        'dark:bg-yellow-400 dark:text-black dark:border-black dark:hover:bg-yellow-300',
        // Typography
        'font-black text-base px-6',
        // Comic-style shadow effect
        'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]',
        'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
        'active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
        'active:translate-x-[3px] active:translate-y-[3px]',
        // Smooth transitions
        'transition-all',
        // Remove focus ring (using shadow for visual feedback instead)
        '!outline-none !ring-0 focus:!outline-none focus:!ring-0',
        'focus-visible:!outline-none focus-visible:!ring-0'
      )}
    >
      Done
    </Button>
  );
}
