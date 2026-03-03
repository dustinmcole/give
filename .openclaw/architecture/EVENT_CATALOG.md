---
owner: give-dev
last_updated: 2026-03-02
---

# Event Catalog

Every action in Give emits an event. Events drive webhooks, automations, AI features, and analytics.

## Convention
- Event names: domain.action (e.g., donation.received, donor.created)
- Payload includes: eventType, organizationId, timestamp, data
- All events logged for audit trail

## Events

(give-dev: document each event as you implement it)

### Template

```
### domain.action
**Emitted by:** [endpoint or service]
**Added:** WI-XXXX
**Payload:**
  {
    eventType: "domain.action",
    organizationId: string,
    timestamp: ISO8601,
    data: {
      // event-specific fields
    }
  }
**Consumers:** [webhooks, AI feature store, analytics, etc.]
```

## Planned Events (Phase 1)
- donation.received — one-time gift processed
- donation.recurring_created — recurring gift set up
- donation.recurring_processed — recurring gift charged
- donor.created — new donor record
- donor.updated — donor info changed
- form.submitted — donation form submission
- form.abandoned — donation form started but not completed
- receipt.sent — tax receipt emailed
- org.onboarded — new organization completed setup
