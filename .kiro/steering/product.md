---
inclusion: always
---

# Product Overview

A Todo demonstration app for Kiro showcasing both good UX and intentionally "troll" patterns to illustrate how Kiro catches requirements issues.

## Core Features

| Feature | Description |
|---------|-------------|
| Todo CRUD | Add, complete, delete items |
| Persistence | localStorage for data retention |
| Theming | Dark/light mode support |
| Animations | Framer Motion transitions |

## "Troll" UX Patterns (Intentional)

The "Done" button demonstrates bad UX for educational purposes:
- Escapes cursor on hover
- Multi-step confirmation dialogs
- Rotates/shrinks on each click
- "Fatigue" mechanic (easier to catch after escapes)

## Development Guidelines

When modifying this codebase:
- Preserve troll behaviors unless explicitly fixing them via a spec
- New features should follow good UX patterns by default
- Use specs to document any UX behavior changes
- Test both happy path and troll behavior interactions
