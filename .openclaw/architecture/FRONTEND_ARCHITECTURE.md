---
owner: give-dev
last_updated: 2026-03-02
---

# Frontend Architecture

## Stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript (strict mode)

## Directory Structure
```
apps/web/
  src/
    app/           # Next.js App Router pages/layouts
    components/    # Shared UI components
    hooks/         # Custom React hooks
    lib/           # Utilities, API client, constants
    types/         # Shared TypeScript types
```

## Patterns
- Server Components by default; Client Components only for interactivity
- Mobile-first responsive design (375px breakpoint first)
- Loading skeletons for data-dependent UI (not spinners)
- Error boundaries around async data components
- All event handlers: handle[Action] (e.g., handleSubmit)
- Co-locate component + test + types

## Key Constraints
- Donation form loads in <2 seconds on simulated 3G
- Lighthouse score >90
- WCAG 2.1 AA minimum (keyboard nav, ARIA labels, 4.5:1 contrast)
- No inline styles — Tailwind only
- No default exports except pages/layouts

## Components to Document
(give-dev: update this as you build components)
