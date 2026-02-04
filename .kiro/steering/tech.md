---
inclusion: always
---

# Tech Stack

## Core Technologies

- **React 19** with TypeScript (strict mode enabled)
- **Vite 7** for build tooling
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin

## Key Libraries

| Library | Purpose | Usage Notes |
|---------|---------|-------------|
| framer-motion | Animations | Use for transitions, hover effects, layout animations |
| radix-ui | UI primitives | Prefer over custom implementations for accessibility |
| lucide-react | Icons | Import individual icons, not the entire package |
| class-variance-authority | Component variants | Use `cva()` for components with multiple visual states |
| clsx + tailwind-merge | Class utilities | Use `cn()` helper from `@/lib/utils` |
| uuid | ID generation | Use `v4()` for unique identifiers |

## Code Conventions

- Use `@/*` path alias for imports (maps to `./src/*`)
- Prefer named exports over default exports
- Use TypeScript interfaces for component props
- Apply `cn()` utility for conditional/merged Tailwind classes

## Testing

| Tool | Purpose | Command |
|------|---------|---------|
| Vitest | Test runner (jsdom) | `npm test` |
| @testing-library/react | Component testing | - |
| fast-check | Property-based testing | Place in `__tests__/properties/` |

### Testing Guidelines

- Run `npm test` (uses `--run` flag) for single execution
- Property-based tests go in `src/__tests__/properties/`
- Use `@testing-library/react` patterns: `render`, `screen`, `userEvent`

## Commands

```bash
npm run dev           # Dev server
npm run build         # TypeScript check + production build
npm test              # Run tests once
npm run test:coverage # Tests with coverage
npm run lint          # ESLint check
```
