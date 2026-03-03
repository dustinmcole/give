# Known Issues & Fragile Areas

> Max 50 items. Remove resolved issues promptly.

## Active Issues

1. **OpenClaw group:memory tools unavailable** — Docker image lacks memory group tools. Using file-based memory instead. Tracked upstream.
2. **models.json override gotcha** — OpenClaw regenerates per-agent models.json on startup. If these have stale baseUrl, they bypass the Anthropic proxy. Delete and restart to fix.
3. **Gateway token mismatch on restart** — Must use `docker compose stop + up -d`, NOT `restart`. Restart causes token mismatch where agents can't spawn subagents.
