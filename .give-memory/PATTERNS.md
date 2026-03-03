# Team Patterns & Conventions

## Code Patterns
- API routes: apps/api/src/routes/{resource}.ts with Zod schemas at top
- organizationId scoping in auth middleware
- Import from packages/db/src/ — never packages/db/dist/

## PR Conventions
- Branch: ocdev/feat/issue-N-short-desc or ocdev/fix/...
- Reviews: --approve or --request-changes (never --comment)
