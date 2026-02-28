# Give — Project Instructions

## Critical Rules (ALL terminals MUST follow)

### 1. Keep PLAN.md Updated
**Update `PLAN.md` immediately when any work is performed.** This includes:
- Marking tasks as started/completed
- Adding new decisions, research findings, or open questions
- Updating architecture choices, tech stack decisions, or feature specs
- Logging any prototyping results or experiment outcomes

PLAN.md is the single source of truth. Read it before starting any work. Update it before ending any work session.

### 2. Follow GitHub Workflow (GITHUB.md)
**Never commit directly to `main`.** All changes must go through feature branches and PRs. Read `GITHUB.md` for the full workflow. Summary:
- Branch from `main`: `git checkout -b feat/my-feature`
- Commit with conventional messages: `feat:`, `fix:`, `docs:`, `chore:`
- Push and create a PR: `gh pr create`
- Verify Vercel preview deployment
- Merge via PR: `gh pr merge --squash --delete-branch`
- Every merge to `main` auto-deploys to Vercel production

### 3. Deploy Every Change
Every change merged to `main` is automatically deployed to Vercel. There is no manual deployment step. Verify deployments succeed after merging.

## Project Overview
Give is a nonprofit fundraising platform — a direct competitor to Givebutter, Give Lively, and Zeffy. Key differentiator: transparent, low-cost pricing (1% basic tier, 2% premium tier) instead of deceptive donor tip models or high subscription fees.

## Directory Structure
```
give/
├── PLAN.md          — Master planning doc (always read first, always update)
├── CLAUDE.md        — This file. Project rules for all terminals.
├── GITHUB.md        — GitHub workflow & deployment rules
├── apps/
│   ├── web/         — Next.js 15 frontend (deployed to Vercel)
│   └── api/         — Hono backend API
├── packages/
│   ├── shared/      — Types, fee calculations, constants
│   └── db/          — Prisma schema & client
├── docs/            — Mintlify documentation site
└── .github/
    └── workflows/   — CI pipeline
```

## Key URLs
- **GitHub:** https://github.com/dustinmcole/give
- **Production:** (Vercel URL — see PLAN.md)
- **Docs:** (Mintlify URL — TBD)

## Tech Stack
- **Frontend:** Next.js 15 + React 19 + Tailwind v4 (Vercel)
- **Backend:** Hono + TypeScript (deployment TBD)
- **Database:** PostgreSQL + Prisma
- **Payments:** Stripe Connect Express
- **Docs:** Mintlify
- **Changelog/Roadmap:** Featurebase
