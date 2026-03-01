# Test Plan: Nonprofit Onboarding Flow

## What This Tests
The signup flow where a nonprofit organization creates their account and connects Stripe to receive donations.

## Prerequisites
- You need a Clerk account (sign up at the sign-up page)
- You'll need a Stripe test account for the Stripe connection step

## Test Steps

### 1. Sign Up
1. Go to the sign-up page (Local: `http://localhost:3000/sign-up` | Prod: `https://give-web.vercel.app/sign-up`)
2. **Verify**: Clerk sign-up form appears
3. Create an account with email + password
4. **Verify**: Redirected to the onboarding flow (`/onboarding`)

### 2. Step 1 — Organization Details
1. **Verify**: Page shows "Step 1: Organization Details"
2. **Verify**: Two fields visible: "Organization Name" and "Organization Slug"
3. Leave both fields empty and click "Continue"
4. **Verify**: Browser validation prevents submission (fields are required)
5. Type Organization Name: "Test Nonprofit"
6. Type Organization Slug: "test-nonprofit"
7. Click "Continue"
8. **Verify**: Redirected to `/onboarding/stripe`

### 3. Step 2 — Stripe Connection
1. **Verify**: Page shows Stripe connection step
2. Click the connect/link Stripe button
3. **Verify**: Redirected to Stripe's onboarding flow (or Stripe Connect modal)
4. Complete Stripe test onboarding (use test data)
5. **Verify**: Redirected back to `/onboarding/complete` or next step

### 4. Onboarding Complete
1. **Verify**: Success page shows
2. **Verify**: Link/button to go to dashboard
3. Click to go to dashboard
4. **Verify**: Dashboard loads at `/dashboard`

### 5. Dashboard Access
1. **Verify**: Dashboard shows campaigns section
2. **Verify**: Donors section is accessible
3. **Verify**: Navigation works between dashboard pages

## Mobile Checks
- [ ] Sign-up form renders properly on mobile
- [ ] Organization Name / Slug fields are full-width
- [ ] "Continue" button is easy to tap
- [ ] Stripe redirect works on mobile browser
- [ ] Dashboard is usable on mobile (no horizontal scrolling)

## Common Failures
- Slug field allows special characters that break URLs
- Stripe redirect doesn't return to the right page
- User can skip steps by navigating directly to `/onboarding/complete`
- Dashboard is blank if Stripe isn't connected yet
- No error message if Stripe connection fails
