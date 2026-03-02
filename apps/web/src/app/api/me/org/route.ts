import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * GET /api/me/org
 *
 * Server-side Next.js route that resolves the Clerk user's organization.
 * Uses Clerk's server-side `auth()` to get the userId, then forwards it
 * to the backend API via a trusted internal header.
 */
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_URL}/api/orgs/me`, {
      headers: {
        "x-clerk-user-id": userId,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Unknown error" }));
      return NextResponse.json(body, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in /api/me/org:", err);
    return NextResponse.json({ error: "Failed to resolve org" }, { status: 500 });
  }
}
