import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmationDialog } from '../components/DeleteConfirmationDialog';

/**
 * Unit tests for DeleteConfirmationDialog component
 * Validates: Requirements 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4.2, 5.4, 6.3
 */

// Helper function to render the dialog with default props
function renderDialog(props: Partial<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todoText: string;
  onConfirm: () => void;
}> = {}) {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    todoText: 'Test todo item',
    onConfirm: vi.fn(),
    ...props,
  };

  return {
    ...render(<DeleteConfirmationDialog {...defaultProps} />),
    ...defaultProps,
  };
}

describe('DeleteConfirmationDialog', () => {
  describe('Dialog Rendering', () => {
    /**
     * Validates: Requirement 1.1 - Dialog opens when triggered
     */
    it('renders dialog when open=true', () => {
      renderDialog({ open: true });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Delete Todo?')).toBeInTheDocument();
    });

    it('does not render dialog when open=false', () => {
      renderDialog({ open: false });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Todo Text Display', () => {
    /**
     * Validates: Requirement 1.2 - Dialog displays todo text being deleted
     */
    it('displays the todo text in the confirmation message', () => {
      renderDialog({ todoText: 'Buy groceries' });

      expect(screen.getByText(/Are you sure you want to delete "Buy groceries"\?/)).toBeInTheDocument();
    });

    it('displays empty quotes when todoText is empty', () => {
      renderDialog({ todoText: '' });

      expect(screen.getByText(/Are you sure you want to delete ""\?/)).toBeInTheDocument();
    });

    it('displays special characters in todo text correctly', () => {
      renderDialog({ todoText: 'Task with "quotes" & <special> chars' });

      expect(screen.getByText(/Task with "quotes" & <special> chars/)).toBeInTheDocument();
    });
  });

  describe('Confirm Button', () => {
    /**
     * Validates: Requirements 2.1, 2.2 - Confirm button triggers deletion and closes dialog
     */
    it('triggers onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      const onOpenChange = vi.fn();

      renderDialog({ onConfirm, onOpenChange });

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('closes dialog when confirm button is clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      renderDialog({ onOpenChange });

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls onConfirm before closing dialog', async () => {
      const user = userEvent.setup();
      const callOrder: string[] = [];
      const onConfirm = vi.fn(() => callOrder.push('confirm'));
      const onOpenChange = vi.fn(() => callOrder.push('close'));

      renderDialog({ onConfirm, onOpenChange });

      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(callOrder).toEqual(['confirm', 'close']);
    });
  });

  describe('Cancel Button', () => {
    /**
     * Validates: Requirements 3.1, 3.2 - Cancel button closes dialog without triggering deletion
     */
    it('closes dialog when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      renderDialog({ onOpenChange });

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not trigger onConfirm when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();

      renderDialog({ onConfirm });

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Escape Key Dismissal', () => {
    /**
     * Validates: Requirement 4.2 - Escape key closes dialog without deleting
     */
    it('closes dialog when escape key is pressed', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      renderDialog({ onOpenChange });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('does not trigger onConfirm when escape key is pressed', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      const onOpenChange = vi.fn();

      renderDialog({ onConfirm, onOpenChange });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    /**
     * Validates: Requirement 5.4 - Dialog has appropriate ARIA attributes
     */
    it('has role="dialog"', () => {
      renderDialog();

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has accessible dialog title', () => {
      renderDialog();

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAccessibleName('Delete Todo?');
    });

    it('has accessible dialog description', () => {
      renderDialog({ todoText: 'Test task' });

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAccessibleDescription(/Are you sure you want to delete "Test task"\?/);
    });

    it('cancel button is accessible', () => {
      renderDialog();

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('delete button is accessible', () => {
      renderDialog();

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('buttons are keyboard focusable', async () => {
      const user = userEvent.setup();
      renderDialog();

      // Tab through the dialog
      await user.tab();
      
      // One of the buttons should be focused
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      
      const focusedElement = document.activeElement;
      expect(
        focusedElement === cancelButton || focusedElement === deleteButton
      ).toBe(true);
    });
  });

  describe('Visual Styling', () => {
    /**
     * Validates: Requirement 6.3 - Confirm button has destructive styling
     */
    it('confirm button has destructive variant', () => {
      renderDialog();

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toHaveAttribute('data-variant', 'destructive');
    });

    it('cancel button has outline variant', () => {
      renderDialog();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toHaveAttribute('data-variant', 'outline');
    });

    it('confirm button has red background styling', () => {
      renderDialog();

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toHaveClass('bg-red-500');
    });
  });

  describe('Dialog Content', () => {
    it('displays dialog title "Delete Todo?"', () => {
      renderDialog();

      expect(screen.getByText('Delete Todo?')).toBeInTheDocument();
    });

    it('displays Cancel button with correct label', () => {
      renderDialog();

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('displays Delete button with correct label', () => {
      renderDialog();

      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });
  });

  describe('Keyboard Interaction', () => {
    /**
     * Validates: Requirement 5.3 - Buttons activatable via Enter or Space
     */
    it('confirm button can be activated with Enter key', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();

      renderDialog({ onConfirm });

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.focus();
      await user.keyboard('{Enter}');

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('confirm button can be activated with Space key', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();

      renderDialog({ onConfirm });

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.focus();
      await user.keyboard(' ');

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('cancel button can be activated with Enter key', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const onConfirm = vi.fn();

      renderDialog({ onOpenChange, onConfirm });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      cancelButton.focus();
      await user.keyboard('{Enter}');

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('cancel button can be activated with Space key', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const onConfirm = vi.fn();

      renderDialog({ onOpenChange, onConfirm });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      cancelButton.focus();
      await user.keyboard(' ');

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
