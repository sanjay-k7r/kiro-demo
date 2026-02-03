import { AnimatePresence } from 'framer-motion';
import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { TrollButtonProvider } from './TrollButtonContext';

interface TodoListProps {
  todos: Todo[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onComplete, onDelete }: TodoListProps) {
  // Show friendly empty state when no todos exist
  if (todos.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-state">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-black dark:text-white text-lg font-bold uppercase">
          No todos yet!
        </p>
        <p className="text-black dark:text-white text-sm mt-2 font-mono">
          Add your first task above to get started.
        </p>
      </div>
    );
  }

  return (
    // TROLL: Wrap with TrollButtonProvider so only ONE button can be displaced at a time
    <TrollButtonProvider>
      <div className="space-y-3" data-testid="todo-list">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </div>
    </TrollButtonProvider>
  );
}
