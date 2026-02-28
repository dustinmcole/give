# Slack — Roger Bot

Post messages to Slack using Roger's own bot token.

## How to Post
```bash
curl -s -X POST "https://slack.com/api/chat.postMessage" \
  -H "Authorization: Bearer $ROGER_SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel": "CHANNEL_ID", "username": "Roger", "text": "Your message here"}'
```

## Rules
- Always include `"username": "Roger"` in every post
- Do NOT include `icon_emoji` — the app profile photo is used instead
- Channel IDs: #internal-give = C0AHNHVFKQD, #internal-rotary = C0AGHLNCL6S
