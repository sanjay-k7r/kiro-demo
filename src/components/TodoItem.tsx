import { motion } from 'framer-motion';
import { useCallback, useRef } from 'react';
import type { Todo } from '../types/todo';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { TrollDoneButton } from './TrollDoneButton';
import type { TrollDoneButtonRef } from './TrollDoneButton';

interface TodoItemProps {
  todo: Todo;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * TodoItem Component
 * 
 * Displays a single todo item with its text, completion status, and action buttons.
 * Animated entry/exit using Framer Motion.
 * 
 * Requirements:
 * - 1.2: Show each Todo_Item with its description and status
 * - 2.5: Animate the item appearing in the list
 * - 3.1: Delete button removes item from the list
 * - 3.2: Animate the item disappearing from the list
 */
export function TodoItem({ todo, onComplete, onDelete }: TodoItemProps) {
  const trollButtonRef = useRef<TrollDoneButtonRef>(null);
  
  // Memoize the complete handler to prevent infinite loops in TrollDoneButton
  const handleComplete = useCallback(() => {
    onComplete(todo.id);
  }, [onComplete, todo.id]);

  // Reset button position when mouse leaves the todo item
  const handleMouseLeave = useCallback(() => {
    trollButtonRef.current?.resetPosition();
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ 
        duration: 0.2,
        layout: { duration: 0.3 }
      }}
      className="flex items-center gap-3 p-4 bg-white dark:bg-black border-2 border-black dark:border-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all hover:-translate-y-[2px]"
      data-testid={`todo-item-${todo.id}`}
      onMouseLeave={handleMouseLeave}
    >
      {/* Todo text and status */}
      <div className="flex-1 min-w-0">
        <p 
          className={`text-black dark:text-white truncate font-mono text-base ${
            todo.completed ? 'line-through opacity-50' : ''
          }`}
          data-testid="todo-text"
        >
          {todo.text}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* TrollDoneButton - The intentionally broken "Done" button with troll behaviors */}
        {/* TROLL: This button moves away on hover, rotates, shrinks, and requires multiple clicks */}
        {/* TROLL: Only ONE button can be displaced at a time - others return to normal */}
        {/* Requirement 4.9: When todo is finally marked complete after all Troll_Behavior */}
        <TrollDoneButton
          ref={trollButtonRef}
          onComplete={handleComplete}
          isCompleted={todo.completed}
          todoId={todo.id}
        />
        
        {/* Delete button with trash icon */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.text}"`}
          className="text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          data-testid="delete-button"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
