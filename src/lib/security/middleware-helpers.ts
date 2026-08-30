import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { rateLimitBuckets } from "@/db/schema";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

function createRateLimitBucketKey(prefix: string, ip: string): string {
  return createHash("sha256")
    .update(`${prefix}:${ip}`)
    .digest("hex");
}

async function checkDatabaseRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const db = getDb();
  const now = new Date();
  const nextResetAt = new Date(now.getTime() + windowMs);

  return db.transaction(async (tx) => {
    // INSERT ... ON DUPLICATE KEY serializes concurrent requests for this key.
    await tx
      .insert(rateLimitBuckets)
      .values({
        bucketKey: key,
        requestCount: 0,
        resetAt: now,
        updatedAt: now,
      })
      .onDuplicateKeyUpdate({
        set: { updatedAt: now },
      });

    const [entry] = await tx
      .select()
      .from(rateLimitBuckets)
      .where(eq(rateLimitBuckets.bucketKey, key))
      .limit(1)
      .for("update");
    if (!entry) throw new Error("Rate-limit bucket was not created");

    if (entry.resetAt.getTime() <= now.getTime()) {
      await tx
        .update(rateLimitBuckets)
        .set({ requestCount: 1, resetAt: nextResetAt, updatedAt: now })
        .where(eq(rateLimitBuckets.bucketKey, key));
      return {
        allowed: true,
        remaining: limit - 1,
        resetAt: nextResetAt.getTime(),
      };
    }

    if (entry.requestCount >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt.getTime(),
      };
    }

    const count = entry.requestCount + 1;
    await tx
      .update(rateLimitBuckets)
      .set({ requestCount: count, updatedAt: now })
      .where(eq(rateLimitBuckets.bucketKey, key));
    return {
      allowed: true,
      remaining: limit - count,
      resetAt: entry.resetAt.getTime(),
    };
  });
}

export async function pruneExpiredRateLimitBuckets(
  olderThan: Date,
): Promise<void> {
  const db = getDb();
  await db.execute(
    sql`DELETE FROM ${rateLimitBuckets} WHERE ${rateLimitBuckets.resetAt} < ${olderThan}`,
  );
}

export function applySecurityHeaders(response: NextResponse): NextResponse {
  const scriptSources =
    process.env.NODE_ENV === "production"
      ? "'self' 'unsafe-inline' https://www.googletagmanager.com"
      : "'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com";

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' https: data:; connect-src 'self' https:; script-src ${scriptSources}; style-src 'self' 'unsafe-inline'; worker-src 'self';`,
  );
  return response;
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function withRateLimit(
  request: NextRequest,
  prefix: string,
  limit = 60,
  windowMs = 60_000,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (process.env.NODE_ENV !== "production") {
    return checkRateLimit(`${prefix}:${ip}`, limit, windowMs);
  }

  try {
    return await checkDatabaseRateLimit(
      createRateLimitBucketKey(prefix, ip),
      limit,
      windowMs,
    );
  } catch {
    // Fail closed when the shared limiter is unavailable in production.
    return { allowed: false, remaining: 0, resetAt: Date.now() + windowMs };
  }
}
