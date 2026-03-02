import { verifyToken } from "@clerk/backend";
import type { Context, MiddlewareHandler, Next } from "hono";
import { prisma } from "@give/db";

// ─── Hono Context Variables ───────────────────────────────

export type AuthVariables = {
  userId: string;      // internal DB user id
  clerkId: string;     // Clerk subject claim
  orgMemberId: string; // OrgMember.id (set only after requireOrgAccess)
};

// ─── JWT Verification Middleware ──────────────────────────
//
// Extracts the Bearer token, verifies it via Clerk JWKS,
// looks up the User record by clerkId, and attaches userId
// to the Hono context. Returns 401 for missing / invalid tokens.

export const clerkAuth: MiddlewareHandler<{ Variables: AuthVariables }> = async (
  c: Context<{ Variables: AuthVariables }>,
  next: Next
) => {
  const authorization = c.req.header("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized: missing or malformed Authorization header" }, 401);
  }

  const token = authorization.slice(7).trim();
  if (!token) {
    return c.json({ error: "Unauthorized: empty token" }, 401);
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    console.error("CLERK_SECRET_KEY is not configured");
    return c.json({ error: "Internal server error: auth not configured" }, 500);
  }

  let clerkId: string;

  try {
    const payload = await verifyToken(token, { secretKey });
    clerkId = payload.sub;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn("JWT verification failed:", message);
    return c.json({ error: "Unauthorized: invalid token" }, 401);
  }

  // Look up the internal User by clerkId
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, clerkId: true },
  });

  if (!user) {
    // Valid Clerk JWT but user not yet provisioned in our DB
    return c.json({ error: "Unauthorized: user not found" }, 401);
  }

  c.set("clerkId", user.clerkId!);
  c.set("userId", user.id);

  await next();
};

// ─── Org Access Guard ────────────────────────────────────
//
// Must be used after clerkAuth. Resolves the :orgId (or :id as
// orgId depending on route) path parameter, verifies the
// authenticated user is an OrgMember of that org, and returns
// 403 otherwise.

export function requireOrgAccess(
  paramName: "orgId" | "id" | "idOrSlug" = "orgId"
): MiddlewareHandler<{ Variables: AuthVariables }> {
  return async (
    c: Context<{ Variables: AuthVariables }>,
    next: Next
  ) => {
    const userId = c.get("userId");
    const rawParam = c.req.param(paramName);

    if (!rawParam) {
      return c.json({ error: "Bad request: missing org identifier" }, 400);
    }

    // Support both ID and slug look-up (used by idOrSlug routes)
    let orgId: string | null = null;

    if (paramName === "idOrSlug") {
      // Try by ID first, then by slug
      const byId = await prisma.organization.findUnique({
        where: { id: rawParam },
        select: { id: true },
      });
      if (byId) {
        orgId = byId.id;
      } else {
        const bySlug = await prisma.organization.findUnique({
          where: { slug: rawParam },
          select: { id: true },
        });
        orgId = bySlug?.id ?? null;
      }
    } else {
      // For plain id param, try exact match
      const org = await prisma.organization.findUnique({
        where: { id: rawParam },
        select: { id: true },
      });
      orgId = org?.id ?? null;
    }

    if (!orgId) {
      return c.json({ error: "Organization not found" }, 404);
    }

    const membership = await prisma.orgMember.findUnique({
      where: {
        userId_orgId: { userId, orgId },
      },
      select: { id: true },
    });

    if (!membership) {
      return c.json(
        { error: "Forbidden: you are not a member of this organization" },
        403
      );
    }

    c.set("orgMemberId", membership.id);

    await next();
  };
}
