# Test Plan: Donation Flow

## What This Tests
The public donation page where donors give money to a campaign. This is the core product flow.

## Prerequisites
- You need a campaign URL (format: `/donate/{campaignId}`)
- No login required — this is a public page

## Test Steps

### 1. Load the Donation Page
1. Open the campaign donation URL in your browser
2. **Verify**: Page shows the campaign name, description, and a goal thermometer
3. **Verify**: Suggested amounts show: $25, $50, $100, $250, $500, $1,000
4. **Verify**: $50 is selected by default
5. **Verify**: Header shows "Give" logo on left and "Secure donation" on right

### 2. Select a Suggested Amount
1. Click the "$100" button
2. **Verify**: The $100 button is highlighted/selected
3. **Verify**: The fee breakdown updates (should show platform fee + processing fee)
4. Click "$25"
5. **Verify**: Selection switches to $25, fee breakdown updates

### 3. Enter a Custom Amount
1. Click the "Custom" amount field
2. Type "75"
3. **Verify**: Suggested amount buttons are deselected
4. **Verify**: Fee breakdown shows correct fees for $75
5. Clear the field and type "0.50"
6. **Verify**: Should show an error — minimum donation is $1.00

### 4. Toggle "Cover Fees" Checkbox
1. Select $100 donation
2. Note the total amount shown
3. Check the "Cover fees" checkbox
4. **Verify**: Total amount increases (donor pays the processing fee)
5. Uncheck it
6. **Verify**: Total goes back to $100

### 5. Change Donation Frequency
1. Click "Monthly"
2. **Verify**: "Monthly" is selected/highlighted
3. Click "Quarterly", then "Annual", then "One-time"
4. **Verify**: Each option highlights when selected

### 6. Fill in Donor Info and Submit
1. Enter First Name: "Test"
2. Enter Last Name: "Donor"
3. Enter Email: "test@example.com"
4. Click the submit/donate button
5. **Verify**: Button shows loading state (spinner or disabled)
6. **Verify**: Either redirects to Stripe checkout OR shows success message

### 7. Submit with Missing Fields
1. Clear the email field
2. Click donate
3. **Verify**: Error message appears: "Please fill in all required fields."
4. Clear all fields and enter only email
5. Click donate
6. **Verify**: Same error message

### 8. Invalid Campaign
1. Go to `/donate/fake-campaign-id-12345`
2. **Verify**: Shows "Campaign not found" message
3. **Verify**: "Return home" link is visible and works

## Mobile Checks
- [ ] Suggested amounts wrap nicely on small screens (don't overflow)
- [ ] Custom amount field is easy to tap
- [ ] Form fields are large enough to tap without zooming
- [ ] Submit button is full-width and easy to reach with thumb
- [ ] Fee breakdown text is readable (not tiny)

## Common Failures
- Fee calculation shows wrong numbers (compare with $100 + 2.9% + $0.30)
- Custom amount field doesn't clear suggested selection
- "Cover fees" doesn't update the total
- Submit button stays in loading state forever after error
- Campaign not found page doesn't show on bad IDs
