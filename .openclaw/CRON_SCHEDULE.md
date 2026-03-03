---
owner: give-coord
---

# Agent Cron Schedule

All times Pacific (PT). Cron uses PT timezone via schedule.tz setting.

## Current Schedule

| Job ID | Agent | Time (PT) | Purpose |
|---|---|---|---|
| give-dream-weekday-am | give-coord | 9:00 AM M-F | Morning dream cycle (Lobster, 4-phase feedback loop) |
| give-dream-weekday-pm | give-coord | 3:00 PM M-F | Afternoon dream cycle (Lobster, 4-phase feedback loop) |
| give-dream-weekend | give-coord | 3:00 AM Sat/Sun | Weekend dream + coord (no feedback loop) |
| give-coord-sonnet | give-coord > Sonnet | Every 30 min | Coordination cycle — delegates to Sonnet subagent |
| give-coord-opus | give-coord | 9:00 PM daily | Daily deep strategic pass |
| give-review-scan | give-reviewer | Every 30 min | PR review scan |
| give-qa-scan | give-qa | :15/:45 every hour | QA scan (offset from review) |
| give-docs-scan | give-docs | 6:00 PM daily | Documentation scan |

## Staggering Rationale

- QA scans offset by 15 min from review scans to avoid resource contention
- Dream cycles run before coord cycles so context is fresh
- Weekend dream cycle has no feedback loop (Dustin offline)
- Coord-sonnet runs frequently but delegates to Sonnet to minimize Opus token spend
- Daily coord-opus pass at 9 PM for strategic depth

## Pipeline Flow

```
give-dev opens PR (label: ocdev)
  > give-coord routes to give-qa
  > give-qa runs tests, adds qa-passed or qa-needed label
  > give-coord routes to give-reviewer
  > give-reviewer runs gh pr review --approve or --request-changes (as datawake-bot)
  > give-coord auto-merges PRs with reviewDecision=APPROVED + qa-passed
  > give-coord routes to give-docs for documentation
```

## How Routing Works

give-coord acts as the central message router. During each cycle, it checks sessions_history for messages from all agents and forwards them to the appropriate next agent per the routing protocol.
