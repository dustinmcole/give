// ─── Donation Receipt Email Template ──────────────────────────────────────────
//
// Generates IRS-compliant donation receipt HTML emails.
// For donations > $250, includes written acknowledgment per IRS Publication 1771.
//
// References:
//   - IRS Pub 1771: Charitable Contributions—Substantiation and Disclosure Requirements
//   - IRS Rev. Proc. 2011-52: Written acknowledgment requirements

export interface DonationReceiptData {
  // Org
  orgName: string;
  orgEin?: string | null;

  // Donor
  donorFirstName: string;
  donorLastName: string;
  donorEmail: string;

  // Donation
  amountCents: number;
  currency: string;
  donationDate: Date;
  receiptNumber: string;
  campaignName: string;

  // Optional dedication
  dedicationType?: string | null;
  dedicationName?: string | null;
}

function formatCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Builds IRS-required acknowledgment language.
 * For all donations: no goods or services statement.
 * For donations > $250: includes written acknowledgment per IRS rules.
 */
function buildAcknowledgment(
  amountCents: number,
  orgName: string,
  orgEin: string | null | undefined
): string {
  const einLine = orgEin
    ? `<p style="margin:8px 0;color:#555;">EIN: ${orgEin}</p>`
    : "";

  const baseAck = `
    <p style="margin:8px 0;color:#555;">
      No goods or services were provided in exchange for this contribution.
    </p>
    ${einLine}
    <p style="margin:8px 0;color:#555;">
      ${orgName} is a tax-exempt organization under Section 501(c)(3) of the
      Internal Revenue Code. Your contribution may be tax-deductible to the
      extent permitted by law. Please consult your tax advisor.
    </p>`;

  // IRS requires written acknowledgment for donations > $250
  if (amountCents > 25000) {
    return `
      ${baseAck}
      <p style="margin:12px 0;color:#555;font-weight:600;">
        Written Acknowledgment (Required for contributions of $250 or more):
      </p>
      <p style="margin:8px 0;color:#555;">
        This letter serves as the written acknowledgment required by Internal
        Revenue Service regulations for your charitable contribution of
        ${formatCurrency(amountCents, "usd")} to ${orgName}. We confirm that
        no goods or services were provided to you in exchange for this
        contribution. Please retain this receipt for your tax records.
      </p>`;
  }

  return baseAck;
}

