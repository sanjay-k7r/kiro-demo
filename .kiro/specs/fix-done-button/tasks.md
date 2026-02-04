# Implementation Plan: Fix Done Button

## Overview

This plan replaces the troll Done button with a standard, user-friendly button component. The implementation follows a clean removal approach: create the new component first, update integrations, then remove the old troll code.

## Tasks

- [x] 1. Create the new DoneButton component
  - [x] 1.1 Create `src/components/DoneButton.tsx` with standard button behavior
    - Accept `onComplete` and `isCompleted` props
    - Return null when `isCompleted` is true
    - Call `onComplete` directly on click
    - Use existing Button component from `ui/button`
    - Apply comic-style styling consistent with app design
    - Include proper aria-label for accessibility
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 3.3, 4.1, 4.2, 5.1_

  - [ ]* 1.2 Write unit tests for DoneButton
    - Test button renders for incomplete todos
    - Test button does not render for completed todos
    - Test click triggers onComplete callback
    - Test aria-label is present
    - Test keyboard activation (Enter/Space)
    - _Requirements: 1.1, 4.1, 4.2, 5.1, 5.2, 5.3_

  - [ ]* 1.3 Write property test for single-click completion
    - **Property 1: Single-Click Completion**
    - **Validates: Requirements 1.1, 1.2**

  - [ ]* 1.4 Write property test for visibility based on completion status
    - **Property 5: Visibility Matches Completion Status**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 2. Update TodoItem to use new DoneButton
  - [x] 2.1 Replace TrollDoneButton import with DoneButton in `src/components/TodoItem.tsx`
    - Remove TrollDoneButton and TrollDoneButtonRef imports
    - Import new DoneButton component
    - Remove trollButtonRef and related useRef
    - Remove handleMouseLeave callback (no longer needed)
    - Remove onMouseLeave from motion.div
    - Replace TrollDoneButton usage with DoneButton
    - Simplify props (remove todoId, ref)
    - _Requirements: 6.5_

  - [ ]* 2.2 Update TodoItem tests to use DoneButton
    - Update test descriptions from TrollDoneButton to DoneButton
    - Update data-testid expectations from 'troll-done-button' to 'done-button'
    - Simplify tests that expected troll behavior
    - _Requirements: 6.4_

- [x] 3. Checkpoint - Verify new button works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Remove TrollButtonContext from App
  - [x] 4.1 Remove TrollButtonProvider from `src/App.tsx`
    - Remove TrollButtonProvider import
    - Remove TrollButtonProvider wrapper from component tree
    - _Requirements: 6.1_

- [x] 5. Remove troll-related files
  - [x] 5.1 Delete `src/components/TrollDoneButton.tsx`
    - _Requirements: 6.5_

  - [x] 5.2 Delete `src/components/TrollButtonContext.tsx`
    - _Requirements: 6.1_

  - [x] 5.3 Delete `src/components/ConfirmationDialog.tsx`
    - _Requirements: 6.3_

  - [x] 5.4 Delete `src/hooks/useTrollBehavior.ts`
    - _Requirements: 6.2_

- [x] 6. Remove troll-related test files
  - [x] 6.1 Delete `src/__tests__/TrollDoneButton.test.tsx`
    - _Requirements: 6.4_

  - [x] 6.2 Delete `src/__tests__/useTrollBehavior.test.ts`
    - _Requirements: 6.4_

  - [x] 6.3 Update `src/__tests__/TodoList.test.tsx` to reference DoneButton
    - Update comments and test descriptions
    - Update data-testid expectations
    - _Requirements: 6.4_

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The new DoneButton is intentionally simple - a stateless component with no hooks
- Property tests use fast-check library per project conventions
- Test files follow project structure: unit tests in `__tests__/`, property tests in `__tests__/properties/`
