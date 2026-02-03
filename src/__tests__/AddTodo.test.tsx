import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddTodo } from '../components/AddTodo';

describe('AddTodo', () => {
  it('renders input and submit button', () => {
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    expect(screen.getByRole('textbox', { name: /new todo input/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls onAdd with trimmed text when form is submitted with valid input', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo input/i });
    await user.type(input, 'Buy groceries');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith('Buy groceries');
  });

  it('trims whitespace from input before calling onAdd', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo input/i });
    await user.type(input, '  Trimmed task  ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledWith('Trimmed task');
  });

  it('clears input after successful submission', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo input/i });
    await user.type(input, 'New task');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(input).toHaveValue('');
  });

  it('does not call onAdd when input is empty', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not call onAdd when input contains only whitespace', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo input/i });
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not clear input when submission is rejected (empty input)', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo input/i });
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Input should still contain the whitespace since submission was rejected
    expect(input).toHaveValue('   ');
  });

  it('allows submitting via Enter key', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo input/i });
    await user.type(input, 'Task via Enter{Enter}');

    expect(onAdd).toHaveBeenCalledWith('Task via Enter');
  });

  it('allows adding multiple todos sequentially', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByRole('textbox', { name: /new todo input/i });
    
    await user.type(input, 'First task');
    await user.click(screen.getByRole('button', { name: /add/i }));
    
    await user.type(input, 'Second task');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(onAdd).toHaveBeenCalledTimes(2);
    expect(onAdd).toHaveBeenNthCalledWith(1, 'First task');
    expect(onAdd).toHaveBeenNthCalledWith(2, 'Second task');
  });
});