export function buildDonationReceiptHtml(data: DonationReceiptData): string {
  const {
    orgName,
    orgEin,
    donorFirstName,
    donorLastName,
    amountCents,
    currency,
    donationDate,
    receiptNumber,
    campaignName,
    dedicationType,
    dedicationName,
  } = data;

  const formattedAmount = formatCurrency(amountCents, currency);
  const formattedDate = formatDate(donationDate);
  const acknowledgment = buildAcknowledgment(amountCents, orgName, orgEin);

  const dedicationSection =
    dedicationType && dedicationName
      ? `
      <tr>
        <td style="padding:8px 0;color:#888;font-size:14px;width:160px;">Dedication</td>
        <td style="padding:8px 0;color:#333;font-size:14px;">
          ${dedicationType === "in_honor" ? "In Honor of" : "In Memory of"} ${dedicationName}
        </td>
      </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Donation Receipt — ${orgName}</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Preheader text (hidden, shows in email clients) -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f4f4f5;">
    Your donation receipt from ${orgName} — ${formattedAmount} on ${formattedDate}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:580px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color:#16a34a;padding:32px 40px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">
                Official Donation Receipt
              </p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:28px;font-weight:700;">
                ${orgName}
              </h1>
            </td>
          </tr>

          <!-- Amount hero -->
          <tr>
            <td style="background-color:#f0fdf4;padding:28px 40px;text-align:center;border-bottom:1px solid #dcfce7;">
              <p style="margin:0;color:#15803d;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
                Donation Amount
              </p>
              <p style="margin:8px 0 0;color:#15803d;font-size:48px;font-weight:700;line-height:1;">
                ${formattedAmount}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <p style="margin:0 0 24px;color:#333;font-size:16px;">
                Dear ${donorFirstName} ${donorLastName},
              </p>
              <p style="margin:0 0 28px;color:#555;font-size:15px;line-height:1.6;">
                Thank you for your generous contribution to <strong>${orgName}</strong>.
                Your support makes a real difference. This email serves as your
                official donation receipt for tax purposes.
              </p>

              <!-- Receipt details table -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                     style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:28px;">
                <tr>
                  <td style="background-color:#f9fafb;padding:10px 20px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;color:#111;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                      Receipt Details
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding:8px 0;color:#888;font-size:14px;width:160px;">Receipt #</td>
                        <td style="padding:8px 0;color:#333;font-size:14px;font-weight:600;">${receiptNumber}</td>
                      </tr>
                      <tr style="border-top:1px solid #f3f4f6;">
                        <td style="padding:8px 0;color:#888;font-size:14px;">Date</td>
                        <td style="padding:8px 0;color:#333;font-size:14px;">${formattedDate}</td>
                      </tr>
                      <tr style="border-top:1px solid #f3f4f6;">
                        <td style="padding:8px 0;color:#888;font-size:14px;">Campaign</td>
                        <td style="padding:8px 0;color:#333;font-size:14px;">${campaignName}</td>
                      </tr>
                      <tr style="border-top:1px solid #f3f4f6;">
                        <td style="padding:8px 0;color:#888;font-size:14px;">Organization</td>
                        <td style="padding:8px 0;color:#333;font-size:14px;">${orgName}</td>
                      </tr>
                      ${dedicationSection}
                      <tr style="border-top:1px solid #e5e7eb;">
                        <td style="padding:12px 0;color:#111;font-size:15px;font-weight:700;">Total</td>
                        <td style="padding:12px 0;color:#16a34a;font-size:15px;font-weight:700;">${formattedAmount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Tax acknowledgment -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                     style="border:1px solid #fde68a;border-radius:6px;background-color:#fffbeb;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;color:#92400e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                      📄 Tax Deductibility Information
                    </p>
                    ${acknowledgment}
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">
                Questions about your donation? Reply to this email or contact
                ${orgName} directly. Please keep this receipt for your tax records.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                This receipt was automatically generated by Give on behalf of ${orgName}.
                <br />Receipt #${receiptNumber} &bull; ${formattedDate}
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
  <!-- /Outer wrapper -->

</body>
</html>`;
}

export function buildDonationReceiptText(data: DonationReceiptData): string {
  const {
    orgName,
    orgEin,
    donorFirstName,
    donorLastName,
    amountCents,
    currency,
    donationDate,
    receiptNumber,
    campaignName,
  } = data;

  const formattedAmount = formatCurrency(amountCents, currency);
  const formattedDate = formatDate(donationDate);
  const einLine = orgEin ? `EIN: ${orgEin}\n` : "";
  const over250 =
    amountCents > 25000
      ? `\nWRITTEN ACKNOWLEDGMENT (Required for contributions of $250 or more):\nThis letter serves as the written acknowledgment required by Internal Revenue Service regulations for your charitable contribution of ${formattedAmount} to ${orgName}. We confirm that no goods or services were provided to you in exchange for this contribution. Please retain this receipt for your tax records.\n`
      : "";

  return `OFFICIAL DONATION RECEIPT
${orgName}
${"=".repeat(50)}

Dear ${donorFirstName} ${donorLastName},

Thank you for your generous contribution to ${orgName}. This email serves as your official donation receipt for tax purposes.

RECEIPT DETAILS
---------------
Receipt #:    ${receiptNumber}
Date:         ${formattedDate}
Campaign:     ${campaignName}
Organization: ${orgName}
Amount:       ${formattedAmount}

TAX DEDUCTIBILITY INFORMATION
------------------------------
No goods or services were provided in exchange for this contribution.
${einLine}${orgName} is a tax-exempt organization under Section 501(c)(3) of the Internal Revenue Code. Your contribution may be tax-deductible to the extent permitted by law. Please consult your tax advisor.
${over250}
Please keep this receipt for your tax records.

Questions? Reply to this email or contact ${orgName} directly.

---
Receipt #${receiptNumber} | ${formattedDate}
Generated by Give on behalf of ${orgName}
`;
}
