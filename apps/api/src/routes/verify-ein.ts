import { Hono } from "hono";

export const verifyEinRoutes = new Hono();

// ─── EIN Verification Response ────────────────────────────

interface EinVerificationResult {
  valid: boolean;
  name?: string;
  city?: string;
  state?: string;
  deductibility?: string;
  status?: string;
  revoked?: boolean;
}

// ─── ProPublica Nonprofit Explorer API ───────────────────
// Free, no auth needed — looks up 501(c)(3) orgs by EIN.
// https://projects.propublica.org/nonprofits/api/v2

async function lookupProPublica(ein: string): Promise<EinVerificationResult> {
  const cleanEin = ein.replace("-", "");
  const url = `https://projects.propublica.org/nonprofits/api/v2/organizations/${cleanEin}.json`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Give.fund EIN Verification/1.0" },
    signal: AbortSignal.timeout(8000),
  });

  if (res.status === 404) {
    return { valid: false };
  }

  if (!res.ok) {
    throw new Error(`ProPublica API error: ${res.status}`);
  }

  const data = (await res.json()) as any;
  const org = data?.organization;

  if (!org) {
    return { valid: false };
  }

  // ProPublica returns `subsection_code` for 501(c)(3) = "03"
  const is501c3 = org.subsection_code === "03";

  if (!is501c3) {
    return { valid: false };
  }

  // Check revocation status via IRS auto-revocation field
  // ProPublica includes `revocation_date` if revoked
  const revoked = !!org.revocation_date;

  return {
    valid: !revoked,
    revoked,
    name: org.name ?? undefined,
    city: org.city ?? undefined,
    state: org.state ?? undefined,
    deductibility: org.deductibility_code ?? undefined,
    status: revoked ? "revoked" : "active",
  };
}

// ─── GET /api/verify-ein/:ein ─────────────────────────────
// Public endpoint — no auth required. Rate limiting handled by
// the middleware layer (or reverse proxy in production).

verifyEinRoutes.get("/:ein", async (c) => {
  const einParam = c.req.param("ein");

  // Validate EIN format: XX-XXXXXXX or XXXXXXXXX (9 digits)
  const normalized = einParam.replace(/\D/g, "");
  if (normalized.length !== 9) {
    return c.json(
      { error: "EIN must be 9 digits in XX-XXXXXXX format" },
      400
    );
  }

  const formattedEin = `${normalized.slice(0, 2)}-${normalized.slice(2)}`;

  try {
    const result = await lookupProPublica(formattedEin);
    return c.json(result);
  } catch (err) {
    console.error("EIN verification error:", err);
    // Fail open — don't block onboarding due to upstream API issues
    return c.json(
      {
        valid: false,
        error: "Verification service temporarily unavailable",
      },
      503
    );
  }
});
