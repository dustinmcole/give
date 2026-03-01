# Build Coordination — Give Platform

**Purpose:** Central tracking file for autonomous builder agents. Roger reads this before each build cycle.

## Reference Documents

| Document | Purpose |
|----------|---------|
| PLAN.md | Full product strategy, roadmap, architecture |
| DEVELOPMENT.md | Technical setup, monorepo structure |
| PROMPTS.md | Execution prompts (Phase 1-3) |
| GITHUB.md | Branch/PR/commit conventions |

---

## Roger Task Queue (Give Builder Agent)

**Builder:** Roger (Gemini 3.1 Pro via OpenClaw)
**Channel:** #internal-give
**Branch pattern:** `roger/{feature-name}`

### Phase 2 Tasks (from PROMPTS.md)

#### Priority 1: Onboarding Flow (Prompt 5)
- **Scope:** New organization onboarding wizard
- **Assignee:** Roger
- **Status:** Not started
- **Acceptance:** Wizard completes successfully.

#### Priority 2: Dashboard Data (Prompt 6)
- **Scope:** Dashboard charts and data fetching
- **Assignee:** Roger
- **Status:** Not started
- **Acceptance:** Dashboard shows real data.

#### Priority 3: Salesforce Field Mapping UI (Prompt 8)
- **Scope:** SF Field mapping
- **Assignee:** Roger
- **Status:** Not started
- **Acceptance:** Users can map fields to Salesforce objects.

---

## Completed

- Phase 1: Authentication (Clerk) - PR #6
- Phase 1: Stripe Elements Integration - PR #9
- Phase 1: Email Receipt Service - PR #7
- Phase 1: Salesforce SFDX Setup - PR #8
- Phase 2: Salesforce Backend Integration (Prompt 7) - PR #10

---

## Known Issues

- Previews failing on Vercel (`Git author infinitepho must have access to the project on Vercel`). Not a blocker for code merges, but blocks live preview for builder.
- Ensure PR merges are pulled down before starting next prompt.

---

## Shared Conventions

- pnpm monorepo (packages: @give/web, @give/api, @give/db, @give/shared)
- Turbo for orchestration
- Conventional commits (feat:, fix:, chore:, etc.)
- Feature branches → PRs → squash merge to main
- Always build before pushing: `pnpm turbo build`
