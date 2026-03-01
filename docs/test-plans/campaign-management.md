# Test Script: Campaign Management

**What this tests:** Viewing and managing donation campaigns from the admin dashboard.  
**Time to run:** ~10 minutes  
**Priority:** 🟡 P2

---

## Setup

- Must be signed in
- Go to `/dashboard/campaigns`

---

## Test 1: Campaign List Page Loads

1. Navigate to `/dashboard/campaigns`
2. **Verify:** The page loads without errors
3. **Verify:** Existing campaigns appear (if any exist in the system)
4. **Verify:** Each campaign shows its title, some status indicator, and a raised amount

---

## Test 2: Campaign Detail / Donate Link

1. If a campaign exists, find its public donate URL
2. Open a new browser tab and go to `/donate/[campaign-id]`
3. **Verify:** The campaign page loads with the correct title and description
4. **Verify:** The goal thermometer reflects the correct raised/goal amounts

---

## Test 3: Invalid Campaign URL

1. Go to `/donate/this-campaign-does-not-exist`
2. **Verify:** A "Campaign not found" message appears
3. **Verify:** There is a "Return home" link
4. Click "Return home"
5. **Verify:** You go to `/`

---

## Mobile Checks

- [ ] Campaign list is scrollable and readable on mobile
- [ ] Campaign cards/rows don't overflow the screen
