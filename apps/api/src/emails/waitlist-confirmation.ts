// ─── Waitlist Confirmation Email Template ──────────────────────────────────────
//
// Sent when a nonprofit joins the beta waitlist.

export interface WaitlistConfirmationData {
  orgName: string;
  email: string;
}

export function buildWaitlistConfirmationHtml(
  data: WaitlistConfirmationData
): string {
  const { orgName } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Give waitlist!</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f4f4f5;">
    You're on the list! We'll be in touch soon.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color:#2563eb;padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:-0.5px;">Give</h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;letter-spacing:0.5px;">Fundraising That&apos;s Fair</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="margin:0 0 12px;color:#111827;font-size:24px;font-weight:700;">
                You&apos;re on the list! 🎉
              </h2>
              <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
                Hi ${orgName},
              </p>
              <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.7;">
                Thanks for joining the Give beta waitlist. We&apos;re building the fundraising platform nonprofits actually deserve — transparent pricing, no donor tips, automatic payouts.
              </p>
              <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.7;">
                We&apos;ll reach out when your spot is ready. In the meantime, here&apos;s what you can expect:
              </p>

              <!-- What to expect -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                     style="border:1px solid #e5e7eb;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                          <p style="margin:0;color:#111827;font-size:14px;">
                            <span style="font-size:18px;margin-right:10px;">✅</span>
                            <strong>1% platform fee</strong> — no monthly subscription
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                          <p style="margin:0;color:#111827;font-size:14px;">
                            <span style="font-size:18px;margin-right:10px;">🚫</span>
                            <strong>Zero donor tips</strong> — what your donors give goes to your mission
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                          <p style="margin:0;color:#111827;font-size:14px;">
                            <span style="font-size:18px;margin-right:10px;">💸</span>
                            <strong>Automatic daily/weekly payouts</strong> — no manual withdrawals
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;">
                          <p style="margin:0;color:#111827;font-size:14px;">
                            <span style="font-size:18px;margin-right:10px;">🛠️</span>
                            <strong>Every feature included</strong> — CRM, events, peer-to-peer, reporting
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                Questions? Just reply to this email — we read every one.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                Give &mdash; Fundraising That&apos;s Fair<br />
                You&apos;re receiving this because you joined our beta waitlist.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function buildWaitlistConfirmationText(
  data: WaitlistConfirmationData
): string {
  const { orgName } = data;
  return `You're on the Give waitlist!

Hi ${orgName},

Thanks for joining the Give beta waitlist. We're building the fundraising platform nonprofits actually deserve — transparent pricing, no donor tips, automatic payouts.

We'll reach out when your spot is ready. Here's what to expect:

✅ 1% platform fee — no monthly subscription
🚫 Zero donor tips — what your donors give goes to your mission
💸 Automatic daily/weekly payouts — no manual withdrawals
🛠️ Every feature included — CRM, events, peer-to-peer, reporting

Questions? Just reply to this email — we read every one.

—
Give — Fundraising That's Fair
You're receiving this because you joined our beta waitlist.
`;
}
