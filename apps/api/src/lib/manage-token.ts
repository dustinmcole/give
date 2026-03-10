import { createHmac } from "crypto";

const SECRET = process.env.MANAGE_TOKEN_SECRET ?? "dev-manage-secret";

/**
 * Generate a signed management token for a donor self-service URL.
 * Format: base64url(donorId:orgId).HMAC
 */
export function generateManageToken(donorId: string, orgId: string): string {
  const payload = Buffer.from(`${donorId}:${orgId}`).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/**
 * Validate and decode a management token.
 * Returns { donorId, orgId } or null if invalid.
 */
export function verifyManageToken(
  token: string
): { donorId: string; orgId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, sig] = parts;
  const expectedSig = createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");

  if (sig !== expectedSig) return null;

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    const [donorId, orgId] = decoded.split(":");
    if (!donorId || !orgId) return null;
    return { donorId, orgId };
  } catch {
    return null;
  }
}
