---
agent: give-dev
last_updated: 2026-03-03T06:30:00Z
---

## Recent Actions (last 5 cycles)

(memory system initialized — no prior actions)

## Learned Patterns
- Check CODEBASE_INDEX.md before exploring files
- API routes: apps/api/src/routes/{resource}.ts with Zod at top
- Import from packages/db/src/ — NEVER from packages/db/dist/
- organizationId scoping handled in auth middleware

## Known File Relationships

(will populate as code is written)

## Common Mistakes to Avoid
- Don't read every file — use CODEBASE_INDEX.md to find what you need
- Run pnpm lint && pnpm type-check && pnpm test before every PR
- Always include Closes #N in commit body
