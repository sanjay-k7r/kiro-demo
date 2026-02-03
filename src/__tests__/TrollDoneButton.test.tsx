import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrollDoneButton } from '../components/TrollDoneButton';
import { TrollButtonProvider } from '../components/TrollButtonContext';

/**
 * TROLL: Unit tests for the TrollDoneButton component
 * Tests the intentionally broken Done button with all its troll behaviors.
 * 
 * Validates: Requirements 4.1, 4.6, 4.7, 4.8, 4.9
 */

// Helper to render TrollDoneButton with required context
function renderTrollButton(props: { onComplete: () => void; isCompleted: boolean; todoId?: string }) {
  return render(
    <TrollButtonProvider>
      <TrollDoneButton 
        onComplete={props.onComplete} 
        isCompleted={props.isCompleted} 
        todoId={props.todoId || 'test-todo-id'} 
      />
    </TrollButtonProvider>
  );
}

describe('TrollDoneButton', () => {
  describe('Rendering', () => {
    // TROLL: Test that the button renders when not completed
    it('renders the Done button when isCompleted is false', () => {
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      expect(screen.getByTestId('troll-done-button')).toBeInTheDocument();
      expect(screen.getByText('DONE!')).toBeInTheDocument();
    });

    // TROLL: Test that the button is hidden when already completed
    it('does not render when isCompleted is true', () => {
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: true });

      expect(screen.queryByTestId('troll-done-button')).not.toBeInTheDocument();
    });

    // TROLL: Test that the button has correct initial styles
    it('renders with initial transform styles', () => {
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');
      expect(button).toHaveStyle({
        transform: 'translateX(0px)',
      });
    });
  });

  describe('Hover Escape Behavior (Requirement 4.1)', () => {
    // TROLL: Test that the button moves away on hover
    it('changes transform translate on mouse enter', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');
      
      // Initial position should be at origin
      expect(button.style.transform).toBe('translateX(0px)');

      // Hover over the button
      await user.hover(button);

      // Transform should have changed (button escaped left or right)
      await waitFor(() => {
        expect(button.style.transform).not.toBe('translateX(0px)');
        expect(button.style.transform).toMatch(/translateX\(-?\d+/); // Can be positive or negative
      });
    });
  });

  describe('Confirmation Dialog Flow (Requirements 4.2-4.5, 4.8)', () => {
    // TROLL: Test that dialog appears after 3 clicks
    it('shows confirmation dialog after 3 clicks (Requirement 4.8)', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');

      // Click 3 times to trigger dialog
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Dialog should appear with first message
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Are you SURE?')).toBeInTheDocument();
      });
    });

    // TROLL: Test that dialog does not appear before 3 clicks
    it('does not show dialog before 3 clicks', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');

      // Click only twice
      await user.click(button);
      await user.click(button);

      // Dialog should not appear
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // TROLL: Test dialog progression through all messages
    it('progresses through all confirmation messages', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');

      // Click 3 times to trigger dialog
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // First message: "Are you SURE?"
      await waitFor(() => {
        expect(screen.getByText('Are you SURE?')).toBeInTheDocument();
      });

      // Confirm first dialog
      await user.click(screen.getByTestId('confirmation-confirm'));

      // Second message: "Really?"
      await waitFor(() => {
        expect(screen.getByText('Really?')).toBeInTheDocument();
      });

      // Confirm second dialog
      await user.click(screen.getByTestId('confirmation-confirm'));

      // Third message: "But what if you're wrong?"
      await waitFor(() => {
        expect(screen.getByText("But what if you're wrong?")).toBeInTheDocument();
      });
    });

    // TROLL: Test that canceling dialog resets dialog stage
    it('resets dialog stage when canceled', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');

      // Click 3 times to trigger dialog
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Dialog should appear
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Cancel the dialog
      await user.click(screen.getByTestId('confirmation-cancel'));

      // Dialog should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Completion Behavior (Requirement 4.9)', () => {
    // TROLL: Test that onComplete is NOT called before all requirements are met
    it('does not call onComplete before all troll requirements are met', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');

      // Click 3 times
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Confirm only 2 dialogs
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('confirmation-confirm'));
      await user.click(screen.getByTestId('confirmation-confirm'));

      // onComplete should NOT have been called yet
      expect(onComplete).not.toHaveBeenCalled();
    });

    // TROLL: Test that onComplete IS called after all requirements are met
    it('calls onComplete after all troll requirements are met (Requirement 4.9)', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');

      // Click 3 times to trigger dialog
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Confirm all 3 dialogs
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('confirmation-confirm'));
      
      await waitFor(() => {
        expect(screen.getByText('Really?')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('confirmation-confirm'));
      
      await waitFor(() => {
        expect(screen.getByText("But what if you're wrong?")).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('confirmation-confirm'));

      // onComplete should have been called
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Accessibility', () => {
    // TROLL: Test that the button has accessible label
    it('has accessible aria-label', () => {
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      expect(screen.getByRole('button', { name: /mark as complete/i })).toBeInTheDocument();
    });
  });

  describe('CSS Transform Styles', () => {
    // TROLL: Test that translateX transform is applied on hover
    it('applies translateX transform on hover', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');

      // Hover to change translate
      await user.hover(button);

      // translateX should be present in the style
      await waitFor(() => {
        const transform = button.style.transform;
        expect(transform).toMatch(/translateX\(-?\d+/);
      });
    });

    // TROLL: Test that transition style is applied for smooth animation
    it('has transition style for smooth animation', () => {
      const onComplete = vi.fn();
      
      renderTrollButton({ onComplete, isCompleted: false });

      const button = screen.getByTestId('troll-done-button');
      expect(button.style.transition).toBe('transform 0.3s ease-out');
    });
  });

  describe('Single Button Displacement', () => {
    // TROLL: Test that only one button can be displaced at a time
    it('only displaces one button at a time when multiple buttons exist', async () => {
      const user = userEvent.setup();
      const onComplete1 = vi.fn();
      const onComplete2 = vi.fn();
      
      render(
        <TrollButtonProvider>
          <TrollDoneButton onComplete={onComplete1} isCompleted={false} todoId="todo-1" />
          <TrollDoneButton onComplete={onComplete2} isCompleted={false} todoId="todo-2" />
        </TrollButtonProvider>
      );

      const buttons = screen.getAllByTestId('troll-done-button');
      const button1 = buttons[0];
      const button2 = buttons[1];

      // Initially both should be at origin
      expect(button1.style.transform).toBe('translateX(0px)');
      expect(button2.style.transform).toBe('translateX(0px)');

      // Hover over first button
      await user.hover(button1);

      // First button should be displaced
      await waitFor(() => {
        expect(button1.style.transform).not.toBe('translateX(0px)');
      });
      // Second button should still be at origin
      expect(button2.style.transform).toBe('translateX(0px)');

      // Now hover over second button
      await user.hover(button2);

      // Second button should now be displaced
      await waitFor(() => {
        expect(button2.style.transform).not.toBe('translateX(0px)');
      });
      // First button should return to origin
      expect(button1.style.transform).toBe('translateX(0px)');
    });
  });
});
