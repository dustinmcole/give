# Test Script: Dashboard Overview

**What this tests:** The admin dashboard that nonprofit staff use to see their fundraising stats.  
**Time to run:** ~10 minutes  
**Priority:** 🟡 P2

---

## Setup

- Must be signed in as an org admin
- Go to `/dashboard`

---

## Test 1: Stat Cards Display

1. Navigate to `/dashboard`
2. **Verify:** Four stat cards appear in a row (or 2x2 grid on smaller screens):
   - **Total Raised** — shows a dollar amount
   - **Total Donors** — shows a count
   - **Active Campaigns** — shows a count
   - **Donations This Month** — shows a count
3. **Verify:** Each card has a small colored icon in the top-right corner
4. **Verify:** Each card shows a secondary line (e.g., "+12% this month", "2 ending soon")

---

## Test 2: Recent Donations Table

1. Scroll down past the stat cards
2. **Verify:** A table or list of recent donations appears
3. **Verify:** Each row shows: donor name, amount (formatted as currency), campaign name, date, and status badge
4. **Verify:** Anonymous donations show as "Anonymous" (not a blank name)
5. **Verify:** Status badges exist (should show "succeeded" or similar)

---

## Test 3: Dashboard Navigation

1. Look for the sidebar or top navigation
2. Click **Campaigns** in the nav
3. **Verify:** You land on `/dashboard/campaigns`
4. Click **Donors** in the nav
5. **Verify:** You land on `/dashboard/donors`
6. Click the main logo or "Overview" link
7. **Verify:** You return to `/dashboard`

---

## Mobile Checks

- [ ] Stat cards stack vertically (1 column) or go 2x2 — not overflowing horizontally
- [ ] The recent donations list is readable (text not cut off)
- [ ] Navigation is accessible (hamburger menu or bottom nav)
