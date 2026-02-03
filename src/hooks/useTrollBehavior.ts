import { useState, useCallback } from 'react';

// TROLL: Confirmation dialog messages that appear in sequence
export const TROLL_MESSAGES = [
  "Are you SURE?",
  "Really?",
  "But what if you're wrong?"
] as const;

// TROLL: Number of clicks required before completion is allowed
const REQUIRED_CLICKS = 1;

// TROLL: Rotation increment per click (degrees)
const ROTATION_INCREMENT = 15;

// TROLL: Scale decrement per click (shrinks button)
const SCALE_DECREMENT = 0.1;

// TROLL: Minimum scale (button won't shrink below this)
const MIN_SCALE = 0.5;

// TROLL: Hover escape offset range (pixels) - guaranteed to escape!
const HOVER_ESCAPE_MIN = 80;
const HOVER_ESCAPE_MAX = 120;

// TROLL: Maximum number of full escapes before button gets "tired"
const MAX_ESCAPES = 4;

// TROLL: Reduced movement after button is tired (much easier to catch)
const TIRED_ESCAPE_MIN = 15;
const TIRED_ESCAPE_MAX = 25;

export interface TrollState {
  clickCount: number;      // Number of clicks attempted
  rotation: number;        // Current rotation in degrees
  scale: number;           // Current scale (1.0 to 0.5)
  dialogStage: number;     // 0=none, 1="Are you SURE?", 2="Really?", 3="But what if you're wrong?"
  hoverEscapeOffset: {     // Offset to move button on hover
    x: number;
    y: number;
  };
  escapeDirection: number; // TROLL: Track direction to alternate left/right
  escapeCount: number;     // TROLL: Track how many times button has escaped
}

export interface UseTrollBehaviorReturn {
  clickCount: number;
  rotation: number;
  scale: number;
  hoverOffset: { x: number; y: number };
  dialogStage: number;
  handleClick: () => void;
  handleHover: () => void;
  resetTroll: () => void;
  resetHoverOffset: () => void;
  isComplete: boolean;
  currentMessage: string | null;
  confirmDialog: () => void;
  cancelDialog: () => void;
}

// TROLL: Generates a horizontal escape offset that ALWAYS escapes effectively
// Alternates direction and uses consistent distance for reliable demo behavior
// After MAX_ESCAPES, the button gets "tired" and moves much less
function generateEscapeOffset(currentDirection: number, escapeCount: number): { x: number; y: number; newDirection: number } {
  // TROLL: After max escapes, button gets tired and barely moves
  const isTired = escapeCount >= MAX_ESCAPES;
  const minDist = isTired ? TIRED_ESCAPE_MIN : HOVER_ESCAPE_MIN;
  const maxDist = isTired ? TIRED_ESCAPE_MAX : HOVER_ESCAPE_MAX;
  
  // TROLL: Calculate distance based on tiredness
  const distance = minDist + Math.random() * (maxDist - minDist);
  
  // TROLL: Alternate direction each time for predictable but frustrating behavior
  const newDirection = currentDirection * -1;
  
  return {
    x: newDirection * distance,
    y: 0,
    newDirection,
  };
}

/**
 * TROLL: Custom hook that encapsulates all the intentionally bad UX behaviors
 * for the Done button. This includes:
 * - Tracking click count (requires 3+ clicks)
 * - Calculating rotation angle (increases with each click)
 * - Calculating shrink scale (decreases with each click)
 * - Generating random hover escape offset
 * - Managing confirmation dialog progression
 */
export function useTrollBehavior(): UseTrollBehaviorReturn {
  // TROLL: State to track all the trolling behaviors
  const [state, setState] = useState<TrollState>({
    clickCount: 0,
    rotation: 0,
    scale: 1.0,
    dialogStage: 0,
    hoverEscapeOffset: { x: 0, y: 0 },
    escapeDirection: 1, // TROLL: Start going right, will alternate
    escapeCount: 0,     // TROLL: Track escapes to know when button is tired
  });

  // TROLL: Track if all requirements have been met for completion
  const [isComplete, setIsComplete] = useState(false);

  // TROLL: Handle click on the Done button
  const handleClick = useCallback(() => {
    // TROLL: Don't do anything if already complete
    if (isComplete) return;

    setState((prev) => {
      const newClickCount = prev.clickCount + 1;
      
      // TROLL: Calculate new rotation (increases by 15 degrees per click)
      const newRotation = prev.rotation + ROTATION_INCREMENT;
      
      // TROLL: Calculate new scale (decreases by 0.1 per click, min 0.5)
      const newScale = Math.max(MIN_SCALE, prev.scale - SCALE_DECREMENT);
      
      // TROLL: If we've reached the required clicks, start showing dialogs
      if (newClickCount >= REQUIRED_CLICKS && prev.dialogStage === 0) {
        return {
          ...prev,
          clickCount: newClickCount,
          rotation: newRotation,
          scale: newScale,
          dialogStage: 1, // TROLL: Start dialog progression
        };
      }
      
      return {
        ...prev,
        clickCount: newClickCount,
        rotation: newRotation,
        scale: newScale,
      };
    });
  }, [isComplete]);

  // TROLL: Handle hover on the Done button - makes it run away!
  const handleHover = useCallback(() => {
    // TROLL: Don't escape if already complete
    if (isComplete) return;

    setState((prev) => {
      const escape = generateEscapeOffset(prev.escapeDirection, prev.escapeCount);
      return {
        ...prev,
        hoverEscapeOffset: { x: escape.x, y: escape.y },
        escapeDirection: escape.newDirection,
        escapeCount: prev.escapeCount + 1, // TROLL: Track escape count
      };
    });
  }, [isComplete]);

  // TROLL: Confirm the current dialog and progress to the next one
  const confirmDialog = useCallback(() => {
    setState((prev) => {
      const newDialogStage = prev.dialogStage + 1;
      
      // TROLL: If we've confirmed all 3 dialogs, mark as complete
      if (newDialogStage > TROLL_MESSAGES.length) {
        setIsComplete(true);
        return {
          ...prev,
          dialogStage: 0, // TROLL: Reset dialog stage
        };
      }
      
      return {
        ...prev,
        dialogStage: newDialogStage,
      };
    });
  }, []);

  // TROLL: Cancel the dialog and reset dialog stage (but keep click count!)
  const cancelDialog = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dialogStage: 0, // TROLL: Reset dialog stage, user has to click again!
    }));
  }, []);

  // TROLL: Reset all troll state (useful for testing or after completion)
  const resetTroll = useCallback(() => {
    setState({
      clickCount: 0,
      rotation: 0,
      scale: 1.0,
      dialogStage: 0,
      hoverEscapeOffset: { x: 0, y: 0 },
      escapeDirection: 1,
      escapeCount: 0,
    });
    setIsComplete(false);
  }, []);

  // TROLL: Reset just the hover offset (when another button becomes active)
  const resetHoverOffset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hoverEscapeOffset: { x: 0, y: 0 },
      escapeDirection: 1,
      escapeCount: 0,
    }));
  }, []);

  // TROLL: Get the current dialog message based on stage
  const currentMessage = state.dialogStage > 0 && state.dialogStage <= TROLL_MESSAGES.length
    ? TROLL_MESSAGES[state.dialogStage - 1]
    : null;

  return {
    clickCount: state.clickCount,
    rotation: state.rotation,
    scale: state.scale,
    hoverOffset: state.hoverEscapeOffset,
    dialogStage: state.dialogStage,
    handleClick,
    handleHover,
    resetTroll,
    resetHoverOffset,
    isComplete,
    currentMessage,
    confirmDialog,
    cancelDialog,
  };
}
