import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { TROLL_MESSAGES } from '../hooks/useTrollBehavior';

/**
 * TROLL: Unit tests for the ConfirmationDialog component
 * Tests the intentionally annoying confirmation dialogs that appear
 * when users try to mark a todo as complete.
 * 
 * Validates: Requirements 4.2, 4.3, 4.4, 4.5
 */
describe('ConfirmationDialog', () => {
  // TROLL: Test that the dialog renders when open
  it('renders dialog when isOpen is true', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmationDialog
        isOpen={true}
        message="Are you SURE?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  });

  // TROLL: Test that the dialog doesn't render when closed
  it('does not render dialog when isOpen is false', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmationDialog
        isOpen={false}
        message="Are you SURE?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // TROLL: Test first confirmation message - "Are you SURE?"
  // Validates: Requirement 4.3
  it('displays first confirmation message "Are you SURE?"', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmationDialog
        isOpen={true}
        message={TROLL_MESSAGES[0]}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Are you SURE?')).toBeInTheDocument();
  });

  // TROLL: Test second confirmation message - "Really?"
  // Validates: Requirement 4.4
  it('displays second confirmation message "Really?"', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmationDialog
        isOpen={true}
        message={TROLL_MESSAGES[1]}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Really?')).toBeInTheDocument();
  });

  // TROLL: Test third confirmation message - "But what if you're wrong?"
  // Validates: Requirement 4.5
  it('displays third confirmation message "But what if you\'re wrong?"', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmationDialog
        isOpen={true}
        message={TROLL_MESSAGES[2]}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText("But what if you're wrong?")).toBeInTheDocument();
  });

  // TROLL: Test that confirm button calls onConfirm
  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmationDialog
        isOpen={true}
        message="Are you SURE?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByTestId('confirmation-confirm'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  // TROLL: Test that cancel button calls onCancel
  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmationDialog
        isOpen={true}
        message="Are you SURE?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByTestId('confirmation-cancel'));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  // TROLL: Test that both buttons are present
  it('renders both confirm and cancel buttons', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <ConfirmationDialog
        isOpen={true}
        message="Are you SURE?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByTestId('confirmation-confirm')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-cancel')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  // TROLL: Test that the message prop is displayed correctly
  it('displays the provided message prop', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const customMessage = 'Custom troll message!';
    
    render(
      <ConfirmationDialog
        isOpen={true}
        message={customMessage}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  // TROLL: Verify all three troll messages are correctly defined
  it('has correct troll messages defined in TROLL_MESSAGES constant', () => {
    expect(TROLL_MESSAGES).toHaveLength(3);
    expect(TROLL_MESSAGES[0]).toBe('Are you SURE?');
    expect(TROLL_MESSAGES[1]).toBe('Really?');
    expect(TROLL_MESSAGES[2]).toBe("But what if you're wrong?");
  });
});
