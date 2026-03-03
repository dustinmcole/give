# Team Patterns & Conventions

> Preferred patterns discovered through implementation. Max 100 lines.

## Code Patterns
- API routes follow: `apps/api/src/routes/{resource}.ts` with Zod schemas at top
- organizationId scoping is in auth middleware, not per-query
- Import from `packages/db/src/` — never from `packages/db/dist/`
- Use `cuid()` for all IDs (Prisma default)
- Soft delete for donor/donation records (deletedAt timestamp)

## PR Conventions
- Branch: `ocdev/feat/issue-N-short-desc` or `ocdev/fix/issue-N-short-desc`
- Commit: `feat(#N): description` with `Closes #N` in body
- Always add `ocdev` label to bot PRs
- Reviews use --approve or --request-changes (never --comment)

## Pipeline Flow
- dev(:05,:35) → reviewer(:00,:30) → qa(:15,:45) → merge(:20,:50)
- PR can flow through entire pipeline within one hour
