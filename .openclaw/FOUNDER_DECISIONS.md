---
owner: founder
last_updated: 2026-03-02
---

# Founder Decisions

Add new decisions at the top. give-coord reads this every cycle.

## How to Add a Decision

### [Date] — [Brief topic]
**Question:** [from Slack brief]
**Decision:** [your answer]
**Context:** [optional reasoning]

---

## Decisions

### 2026-03-02 — Agent team model assignments
**Question:** Which models for QA and docs agents?
**Decision:** Google Gemini 2.5 Flash for both give-qa and give-docs. Anthropic Opus for coord, Sonnet for dev and reviewer.
**Context:** Cost savings on lower-stakes work. QA and docs do not need Anthropic-tier reasoning.

### 2026-03-02 — Agent coordination docs location
**Question:** Where should agent coordination docs live in the repo?
**Decision:** .openclaw/ directory in repo root.
**Context:** Keeps agent docs separate from Mintlify user-facing docs in docs/. Already established pattern with .openclaw/workspace-state.json.
