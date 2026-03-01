# Test Script: Donor Management

**What this tests:** Viewing the list of donors in the admin dashboard.  
**Time to run:** ~5 minutes  
**Priority:** 🟢 P3

---

## Setup

- Must be signed in
- Go to `/dashboard/donors`

---

## Test 1: Donors Page Loads

1. Navigate to `/dashboard/donors`
2. **Verify:** The page loads without a crash or blank screen
3. **Verify:** If donors exist, they appear in a list or table
4. **Verify:** Each donor row shows at minimum: name and email (or "Anonymous" if they chose that)

---

## Test 2: No Donors State

1. If no donations have been made yet, the donors list should be empty
2. **Verify:** An empty state message appears (not just a blank white area)

---

## Notes for Tester

- This page is early-stage — if you encounter a blank page or error, log it with a screenshot
- Anonymous donors should NOT have their email displayed anywhere visible
