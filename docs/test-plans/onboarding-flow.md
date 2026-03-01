# Testing the Nonprofit Signup Flow

## Before You Start
- Open Chrome or Safari on your computer (desktop is easier for this one)
- You'll be creating a test account, so use a throwaway email

## Where to Go
🔗 **Test URL**: Check the QA Issue in GitHub for the current preview link
(It looks like: `https://give-xxxxx.vercel.app/sign-up`)

If you don't have a link, ask in #internal-give.

---

## Test 1: Create an Account

1. Go to the sign-up URL
2. You should see a sign-up form (powered by Clerk)
3. Enter an email and password
4. Complete any verification step (email code, etc.)
5. After signing up, you should land on the **onboarding page** (`/onboarding`)

✅ **Pass** if you end up on a page that says "Step 1: Organization Details"
❌ **Fail** if you get stuck, see an error, or go somewhere unexpected

---

## Test 2: Enter Organization Details

1. On the "Step 1: Organization Details" page, you'll see two fields:
   - **Organization Name** — the nonprofit's display name
   - **Organization Slug** — a short URL-friendly name (like "habitat-for-humanity")
2. Try clicking "Continue" with both fields empty
   - Your browser should stop you (fields are required)
3. Now fill in:
   - Organization Name: **Test Nonprofit**
   - Organization Slug: **test-nonprofit**
4. Click **Continue**
5. You should go to the Stripe connection page (`/onboarding/stripe`)

✅ **Pass** if you move to the Stripe page
❌ **Fail** if nothing happens, you see an error, or you stay on the same page

---

## Test 3: Stripe Connection

1. On the Stripe page, you should see a button to connect your Stripe account
2. Click it
3. You should be redirected to Stripe's website to set up payments
4. (In test mode, you can use Stripe's test data to complete this)
5. After finishing on Stripe, you should come back to the Give app

✅ **Pass** if the redirect works both ways (Give → Stripe → Give)
❌ **Fail** if the Stripe redirect breaks, or you can't get back to Give

---

## Test 4: Onboarding Complete

1. After Stripe, you should see a success/completion page
2. Look for a button or link to go to your **Dashboard**
3. Click it
4. You should land on `/dashboard`

✅ **Pass** if you reach the dashboard
❌ **Fail** if the completion page is missing or the dashboard link is broken

---

## Test 5: Try to Skip Steps

1. Without finishing onboarding, try going directly to:
   - `/onboarding/stripe` (skip org details)
   - `/onboarding/complete` (skip everything)
   - `/dashboard` (skip all of onboarding)
2. Each should either redirect you back to the correct step or show an error

✅ **Pass** if you can't skip ahead
❌ **Fail** if you can access later steps without completing earlier ones

---

## Mobile Checks
- [ ] Sign-up form works on your phone
- [ ] Organization Name and Slug fields are full-width
- [ ] "Continue" button is easy to tap
- [ ] Stripe redirect works in mobile browser (not just desktop)
