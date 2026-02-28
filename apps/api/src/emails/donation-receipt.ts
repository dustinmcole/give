export function generateDonationReceiptHtml(data: {
  orgName: string;
  orgEin?: string | null;
  donorName: string;
  amountCents: number;
  date: Date;
  receiptNumber: string;
}): string {
  const formattedAmount = (data.amountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedDate = data.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Donation Receipt</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .footer { margin-top: 30px; border-top: 2px solid #eee; padding-top: 20px; font-size: 0.85em; color: #777; }
        h1 { margin: 0 0 10px 0; color: #111; }
        .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank you for your donation</h1>
          <p>This email serves as your official tax receipt.</p>
        </div>
        
        <p>Dear ${data.donorName},</p>
        
        <p>Thank you for your generous contribution to ${data.orgName}. Your support makes our work possible.</p>
        
        <div class="details">
          <div class="row"><span class="label">Organization:</span> <span>${data.orgName}</span></div>
          ${data.orgEin ? `<div class="row"><span class="label">EIN:</span> <span>${data.orgEin}</span></div>` : ''}
          <div class="row"><span class="label">Receipt Number:</span> <span>${data.receiptNumber}</span></div>
          <div class="row"><span class="label">Date:</span> <span>${formattedDate}</span></div>
          <div class="row"><span class="label">Amount:</span> <span>${formattedAmount}</span></div>
        </div>
        
        <p><strong>No goods or services were provided in exchange for this contribution.</strong></p>
        
        <div class="footer">
          <p>Powered by Give — transparent fundraising at give.to</p>
        </div>
      </div>
    </body>
    </html>
  `;
}