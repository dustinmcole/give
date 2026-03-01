# Testing the Donation Page

## Before You Start
- Open Chrome or Safari on your phone or computer
- You don't need to log in — this is a public page anyone can see

## Where to Go
🔗 **Test URL**: https://give-i62z1left-dustin-coles-projects-548eb4b9.vercel.app/donate/

> ⚠️ **Note**: Vercel's deployment protection is currently ON (you'll get a login screen). 
> To bypass it: go to the Vercel dashboard → Give project → Settings → Deployment Protection → set to "Off" or add yourself as a team member.
> Once that's sorted, the URL above will work.

You'll need a campaign ID to test. The full URL looks like:
`https://give-i62z1left-dustin-coles-projects-548eb4b9.vercel.app/donate/CAMPAIGN-ID`

---

## Test 1: Does the Page Load?

1. Open the donation URL
2. You should see:
   - A "Give" logo in the top-left
   - "Secure donation" text in the top-right
   - The campaign name and description
   - A colored progress bar showing how much has been raised
   - Dollar amount buttons: **$25, $50, $100, $250, $500, $1,000**
   - $50 should already be highlighted/selected

✅ **Pass** if all of the above is visible
❌ **Fail** if the page is blank, shows an error, or is missing any of these elements

---

## Test 2: Picking a Donation Amount

1. Tap/click **$100**
   - The $100 button should light up, $50 should un-highlight
   - You should see a fee breakdown below (something like "Platform fee: $X.XX")
2. Tap/click **$25**
   - Same thing — $25 highlights, $100 un-highlights, fees update
3. Now tap the **Custom** field and type **75**
   - All the dollar buttons should un-highlight
   - Fee breakdown should update for $75
4. Clear the custom field and type **0.50**
   - You should see an error: "Please enter at least $1.00"

✅ **Pass** if amounts switch cleanly and fees update each time
❌ **Fail** if buttons stay stuck, fees don't change, or the $0.50 error doesn't show

---

## Test 3: Cover Fees Toggle

1. Select **$100**
2. Look for a checkbox that says something like "Cover processing fees"
3. Note the total amount shown
4. Check the box
   - The total should go UP (you're now covering Stripe's ~3% fee)
5. Uncheck the box
   - Total should go back to $100

✅ **Pass** if the total changes when you toggle
❌ **Fail** if nothing happens when you check/uncheck

---

## Test 4: Donation Frequency

1. Look for buttons/tabs: **One-time, Monthly, Quarterly, Annual**
2. Tap each one — it should highlight when selected
3. "One-time" should be selected by default

✅ **Pass** if each option highlights correctly
❌ **Fail** if multiple stay highlighted or none highlight

---

## Test 5: Filling Out Your Info and Donating

1. Select $50 (or any amount)
2. Fill in:
   - First Name: **Test**
   - Last Name: **Donor**
   - Email: **test@example.com**
3. Click the **Donate** button
4. The button should show a spinner or say "Processing..."
5. You should either go to a Stripe checkout page OR see a success message

✅ **Pass** if the button responds and you move forward
❌ **Fail** if the button does nothing, stays loading forever, or shows a weird error

---

## Test 6: Try to Donate with Missing Info

1. Delete the email field (leave it blank)
2. Click Donate
3. You should see: **"Please fill in all required fields."**
4. Now clear everything and only type an email
5. Click Donate — same error should appear

✅ **Pass** if the error shows for missing fields
❌ **Fail** if it lets you submit with blank fields or shows no error

---

## Test 7: Bad Campaign Link

1. Change the URL to something fake, like: `/donate/this-does-not-exist`
2. You should see: **"Campaign not found"**
3. There should be a "Return home" link — click it
4. You should go back to the homepage

✅ **Pass** if you see the error page and the link works
❌ **Fail** if you see a blank page, a crash, or a generic error

---

## Mobile Checks (do these on your phone)
- [ ] Dollar amount buttons don't get cut off or overlap
- [ ] You can easily tap the Custom amount field
- [ ] Form fields are big enough to type in without zooming
- [ ] The Donate button is easy to reach with your thumb
- [ ] Text is readable without squinting
