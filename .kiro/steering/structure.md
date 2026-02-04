# Project Structure

```
src/
├── components/          # React components
│   ├── ui/              # Reusable UI primitives (Button, Card, Dialog, Input)
│   ├── AddTodo.tsx      # Todo input form
│   ├── TodoItem.tsx     # Individual todo display
│   ├── TodoList.tsx     # Todo list container
│   ├── TrollDoneButton.tsx  # "Troll" done button with bad UX
│   ├── TrollButtonContext.tsx  # Context for troll button coordination
│   ├── ThemeProvider.tsx    # Dark/light theme context
│   ├── ThemeToggle.tsx      # Theme switch button
│   └── ConfirmationDialog.tsx  # Troll confirmation dialogs
├── hooks/               # Custom React hooks
│   ├── useTodos.ts      # Todo CRUD operations + localStorage
│   └── useTrollBehavior.ts  # Troll button state machine
├── types/               # TypeScript type definitions
│   ├── todo.ts          # Todo interface
│   └── index.ts         # Type exports
├── lib/                 # Utility functions
│   └── utils.ts         # cn() helper for class merging
├── __tests__/           # Test files
│   └── properties/      # Property-based tests
├── test/                # Test configuration
│   └── setup.ts         # Vitest setup
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Conventions

- **Components**: Functional components with TypeScript interfaces for props
- **Hooks**: Custom hooks in `hooks/` directory, prefixed with `use`
- **Types**: Centralized in `types/` with barrel exports via `index.ts`
- **Tests**: Co-located in `__tests__/` directory, named `*.test.ts(x)`
- **UI Components**: Reusable primitives in `components/ui/` using CVA for variants
