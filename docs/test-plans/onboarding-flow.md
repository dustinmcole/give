# Testing the Nonprofit Signup Flow

## Before You Start
- Open Chrome or Safari on your computer (desktop is easier for this one)
- You'll be creating a test account, so use a throwaway email

## Where to Go
🔗 **Test URL**: https://give-i62z1left-dustin-coles-projects-548eb4b9.vercel.app/sign-up

> ⚠️ **Note**: Vercel's deployment protection is currently ON (you'll get a login screen). 
> To bypass it: go to the Vercel dashboard → Give project → Settings → Deployment Protection → set to "Off" or add yourself as a team member.

---

## Test 1: Create an Account

1. Go to the sign-up page
2. Fill in:
   - Email: **testorg@example.com** (or any throwaway)
   - Password: **TestPass123!**
3. Click **Sign Up** (or whatever the button says)
4. You should either:
   - See a "Check your email" message, OR
   - Go straight to the onboarding wizard

✅ **Pass** if your account is created and you move forward
❌ **Fail** if you get an error or nothing happens

---

## Test 2: Organization Details

1. After signing up, you should see a form asking about your organization
2. Fill in:
   - Org Name: **Test Nonprofit**
   - EIN: **12-3456789**
   - Website: **https://example.org**
3. Click **Next** or **Continue**
4. You should move to the next step

✅ **Pass** if you advance to the next step
❌ **Fail** if the form won't submit or shows an unexpected error

---

## Test 3: Stripe Connection

1. You should see a step about connecting to Stripe
2. Click the **Connect Stripe** button
3. You should be redirected to Stripe's onboarding page
4. (You can stop here — just verify Stripe's page loads)

✅ **Pass** if Stripe's page opens
❌ **Fail** if the button does nothing or you get an error

---

## Test 4: Onboarding Complete

1. After all steps, you should see a success/welcome screen
2. There should be a link to your **Dashboard**
3. Click it — you should see your org dashboard

✅ **Pass** if you reach the dashboard
❌ **Fail** if you're stuck or redirected somewhere weird

---

## Test 5: Try to Skip Steps

1. Start over (new browser/incognito)
2. After creating an account, try going directly to the dashboard URL
3. You should be redirected back to onboarding — can't skip steps

✅ **Pass** if skipping is blocked
❌ **Fail** if you can access the dashboard without completing onboarding
