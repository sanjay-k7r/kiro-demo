import { useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Button } from './ui/button';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useTrollBehavior } from '../hooks/useTrollBehavior';
import { useTrollButtonContext } from './TrollButtonContext';

/**
 * TROLL: Props for the TrollDoneButton component
 * This button is intentionally broken with multiple troll behaviors
 * that make it frustrating to use.
 */
export interface TrollDoneButtonProps {
  onComplete: () => void;
  isCompleted: boolean;
  todoId: string; // TROLL: Unique ID to track which button is displaced
  onResetPosition?: () => void; // Called when position should reset
}

export interface TrollDoneButtonRef {
  resetPosition: () => void;
}

/**
 * TROLL: TrollDoneButton Component
 * 
 * This is the intentionally broken "Done" button with all the troll behaviors.
 * It's designed to be hilariously frustrating to use for demonstration purposes.
 * 
 * TROLL BEHAVIORS:
 * 1. Moves away on hover via CSS transform (Requirement 4.1)
 * 2. Slowly rotates with each click attempt (Requirement 4.6)
 * 3. Slowly shrinks in size with each click attempt (Requirement 4.7)
 * 4. Requires multiple clicks before accepting (Requirement 4.8)
 * 5. Shows confirmation dialogs with desperate messages (Requirements 4.2-4.5)
 * 6. Only marks complete after all troll requirements met (Requirement 4.9)
 * 
 * SECRET DEMO TRICK: Press Tab to focus the button, then Enter/Space to click it!
 * The button only escapes on mouse hover, not keyboard focus.
 * 
 * All troll behaviors are clearly marked with TROLL comments for easy identification
 * and removal during the demo.
 * 
 * @param onComplete - Callback when todo is finally marked complete (after all troll requirements)
 * @param isCompleted - Whether the todo is already completed (hides button if true)
 */
export const TrollDoneButton = forwardRef<TrollDoneButtonRef, TrollDoneButtonProps>(
  function TrollDoneButton({ onComplete, isCompleted, todoId }, ref) {
  // TROLL: Get all the troll behavior state and handlers from the hook
  const {
    // rotation and scale are available but not currently used in the UI
    // They can be re-enabled for additional troll effects
    hoverOffset,
    handleClick,
    handleHover,
    isComplete,
    currentMessage,
    confirmDialog,
    cancelDialog,
    resetHoverOffset,
  } = useTrollBehavior();

  // TROLL: Get the global context to track which button is displaced
  const { isActiveButton, setActiveButton } = useTrollButtonContext();
  
  // TROLL: Check if THIS button is the currently displaced one
  const isDisplaced = isActiveButton(todoId);

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    resetPosition: () => {
      resetHoverOffset();
    }
  }), [resetHoverOffset]);

  // TROLL: When all troll requirements are met, finally call onComplete
  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // TROLL: Handle hover - only this button gets displaced, others return to normal
  const handleButtonHover = useCallback(() => {
    // TROLL: Set this button as the active displaced button
    setActiveButton(todoId);
    // TROLL: Generate new escape offset for this button
    handleHover();
  }, [setActiveButton, todoId, handleHover]);

  // TROLL: Don't render if already completed
  if (isCompleted) {
    return null;
  }

  // TROLL: Build the CSS transform string - just horizontal movement
  const transformStyle = {
    transform: `translateX(${isDisplaced ? hoverOffset.x : 0}px)`,
    // TROLL: Smooth ease-out transition
    transition: 'transform 0.3s ease-out',
  };

  return (
    <>
      {/* TROLL: The button that runs away and transforms */}
      {/* SECRET: Use Tab to focus, then Enter to click - bypasses the hover escape! */}
      <Button
        variant="outline"
        size="default"
        onClick={handleClick}
        onMouseEnter={handleButtonHover}
        style={transformStyle}
        aria-label="Mark as complete"
        data-testid="troll-done-button"
        // TROLL: Relative positioning so transforms work correctly
        // TROLL: Bold accent color to make it stand out - the star of the show!
        // Comic-style: Thick border, bold shadow, slightly tilted for dynamic feel
        className="relative bg-yellow-400 text-black border-[3px] border-black hover:bg-yellow-300 hover:text-black dark:bg-yellow-400 dark:text-black dark:border-black dark:hover:bg-yellow-300 font-black text-base px-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] rotate-[-1deg] hover:rotate-[0deg] transition-all !outline-none !ring-0 focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0"
      >
        DONE!
      </Button>

      {/* TROLL: Confirmation dialog that appears after enough clicks */}
      <ConfirmationDialog
        isOpen={currentMessage !== null}
        message={currentMessage || ''}
        onConfirm={confirmDialog}
        onCancel={cancelDialog}
      />
    </>
  );
});
