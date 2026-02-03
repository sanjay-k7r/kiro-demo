import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../components/TodoItem';
import { TrollButtonProvider } from '../components/TrollButtonContext';
import type { Todo } from '../types/todo';

// Helper function to create a mock todo
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: `todo-${Math.random().toString(36).substring(7)}`,
  text: 'Test todo',
  completed: false,
  createdAt: Date.now(),
  ...overrides,
});

// Helper to render TodoItem with required TrollButtonProvider context
function renderTodoItem(props: { todo: Todo; onComplete: (id: string) => void; onDelete: (id: string) => void }) {
  return render(
    <TrollButtonProvider>
      <TodoItem {...props} />
    </TrollButtonProvider>
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

  describe('TrollDoneButton Integration', () => {
    it('shows TrollDoneButton for incomplete todos', () => {
      const todo = createMockTodo({ completed: false });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // TrollDoneButton renders with data-testid="troll-done-button"
      expect(screen.getByTestId('troll-done-button')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mark as complete/i })).toBeInTheDocument();
    });

    it('hides TrollDoneButton for completed todos', () => {
      const todo = createMockTodo({ completed: true });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // TrollDoneButton should not render when isCompleted is true
      expect(screen.queryByTestId('troll-done-button')).not.toBeInTheDocument();
    });

    it('renders TrollDoneButton with correct props', () => {
      const todo = createMockTodo({ id: 'test-todo-123', completed: false });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // The TrollDoneButton should be present and clickable
      const trollButton = screen.getByTestId('troll-done-button');
      expect(trollButton).toBeInTheDocument();
    });

    // Note: TrollDoneButton has troll behaviors that require multiple clicks
    // and confirmation dialogs before calling onComplete. Full troll behavior
    // testing is covered in TrollDoneButton.test.tsx and useTrollBehavior.test.ts
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

    it('calls onDelete with todo id when delete button is clicked', async () => {
      const user = userEvent.setup();
      const todo = createMockTodo({ id: 'delete-me-456' });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      await user.click(screen.getByTestId('delete-button'));

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('delete-me-456');
    });
  });

  describe('Accessibility', () => {
    it('has accessible label for TrollDoneButton', () => {
      const todo = createMockTodo({ text: 'Accessible task', completed: false });
      const onComplete = vi.fn();
      const onDelete = vi.fn();

      renderTodoItem({ todo, onComplete, onDelete });

      // TrollDoneButton has aria-label="Mark as complete"
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
