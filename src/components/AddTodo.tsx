import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AddTodoProps {
  onAdd: (text: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate non-empty input (trim whitespace)
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      return;
    }
    
    // Call the onAdd callback with the trimmed text
    onAdd(trimmedValue);
    
    // Clear input after successful add
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1"
        aria-label="New todo input"
      />
      <Button type="submit">
        Add
      </Button>
    </form>
  );
}
