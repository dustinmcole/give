import { prisma } from "@give/db";

/**
 * Generates a unique receipt number for a donation.
 *
 * Format: REC-{YYYYMMDD}-{sequential 4-digit padded number}
 * Example: REC-20260301-0001
 *
 * Sequential counter is per-org per-day, ensuring uniqueness within
 * an organization. The receiptNumber is stored on the Donation record.
 */
export async function generateReceiptNumber(
  orgId: string,
  date: Date = new Date()
): Promise<string> {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const prefix = `REC-${dateStr}-`;

  // Count how many receipts this org already has for today
  // to determine the next sequential number
  const count = await prisma.donation.count({
    where: {
      orgId,
      receiptNumber: {
        startsWith: prefix,
      },
    },
  });

  const sequential = String(count + 1).padStart(4, "0");
  return `${prefix}${sequential}`;
}
