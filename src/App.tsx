import { useTodos } from './hooks/useTodos';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const { todos, addTodo, completeTodo, deleteTodo } = useTodos();

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden">
      {/* Comic-style halftone background pattern */}
      <div className="fixed inset-0 comic-dots text-black dark:text-white pointer-events-none" />
      
      {/* Header */}
      <header className="bg-white dark:bg-black border-b-2 border-black dark:border-white relative z-10">
        <div className="container mx-auto px-4 py-6 max-w-2xl flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-white uppercase tracking-wider transform -rotate-1">
            TODO
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        {/* AddTodo Component */}
        <div className="mb-8">
          <div className="p-6 bg-white dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transform rotate-[0.5deg]">
            <AddTodo onAdd={addTodo} />
          </div>
        </div>

        {/* TodoList Component */}
        <TodoList 
          todos={todos} 
          onComplete={completeTodo} 
          onDelete={deleteTodo} 
        />
      </main>
    </div>
  );
}

export default App;
