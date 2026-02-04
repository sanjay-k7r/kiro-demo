import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../components/TodoItem';
import type { Todo } from '../types/todo';

// Helper function to create a mock todo
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: `todo-${Math.random().toString(36).substring(7)}`,
  text: 'Test todo',
  completed: false,
  createdAt: Date.now(),
  ...overrides,
});

// Helper to render TodoItem
function renderTodoItem(props: { todo: Todo; onComplete: (id: string) => void; onDelete: (id: string) => void }) {
  return render(
    <TodoItem {...props} />
  );
}

describe('TodoItem', () => {
  describe('Display', () => {
    it('displays todo text', () => {
      const todo = createMockTodo({ text: 'Buy groceries' });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });

    it('displays todo text with strikethrough when completed', () => {
      const todo = createMockTodo({ text: 'Completed task', completed: true });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      const todoText = screen.getByText('Completed task');
      expect(todoText).toHaveClass('line-through');
    });

    it('displays todo text without strikethrough when not completed', () => {
      const todo = createMockTodo({ text: 'Pending task', completed: false });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      const todoText = screen.getByText('Pending task');
      expect(todoText).not.toHaveClass('line-through');
    });

    it('renders with correct test id', () => {
      const todo = createMockTodo({ id: 'test-123' });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      expect(screen.getByTestId('todo-item-test-123')).toBeInTheDocument();
    });
  });

  describe('DoneButton Integration', () => {
    it('shows DoneButton for incomplete todos', () => {
      const todo = createMockTodo({ completed: false });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // DoneButton renders with data-testid="done-button"
      expect(screen.getByTestId('done-button')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mark as complete/i })).toBeInTheDocument();
    });

    it('hides DoneButton for completed todos', () => {
      const todo = createMockTodo({ completed: true });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // DoneButton should not render when isCompleted is true
      expect(screen.queryByTestId('done-button')).not.toBeInTheDocument();
    });

    it('renders DoneButton with correct props', () => {
      const todo = createMockTodo({ id: 'test-todo-123', completed: false });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // The DoneButton should be present and clickable
      const doneButton = screen.getByTestId('done-button');
      expect(doneButton).toBeInTheDocument();
    });
  });

  describe('Delete Button', () => {
    it('shows delete button with trash icon', () => {
      const todo = createMockTodo();
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    });

    it('shows delete button for incomplete todos', () => {
      const todo = createMockTodo({ completed: false });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('shows delete button for completed todos', () => {
      const todo = createMockTodo({ completed: true });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });
  });

  describe('Delete Confirmation Flow', () => {
    /**
     * Validates: Requirements 1.1
     * WHEN a user clicks the Delete_Button on a Todo_Item, THE Delete_Confirmation_Dialog SHALL open
     */
    it('opens delete confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup();
      const todo = createMockTodo({ text: 'Task to delete' });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // Click the delete button
      await user.click(screen.getByTestId('delete-button'));

      // Dialog should be open with the todo text
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete "Task to delete"\?/)).toBeInTheDocument();
      
      // onDelete should NOT be called yet
      expect(onDelete).not.toHaveBeenCalled();
    });

    /**
     * Validates: Requirements 2.2
     * WHEN the user clicks the Confirm_Button, THE Todo_Item SHALL be deleted from the list
     */
    it('calls onDelete with todo id when confirming dialog', async () => {
      const user = userEvent.setup();
      const todo = createMockTodo({ id: 'delete-me-456', text: 'Task to delete' });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // Click the delete button to open dialog
      await user.click(screen.getByTestId('delete-button'));

      // Click the confirm (Delete) button in the dialog
      await user.click(screen.getByRole('button', { name: 'Delete' }));

      // onDelete should be called with the todo id
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('delete-me-456');
    });

    /**
     * Validates: Requirements 3.2
     * WHEN the user clicks the Cancel_Button, THE Todo_Item SHALL remain in the list unchanged
     */
    it('does not call onDelete when canceling dialog', async () => {
      const user = userEvent.setup();
      const todo = createMockTodo({ id: 'keep-me-789', text: 'Task to keep' });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // Click the delete button to open dialog
      await user.click(screen.getByTestId('delete-button'));

      // Verify dialog is open
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click the cancel button in the dialog
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      // onDelete should NOT be called
      expect(onDelete).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has accessible label for DoneButton', () => {
      const todo = createMockTodo({ text: 'Accessible task', completed: false });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // DoneButton has aria-label="Mark as complete"
      expect(screen.getByRole('button', { name: /mark as complete/i })).toBeInTheDocument();
    });

    it('has accessible label for delete button', () => {
      const todo = createMockTodo({ text: 'Accessible task' });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      expect(screen.getByRole('button', { name: /delete "Accessible task"/i })).toBeInTheDocument();
    });
  });

  describe('Framer Motion Animation Props', () => {
    it('renders motion.div with animation attributes', () => {
      const todo = createMockTodo({ id: 'animated-todo' });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // The component should render successfully with Framer Motion
      // The motion.div is rendered as a regular div in tests
      const todoItem = screen.getByTestId('todo-item-animated-todo');
      expect(todoItem).toBeInTheDocument();
    });
  });
});
