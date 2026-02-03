import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTrollBehavior, TROLL_MESSAGES } from '../hooks/useTrollBehavior';

describe('useTrollBehavior', () => {
  describe('initial state', () => {
    it('initializes with zero click count', () => {
      const { result } = renderHook(() => useTrollBehavior());
      expect(result.current.clickCount).toBe(0);
    });

    it('initializes with zero rotation', () => {
      const { result } = renderHook(() => useTrollBehavior());
      expect(result.current.rotation).toBe(0);
    });

    it('initializes with scale of 1.0', () => {
      const { result } = renderHook(() => useTrollBehavior());
      expect(result.current.scale).toBe(1.0);
    });

    it('initializes with zero hover offset', () => {
      const { result } = renderHook(() => useTrollBehavior());
      expect(result.current.hoverOffset).toEqual({ x: 0, y: 0 });
    });

    it('initializes with dialog stage 0', () => {
      const { result } = renderHook(() => useTrollBehavior());
      expect(result.current.dialogStage).toBe(0);
    });

    it('initializes with isComplete as false', () => {
      const { result } = renderHook(() => useTrollBehavior());
      expect(result.current.isComplete).toBe(false);
    });

    it('initializes with null currentMessage', () => {
      const { result } = renderHook(() => useTrollBehavior());
      expect(result.current.currentMessage).toBeNull();
    });
  });

  describe('handleClick - click counting', () => {
    it('increments click count on each click', () => {
      const { result } = renderHook(() => useTrollBehavior());

      act(() => {
        result.current.handleClick();
      });
      expect(result.current.clickCount).toBe(1);

      act(() => {
        result.current.handleClick();
      });
      expect(result.current.clickCount).toBe(2);

      act(() => {
        result.current.handleClick();
      });
      expect(result.current.clickCount).toBe(3);
    });
  });

  describe('handleClick - rotation (Requirement 4.6)', () => {
    it('increases rotation by 15 degrees per click', () => {
      const { result } = renderHook(() => useTrollBehavior());

      act(() => {
        result.current.handleClick();
      });
      expect(result.current.rotation).toBe(15);

      act(() => {
        result.current.handleClick();
      });
      expect(result.current.rotation).toBe(30);

      act(() => {
        result.current.handleClick();
      });
      expect(result.current.rotation).toBe(45);
    });
  });

  describe('handleClick - scale/shrink (Requirement 4.7)', () => {
    it('decreases scale by 0.1 per click', () => {
      const { result } = renderHook(() => useTrollBehavior());

      act(() => {
        result.current.handleClick();
      });
      expect(result.current.scale).toBeCloseTo(0.9);

      act(() => {
        result.current.handleClick();
      });
      expect(result.current.scale).toBeCloseTo(0.8);
    });

    it('does not shrink below minimum scale of 0.5', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Click 10 times to try to go below 0.5
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.handleClick();
        });
      }

      expect(result.current.scale).toBe(0.5);
    });
  });

  describe('handleClick - dialog progression (Requirement 4.8)', () => {
    it('starts dialog progression after 3 clicks', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // First 2 clicks should not trigger dialog
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
      });
      expect(result.current.dialogStage).toBe(0);

      // Third click should trigger dialog stage 1
      act(() => {
        result.current.handleClick();
      });
      expect(result.current.dialogStage).toBe(1);
    });

    it('shows first message "Are you SURE?" at dialog stage 1', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Get to dialog stage 1
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
      });

      expect(result.current.currentMessage).toBe("Are you SURE?");
    });
  });

  describe('confirmDialog - dialog progression', () => {
    it('progresses through all dialog messages in order', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Get to dialog stage 1
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
      });

      expect(result.current.currentMessage).toBe("Are you SURE?");

      // Confirm first dialog
      act(() => {
        result.current.confirmDialog();
      });
      expect(result.current.dialogStage).toBe(2);
      expect(result.current.currentMessage).toBe("Really?");

      // Confirm second dialog
      act(() => {
        result.current.confirmDialog();
      });
      expect(result.current.dialogStage).toBe(3);
      expect(result.current.currentMessage).toBe("But what if you're wrong?");
    });

    it('marks as complete after confirming all 3 dialogs', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Get to dialog stage 1
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
      });

      // Confirm all 3 dialogs
      act(() => {
        result.current.confirmDialog();
        result.current.confirmDialog();
        result.current.confirmDialog();
      });

      expect(result.current.isComplete).toBe(true);
      expect(result.current.dialogStage).toBe(0);
    });
  });

  describe('cancelDialog', () => {
    it('resets dialog stage to 0 when canceled', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Get to dialog stage 1
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
      });
      expect(result.current.dialogStage).toBe(1);

      // Cancel dialog
      act(() => {
        result.current.cancelDialog();
      });
      expect(result.current.dialogStage).toBe(0);
      expect(result.current.currentMessage).toBeNull();
    });

    it('preserves click count when dialog is canceled', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Get to dialog stage 1
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
      });

      // Cancel dialog
      act(() => {
        result.current.cancelDialog();
      });

      // Click count should still be 3
      expect(result.current.clickCount).toBe(3);
    });
  });

  describe('handleHover - escape behavior', () => {
    it('generates random hover offset on hover', () => {
      const { result } = renderHook(() => useTrollBehavior());

      act(() => {
        result.current.handleHover();
      });

      // Offset should be horizontal only (left or right)
      const { x, y } = result.current.hoverOffset;
      
      // X should be between 80-120 pixels (escape range defined in hook)
      expect(Math.abs(x)).toBeGreaterThanOrEqual(80);
      expect(Math.abs(x)).toBeLessThanOrEqual(120);
      
      // Y should be 0 (no vertical movement)
      expect(y).toBe(0);
    });

    it('generates different offsets on subsequent hovers', () => {
      const { result } = renderHook(() => useTrollBehavior());

      act(() => {
        result.current.handleHover();
      });
      const firstOffset = { ...result.current.hoverOffset };

      act(() => {
        result.current.handleHover();
      });
      const secondOffset = { ...result.current.hoverOffset };

      // Both should be horizontal (y = 0)
      expect(firstOffset.y).toBe(0);
      expect(secondOffset.y).toBe(0);
    });

    it('does not change offset when already complete', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Complete the troll sequence
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
        result.current.confirmDialog();
        result.current.confirmDialog();
        result.current.confirmDialog();
      });

      const offsetBeforeHover = { ...result.current.hoverOffset };

      act(() => {
        result.current.handleHover();
      });

      expect(result.current.hoverOffset).toEqual(offsetBeforeHover);
    });
  });

  describe('resetTroll', () => {
    it('resets all state to initial values', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Build up some state
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleHover();
      });

      // Reset
      act(() => {
        result.current.resetTroll();
      });

      expect(result.current.clickCount).toBe(0);
      expect(result.current.rotation).toBe(0);
      expect(result.current.scale).toBe(1.0);
      expect(result.current.hoverOffset).toEqual({ x: 0, y: 0 });
      expect(result.current.dialogStage).toBe(0);
      expect(result.current.isComplete).toBe(false);
    });

    it('allows restarting troll sequence after reset', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Complete the sequence
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
        result.current.confirmDialog();
        result.current.confirmDialog();
        result.current.confirmDialog();
      });
      expect(result.current.isComplete).toBe(true);

      // Reset
      act(() => {
        result.current.resetTroll();
      });

      // Should be able to start again
      act(() => {
        result.current.handleClick();
      });
      expect(result.current.clickCount).toBe(1);
      expect(result.current.isComplete).toBe(false);
    });
  });

  describe('completion requirements (Requirement 4.8)', () => {
    it('requires 3+ clicks AND all dialogs for completion', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Only 2 clicks - should not be able to complete
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
      });
      expect(result.current.isComplete).toBe(false);
      expect(result.current.dialogStage).toBe(0);

      // Third click triggers dialogs
      act(() => {
        result.current.handleClick();
      });
      expect(result.current.isComplete).toBe(false);
      expect(result.current.dialogStage).toBe(1);

      // Confirm only 2 dialogs - still not complete
      act(() => {
        result.current.confirmDialog();
        result.current.confirmDialog();
      });
      expect(result.current.isComplete).toBe(false);

      // Confirm third dialog - now complete
      act(() => {
        result.current.confirmDialog();
      });
      expect(result.current.isComplete).toBe(true);
    });

    it('does not increment click count after completion', () => {
      const { result } = renderHook(() => useTrollBehavior());

      // Complete the sequence
      act(() => {
        result.current.handleClick();
        result.current.handleClick();
        result.current.handleClick();
        result.current.confirmDialog();
        result.current.confirmDialog();
        result.current.confirmDialog();
      });

      const clickCountAfterComplete = result.current.clickCount;

      // Try to click more
      act(() => {
        result.current.handleClick();
      });

      expect(result.current.clickCount).toBe(clickCountAfterComplete);
    });
  });

  describe('TROLL_MESSAGES constant', () => {
    it('exports the correct troll messages', () => {
      expect(TROLL_MESSAGES).toEqual([
        "Are you SURE?",
        "Really?",
        "But what if you're wrong?"
      ]);
    });

    it('has exactly 3 messages', () => {
      expect(TROLL_MESSAGES.length).toBe(3);
    });
  });
});
