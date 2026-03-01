# Test Script: Organization Onboarding

**What this tests:** A nonprofit admin creating an account and setting up their Give profile + Stripe connection.  
**Time to run:** ~20 minutes  
**Priority:** 🔴 P1

---

## Setup

- You'll need an email address you can access for verification
- Have a test Stripe account available (or use Stripe test mode credentials)
- Start at `/sign-up`

---

## Test 1: Account Creation (Sign Up)

1. Go to `/sign-up`
2. **Verify:** A Clerk-powered sign-up form appears
3. Enter your email and a password, or sign up with Google
4. Complete any email verification step Clerk requires
5. **Verify:** After verification, you are redirected to the onboarding flow (not the dashboard)

---

## Test 2: Onboarding Step 1 — Organization Details

1. **Verify:** You see a page with heading "Step 1: Organization Details"
2. **Verify:** There is a field labeled "Organization Name"
3. **Verify:** There is a field labeled "Organization Slug"
4. Fill in:
   - Organization Name: `Test Nonprofit Inc`
   - Organization Slug: `test-nonprofit`
5. Click **Continue**
6. **Verify:** You move to Step 2

**What can go wrong:** Leaving either field blank and clicking Continue — the form should block submission (both fields are required).

---

## Test 3: Onboarding Step 2 — Payment Setup

1. **Verify:** You see "Step 2: Payment Setup"
2. **Verify:** There is a blue **"Connect with Stripe"** button
3. **Verify:** There is a gray **"Skip for now"** link below it
4. Click **"Skip for now"**
5. **Verify:** You are taken to the campaign creation step (or onboarding complete page)

**Optional (if Stripe test mode is configured):**
- Click "Connect with Stripe" instead
- Verify it redirects to Stripe's OAuth flow
- Complete the Stripe Connect flow in test mode
- Verify you return to the app after completing Stripe setup

---

## Test 4: Sign In (Returning User)

1. Sign out of the app (use the user menu or go to `/sign-in`)
2. Go to `/sign-in`
3. **Verify:** A Clerk sign-in form appears
4. Enter your credentials from Test 1
5. **Verify:** You are redirected to `/dashboard` after sign-in

---

## Test 5: Protected Routes

1. Sign out completely
2. Try to go directly to `/dashboard`
3. **Verify:** You are redirected to `/sign-in` (not shown the dashboard)
4. Try to go to `/dashboard/campaigns`
5. **Verify:** Same redirect to sign-in

---

## Mobile Checks

- [ ] Sign-up form is readable and usable on mobile
- [ ] "Continue" button is easy to tap (full-width)
- [ ] "Connect with Stripe" button is prominently visible
- [ ] "Skip for now" link is tappable (not too small)
