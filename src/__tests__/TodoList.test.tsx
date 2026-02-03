import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../components/TodoList';
import type { Todo } from '../types/todo';

// Helper function to create a mock todo
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: `todo-${Math.random().toString(36).substring(7)}`,
  text: 'Test todo',
  completed: false,
  createdAt: Date.now(),
  ...overrides,
});

describe('TodoList', () => {
  describe('Empty State', () => {
    it('displays friendly empty state message when no todos exist', () => {
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={[]} onComplete={onComplete} onDelete={onDelete} />);
      
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No todos yet!')).toBeInTheDocument();
      expect(screen.getByText('Add your first task above to get started.')).toBeInTheDocument();
    });

    it('displays emoji in empty state', () => {
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={[]} onComplete={onComplete} onDelete={onDelete} />);
      
      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    it('does not render todo list container when empty', () => {
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={[]} onComplete={onComplete} onDelete={onDelete} />);
      
      expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
    });
  });

  describe('Todo Display', () => {
    it('renders all todos in a vertical list', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'First todo' }),
        createMockTodo({ id: '2', text: 'Second todo' }),
        createMockTodo({ id: '3', text: 'Third todo' }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      expect(screen.getByTestId('todo-list')).toBeInTheDocument();
      expect(screen.getByText('First todo')).toBeInTheDocument();
      expect(screen.getByText('Second todo')).toBeInTheDocument();
      expect(screen.getByText('Third todo')).toBeInTheDocument();
    });

    it('displays each todo with its description', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'Buy groceries' }),
        createMockTodo({ id: '2', text: 'Walk the dog' }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    });

    it('shows completed status with strikethrough styling', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'Completed task', completed: true }),
        createMockTodo({ id: '2', text: 'Pending task', completed: false }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      const completedText = screen.getByText('Completed task');
      const pendingText = screen.getByText('Pending task');
      
      expect(completedText).toHaveClass('line-through');
      expect(pendingText).not.toHaveClass('line-through');
    });

    it('does not show Done button for completed todos', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'Completed task', completed: true }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      expect(screen.queryByRole('button', { name: /mark.*complete/i })).not.toBeInTheDocument();
    });

    it('shows Done button for incomplete todos', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'Pending task', completed: false }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      expect(screen.getByRole('button', { name: /mark.*complete/i })).toBeInTheDocument();
    });
  });

  describe('Todo Actions', () => {
    // Note: TrollDoneButton has troll behaviors that require multiple clicks
    // and confirmation dialogs before calling onComplete. The button doesn't
    // immediately call onComplete on a single click. Full troll behavior testing
    // is covered in TrollDoneButton.test.tsx and useTrollBehavior.test.ts
    it('renders TrollDoneButton for incomplete todos', () => {
      const todos: Todo[] = [
        createMockTodo({ id: 'test-id-123', text: 'Test task', completed: false }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      // TrollDoneButton should be present
      expect(screen.getByTestId('troll-done-button')).toBeInTheDocument();
    });

    it('calls onDelete with todo id when delete button is clicked', async () => {
      const user = userEvent.setup();
      const todos: Todo[] = [
        createMockTodo({ id: 'delete-id-456', text: 'Task to delete', completed: false }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      await user.click(screen.getByRole('button', { name: /^delete/i }));
      
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('delete-id-456');
    });

    it('shows delete button for all todos (completed and incomplete)', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'Completed task', completed: true }),
        createMockTodo({ id: '2', text: 'Pending task', completed: false }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons).toHaveLength(2);
    });

    it('renders TrollDoneButton for each incomplete todo', () => {
      const todos: Todo[] = [
        createMockTodo({ id: 'first-id', text: 'First task', completed: false }),
        createMockTodo({ id: 'second-id', text: 'Second task', completed: false }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      // Both incomplete todos should have TrollDoneButton
      const trollButtons = screen.getAllByTestId('troll-done-button');
      expect(trollButtons).toHaveLength(2);
    });

    it('handles delete on multiple todos with correct callbacks', async () => {
      const user = userEvent.setup();
      const todos: Todo[] = [
        createMockTodo({ id: 'first-id', text: 'First task', completed: false }),
        createMockTodo({ id: 'second-id', text: 'Second task', completed: false }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      // Click delete on second todo
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[1]);
      
      expect(onDelete).toHaveBeenCalledWith('second-id');
    });
  });

  describe('Accessibility', () => {
    it('has accessible labels for action buttons', () => {
      const todos: Todo[] = [
        createMockTodo({ id: '1', text: 'Accessible task', completed: false }),
      ];
      const onComplete = vi.fn();
      const onDelete = vi.fn();
      
      render(<TodoList todos={todos} onComplete={onComplete} onDelete={onDelete} />);
      
      // TrollDoneButton has aria-label="Mark as complete" (generic, not task-specific)
      expect(screen.getByRole('button', { name: /mark as complete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete "Accessible task"/i })).toBeInTheDocument();
    });
  });
});
