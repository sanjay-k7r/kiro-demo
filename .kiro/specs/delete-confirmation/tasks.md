# Implementation Plan: Delete Confirmation Dialog

## Overview

This plan adds a delete confirmation dialog to the Todo application. The implementation creates a new DeleteConfirmationDialog component using existing Radix UI Dialog primitives, then integrates it into TodoItem to intercept delete actions.

## Tasks

- [x] 1. Add destructive button variant
  - [x] 1.1 Add `destructive` variant to `src/components/ui/button.tsx`
    - Add red background styling for destructive actions
    - Ensure proper hover and focus states
    - Support both light and dark themes
    - _Requirements: 6.3_

- [x] 2. Create DeleteConfirmationDialog component
  - [x] 2.1 Create `src/components/DeleteConfirmationDialog.tsx`
    - Accept `open`, `onOpenChange`, `todoText`, and `onConfirm` props
    - Use existing Dialog primitives from `ui/dialog`
    - Display todo text in the confirmation message
    - Include Cancel button (outline variant)
    - Include Delete button (destructive variant)
    - Handle confirm action: call onConfirm, then close dialog
    - Handle cancel action: close dialog without calling onConfirm
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2_

  - [x]* 2.2 Write unit tests for DeleteConfirmationDialog
    - Test dialog renders when open=true
    - Test dialog displays todo text
    - Test confirm button triggers onConfirm and closes dialog
    - Test cancel button closes dialog without triggering onConfirm
    - Test escape key closes dialog without triggering onConfirm
    - Test dialog has correct ARIA attributes
    - Test confirm button has destructive styling
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 4.2, 5.4, 6.3_

  - [x]* 2.3 Write property test for dialog displays todo text
    - **Property 2: Dialog Displays Todo Text**
    - Generate random todo text strings, verify they appear in dialog
    - **Validates: Requirements 1.2**

  - [x]* 2.4 Write property test for dismissal does not trigger deletion
    - **Property 4: Dismissal Does Not Trigger Deletion**
    - Test cancel button, escape key dismissals
    - Verify onConfirm is never called on dismissal
    - **Validates: Requirements 1.3, 3.2, 4.1, 4.2, 4.3**

- [x] 3. Checkpoint - Verify dialog component works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Integrate DeleteConfirmationDialog into TodoItem
  - [x] 4.1 Update `src/components/TodoItem.tsx` to use DeleteConfirmationDialog
    - Add useState for showDeleteDialog
    - Update delete button onClick to open dialog instead of calling onDelete
    - Add DeleteConfirmationDialog component with proper props
    - Wire onConfirm to call onDelete(todo.id)
    - _Requirements: 1.1, 1.3, 2.2, 3.2_

  - [x]* 4.2 Update TodoItem tests for delete confirmation flow
    - Test delete button opens dialog
    - Test confirming dialog triggers onDelete
    - Test canceling dialog does not trigger onDelete
    - _Requirements: 1.1, 2.2, 3.2_

- [x] 5. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The DeleteConfirmationDialog is a controlled component (stateless)
- Radix UI Dialog handles accessibility (focus trap, ARIA, keyboard) automatically
- Property tests use fast-check library per project conventions
- Test files follow project structure: unit tests in `__tests__/`, property tests in `__tests__/properties/`
