import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';

const STORAGE_KEY = 'trolling-todo-app-todos';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty array when localStorage is empty', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('loads todos from localStorage on mount', () => {
    const existingTodos = [
      { id: '1', text: 'Test todo', completed: false, createdAt: 1000 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTodos));

    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual(existingTodos);
  });

  it('adds a new todo with correct properties', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('New task');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('New task');
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[0].id).toBeDefined();
    expect(result.current.todos[0].createdAt).toBeDefined();
  });

  it('trims whitespace from todo text', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('  Trimmed task  ');
    });

    expect(result.current.todos[0].text).toBe('Trimmed task');
  });

  it('rejects empty or whitespace-only input', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('');
      result.current.addTodo('   ');
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('completes a todo by id', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task to complete');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.completeTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  it('deletes a todo by id', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task to delete');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('persists todos to localStorage on change', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Persisted task');
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].text).toBe('Persisted task');
  });

  it('handles corrupted localStorage data gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid json{');

    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('handles localStorage errors gracefully', () => {
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
    mockSetItem.mockImplementation(() => {
      throw new Error('Storage full');
    });

    const { result } = renderHook(() => useTodos());

    // Should not throw, just log warning
    act(() => {
      result.current.addTodo('Task');
    });

    expect(result.current.todos).toHaveLength(1);
    mockSetItem.mockRestore();
  });
});
