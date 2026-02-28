# Give — GitHub & Deployment Workflow

> **Every Claude terminal working on this project MUST follow these rules.**

## Branch Strategy

```
main (production) ← feature branches only, never direct commits
```

### Rules
1. **Never commit directly to `main`.** All changes go through feature branches + PRs.
2. **Branch naming:** `<type>/<short-description>`
   - `feat/donation-form-redesign`
   - `fix/stripe-webhook-retry`
   - `docs/api-reference-updates`
   - `chore/upgrade-dependencies`
3. **One concern per branch.** Don't mix unrelated changes.
4. **Keep branches short-lived.** Merge within 1-2 days.

### Types
| Prefix | Use |
|--------|-----|
| `feat/` | New features or enhancements |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `chore/` | Dependencies, tooling, CI, config |
| `refactor/` | Code restructuring (no behavior change) |
| `test/` | Adding or updating tests |

## PR Workflow

1. Create a feature branch from `main`
2. Make changes and commit (small, logical commits)
3. Push to origin
4. Create a PR with a clear title and description
5. Vercel creates a **preview deployment** automatically
6. Verify the preview deployment works
7. Merge to `main` → **production deployment** happens automatically

### PR Template
```markdown
## Summary
- What changed and why

## Test Plan
- How to verify this works

## Preview
- Link to Vercel preview deployment
```

## Commit Messages

Follow conventional commits:
```
feat: add recurring donation support
fix: correct fee calculation for ACH payments
docs: update API reference for campaigns endpoint
chore: upgrade stripe SDK to v18
```

- Keep the first line under 72 characters
- Use imperative mood ("add" not "added")
- Reference issue numbers when applicable: `fix: handle webhook retry (#42)`

## Deployment

### Environments
| Branch | Environment | URL |
|--------|------------|-----|
| `main` | Production | give-web.vercel.app |
| Feature branches | Preview | Unique URL per PR |

### How It Works
- **Vercel** is connected to the GitHub repo
- Every push to any branch triggers a build
- PRs get preview deployments with unique URLs
- Merging to `main` deploys to production
- Rollback: Vercel supports instant rollback from the dashboard

### What Gets Deployed
- `apps/web` → Vercel (Next.js frontend)
- `apps/api` → Separate deployment (Railway/Fly.io, TBD)
- `docs/` → Mintlify (separate deployment)

## CI Pipeline (GitHub Actions)

Every PR runs:
1. **Type check** — `tsc --noEmit` on all packages
2. **Lint** — ESLint across the codebase
3. **Build** — `turbo build` to verify everything compiles
4. **Tests** — When tests exist

## For Claude Terminals

When making changes:
```bash
# 1. Always start from up-to-date main
git checkout main && git pull

# 2. Create a feature branch
git checkout -b feat/my-feature

# 3. Make changes, commit
git add <files>
git commit -m "feat: description of change"

# 4. Push and create PR
git push -u origin feat/my-feature
gh pr create --title "feat: description" --body "Summary of changes"

# 5. After PR preview looks good, merge
gh pr merge --squash --delete-branch

# 6. Update PLAN.md with what changed
```

**IMPORTANT:** After every merge to main, Vercel auto-deploys. Verify the deployment succeeded before moving on.
