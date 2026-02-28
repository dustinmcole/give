# Roger Memory

## Project: Give
- Nonprofit fundraising platform competing with Givebutter, Give Lively, Zeffy
- 1% basic tier fee, 2% pro tier fee — transparent pricing
- Monorepo: Turborepo + pnpm (apps/web, apps/api, packages/shared, packages/db)
- Frontend: Next.js 15, React 19, Tailwind CSS v4
- Backend: Hono + TypeScript
- Database: Prisma + PostgreSQL
- Payments: Stripe Connect Express
- Docs: Mintlify
- GitHub: dustinmcole/give (private)
- Vercel: give-web (auto-deploys from main)
- First production deployment: 2026-02-28

## Current State (as of 2026-02-28)
- Scaffold complete (monorepo, API routes, frontend pages, Prisma schema, shared fee calculations)
- CI/CD operational (GitHub Actions + Vercel auto-deploy)
- No auth yet (Clerk planned — Prompt 1)
- No real Stripe integration yet (Stripe Elements planned — Prompt 2)
- No database provisioned yet (need PostgreSQL)
- PROMPTS.md has 9 phased build prompts ready to execute

## Build Execution Order (from PROMPTS.md)
Phase 1 (parallel): Auth (Clerk), Stripe Elements, Email receipts, SF SFDX setup
Phase 2 (after auth): Onboarding, Dashboard data, SF backend
Phase 3 (after phase 2): SF mapping UI, Polish
