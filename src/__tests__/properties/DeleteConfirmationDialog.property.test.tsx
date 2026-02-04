import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { DeleteConfirmationDialog } from '../../components/DeleteConfirmationDialog';

/**
 * Property-based tests for DeleteConfirmationDialog component
 * 
 * **Feature: delete-confirmation, Property 2: Dialog Displays Todo Text**
 * 
 * These tests verify that the dialog correctly displays any todo text
 * using randomized inputs to ensure robustness across all valid inputs.
 */

describe('DeleteConfirmationDialog Property Tests', () => {
  /**
   * **Feature: delete-confirmation, Property 2: Dialog Displays Todo Text**
   * 
   * *For any* todo item with any text content, when the DeleteConfirmationDialog
   * opens, the dialog SHALL contain that todo's text.
   * 
   * **Validates: Requirements 1.2**
   */
  describe('Property 2: Dialog Displays Todo Text', () => {
    it('displays any generated todo text in the dialog', () => {
      fc.assert(
        fc.property(
          // Generate random strings for todo text
          fc.string({ minLength: 1, maxLength: 200 }),
          (todoText) => {
            const onOpenChange = vi.fn();
            const onConfirm = vi.fn();

            const { unmount } = render(
              <DeleteConfirmationDialog
                open={true}
                onOpenChange={onOpenChange}
                todoText={todoText}
                onConfirm={onConfirm}
              />
            );

            // The dialog should be open
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();

            // The todo text should appear in the dialog description
            // The dialog description contains: Are you sure you want to delete "{todoText}"?
            const dialogContent = dialog.textContent || '';
            expect(dialogContent).toContain(todoText);

            // Clean up to avoid memory leaks between iterations
            unmount();
          }
        ),
        { numRuns: 100 } // Minimum 100 iterations as per spec
      );
    });

    it('displays todo text with special characters correctly', () => {
      // Create a generator for strings with special characters
      const specialCharString = fc.array(
        fc.oneof(
          fc.constantFrom('a', 'b', 'c', '1', '2', '3'),
          fc.constantFrom('"', "'", '<', '>', '&', '\\', '/', '!', '@', '#', '$', '%')
        ),
        { minLength: 1, maxLength: 100 }
      ).map(chars => chars.join(''));

      fc.assert(
        fc.property(
          specialCharString,
          (todoText) => {
            const onOpenChange = vi.fn();
            const onConfirm = vi.fn();

            const { unmount } = render(
              <DeleteConfirmationDialog
                open={true}
                onOpenChange={onOpenChange}
                todoText={todoText}
                onConfirm={onConfirm}
              />
            );

            // The dialog should be open
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();

            // The dialog content should contain the todo text
            const dialogContent = dialog.textContent || '';
            expect(dialogContent).toContain(todoText);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('displays todo text with whitespace correctly', () => {
      fc.assert(
        fc.property(
          // Generate strings with various whitespace patterns
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 20 }),
            fc.constantFrom(' ', '  ', '   '),
            fc.string({ minLength: 1, maxLength: 20 })
          ).map(([start, space, end]) => start + space + end),
          (todoText) => {
            const onOpenChange = vi.fn();
            const onConfirm = vi.fn();

            const { unmount } = render(
              <DeleteConfirmationDialog
                open={true}
                onOpenChange={onOpenChange}
                todoText={todoText}
                onConfirm={onConfirm}
              />
            );

            // The dialog should be open
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();

            // The dialog content should contain the todo text
            const dialogContent = dialog.textContent || '';
            expect(dialogContent).toContain(todoText);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('displays empty string todo text correctly', () => {
      // Edge case: empty string should still render with empty quotes
      const onOpenChange = vi.fn();
      const onConfirm = vi.fn();

      render(
        <DeleteConfirmationDialog
          open={true}
          onOpenChange={onOpenChange}
          todoText=""
          onConfirm={onConfirm}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // Should show empty quotes in the message
      expect(screen.getByText(/Are you sure you want to delete ""\?/)).toBeInTheDocument();
    });

    it('displays alphanumeric todo text correctly', () => {
      // Create a generator for alphanumeric strings
      const alphanumericChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
      const alphanumericString = fc.array(
        fc.constantFrom(...alphanumericChars.split('')),
        { minLength: 1, maxLength: 100 }
      ).map(chars => chars.join(''));

      fc.assert(
        fc.property(
          alphanumericString,
          (todoText) => {
            const onOpenChange = vi.fn();
            const onConfirm = vi.fn();

            const { unmount } = render(
              <DeleteConfirmationDialog
                open={true}
                onOpenChange={onOpenChange}
                todoText={todoText}
                onConfirm={onConfirm}
              />
            );

            // The dialog should be open
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();

            // The todo text should appear in the dialog
            const dialogContent = dialog.textContent || '';
            expect(dialogContent).toContain(todoText);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('displays realistic todo text correctly', () => {
      fc.assert(
        fc.property(
          // Generate realistic todo items
          fc.oneof(
            fc.constant('Buy groceries'),
            fc.constant('Call mom'),
            fc.constant('Finish project report'),
            fc.constant('Schedule dentist appointment'),
            fc.constant('Review pull request #123'),
            fc.constant('Fix bug in authentication'),
            fc.constant('Write unit tests'),
            fc.constant('Update documentation'),
            fc.constant('Meeting with team at 3pm'),
            fc.constant('Send invoice to client'),
            // Also generate some random variations
            fc.tuple(
              fc.constantFrom('Buy', 'Get', 'Fix', 'Update', 'Review', 'Send', 'Call', 'Schedule'),
              fc.constantFrom('groceries', 'milk', 'report', 'code', 'email', 'meeting', 'task')
            ).map(([verb, noun]) => `${verb} ${noun}`)
          ),
          (todoText) => {
            const onOpenChange = vi.fn();
            const onConfirm = vi.fn();

            const { unmount } = render(
              <DeleteConfirmationDialog
                open={true}
                onOpenChange={onOpenChange}
                todoText={todoText}
                onConfirm={onConfirm}
              />
            );

            // The dialog should be open
            const dialog = screen.getByRole('dialog');
            expect(dialog).toBeInTheDocument();

            // The todo text should appear in the dialog
            const dialogContent = dialog.textContent || '';
            expect(dialogContent).toContain(todoText);

            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * **Feature: delete-confirmation, Property 4: Dismissal Does Not Trigger Deletion**
 * 
 * These tests verify that dismissing the dialog (via cancel button, escape key,
 * or clicking outside) never triggers the onConfirm callback.
 */
describe('Property 4: Dismissal Does Not Trigger Deletion', () => {
  /**
   * **Feature: delete-confirmation, Property 4: Dismissal Does Not Trigger Deletion**
   * 
   * *For any* open DeleteConfirmationDialog and any dismissal via cancel button,
   * the onConfirm callback SHALL NOT be called.
   * 
   * **Validates: Requirements 1.3, 3.2, 4.1, 4.2, 4.3**
   */
  it('cancel button dismissal never triggers onConfirm for any todo text', () => {
    fc.assert(
      fc.property(
        // Generate random strings for todo text
        fc.string({ minLength: 0, maxLength: 200 }),
        (todoText) => {
          const onOpenChange = vi.fn();
          const onConfirm = vi.fn();

          const { unmount } = render(
            <DeleteConfirmationDialog
              open={true}
              onOpenChange={onOpenChange}
              todoText={todoText}
              onConfirm={onConfirm}
            />
          );

          // Find and click the Cancel button
          const cancelButton = screen.getByRole('button', { name: /cancel/i });
          cancelButton.click();

          // onConfirm should NEVER be called when canceling
          expect(onConfirm).not.toHaveBeenCalled();

          // onOpenChange should be called with false to close the dialog
          expect(onOpenChange).toHaveBeenCalledWith(false);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: delete-confirmation, Property 4: Dismissal Does Not Trigger Deletion**
   * 
   * *For any* open DeleteConfirmationDialog and dismissal via escape key,
   * the onConfirm callback SHALL NOT be called.
   * 
   * **Validates: Requirements 1.3, 3.2, 4.1, 4.2, 4.3**
   */
  it('escape key dismissal never triggers onConfirm for any todo text', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    
    await fc.assert(
      fc.asyncProperty(
        // Generate random strings for todo text
        fc.string({ minLength: 0, maxLength: 200 }),
        async (todoText) => {
          const onOpenChange = vi.fn();
          const onConfirm = vi.fn();
          const user = userEvent.setup();

          const { unmount } = render(
            <DeleteConfirmationDialog
              open={true}
              onOpenChange={onOpenChange}
              todoText={todoText}
              onConfirm={onConfirm}
            />
          );

          // Press Escape key to dismiss
          await user.keyboard('{Escape}');

          // onConfirm should NEVER be called when dismissing via escape
          expect(onConfirm).not.toHaveBeenCalled();

          // onOpenChange should be called with false to close the dialog
          expect(onOpenChange).toHaveBeenCalledWith(false);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: delete-confirmation, Property 4: Dismissal Does Not Trigger Deletion**
   * 
   * *For any* sequence of dismissal actions (cancel button clicks),
   * the onConfirm callback SHALL NOT be called regardless of how many times dismissed.
   * 
   * **Validates: Requirements 1.3, 3.2, 4.1, 4.2, 4.3**
   */
  it('multiple cancel button clicks never trigger onConfirm', () => {
    fc.assert(
      fc.property(
        // Generate random todo text
        fc.string({ minLength: 1, maxLength: 100 }),
        // Generate random number of cancel clicks (1-5)
        fc.integer({ min: 1, max: 5 }),
        (todoText, clickCount) => {
          const onOpenChange = vi.fn();
          const onConfirm = vi.fn();

          const { unmount } = render(
            <DeleteConfirmationDialog
              open={true}
              onOpenChange={onOpenChange}
              todoText={todoText}
              onConfirm={onConfirm}
            />
          );

          // Click cancel button multiple times
          const cancelButton = screen.getByRole('button', { name: /cancel/i });
          for (let i = 0; i < clickCount; i++) {
            cancelButton.click();
          }

          // onConfirm should NEVER be called regardless of click count
          expect(onConfirm).not.toHaveBeenCalled();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: delete-confirmation, Property 4: Dismissal Does Not Trigger Deletion**
   * 
   * *For any* todo text with special characters, dismissal via cancel button
   * SHALL NOT trigger onConfirm.
   * 
   * **Validates: Requirements 1.3, 3.2, 4.1, 4.2, 4.3**
   */
  it('cancel button dismissal never triggers onConfirm for special character todo text', () => {
    // Create a generator for strings with special characters
    const specialCharString = fc.array(
      fc.oneof(
        fc.constantFrom('a', 'b', 'c', '1', '2', '3'),
        fc.constantFrom('"', "'", '<', '>', '&', '\\', '/', '!', '@', '#', '$', '%', '^', '*')
      ),
      { minLength: 1, maxLength: 100 }
    ).map(chars => chars.join(''));

    fc.assert(
      fc.property(
        specialCharString,
        (todoText) => {
          const onOpenChange = vi.fn();
          const onConfirm = vi.fn();

          const { unmount } = render(
            <DeleteConfirmationDialog
              open={true}
              onOpenChange={onOpenChange}
              todoText={todoText}
              onConfirm={onConfirm}
            />
          );

          // Click cancel button
          const cancelButton = screen.getByRole('button', { name: /cancel/i });
          cancelButton.click();

          // onConfirm should NEVER be called
          expect(onConfirm).not.toHaveBeenCalled();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: delete-confirmation, Property 4: Dismissal Does Not Trigger Deletion**
   * 
   * *For any* realistic todo text, dismissal via cancel button
   * SHALL NOT trigger onConfirm.
   * 
   * **Validates: Requirements 1.3, 3.2, 4.1, 4.2, 4.3**
   */
  it('cancel button dismissal never triggers onConfirm for realistic todo text', () => {
    fc.assert(
      fc.property(
        // Generate realistic todo items
        fc.oneof(
          fc.constant('Buy groceries'),
          fc.constant('Call mom'),
          fc.constant('Finish project report'),
          fc.constant('Schedule dentist appointment'),
          fc.constant('Review pull request #123'),
          fc.constant('Fix bug in authentication'),
          fc.constant('Write unit tests'),
          fc.constant('Update documentation'),
          fc.constant('Meeting with team at 3pm'),
          fc.constant('Send invoice to client'),
          // Also generate some random variations
          fc.tuple(
            fc.constantFrom('Buy', 'Get', 'Fix', 'Update', 'Review', 'Send', 'Call', 'Schedule'),
            fc.constantFrom('groceries', 'milk', 'report', 'code', 'email', 'meeting', 'task')
          ).map(([verb, noun]) => `${verb} ${noun}`)
        ),
        (todoText) => {
          const onOpenChange = vi.fn();
          const onConfirm = vi.fn();

          const { unmount } = render(
            <DeleteConfirmationDialog
              open={true}
              onOpenChange={onOpenChange}
              todoText={todoText}
              onConfirm={onConfirm}
            />
          );

          // Click cancel button
          const cancelButton = screen.getByRole('button', { name: /cancel/i });
          cancelButton.click();

          // onConfirm should NEVER be called
          expect(onConfirm).not.toHaveBeenCalled();

          // onOpenChange should be called with false
          expect(onOpenChange).toHaveBeenCalledWith(false);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
