import { and, eq } from "drizzle-orm";
import { resolveTxt } from "node:dns/promises";
import { getDb } from "@/db";
import { insertReturning, updateReturning } from "@/db/write-helpers";
import { domains, restaurants } from "@/db/schema";
import { hasCapability } from "@/lib/entitlements";
import type { SubscriptionPlan } from "@/lib/entitlements";

export interface TenantResolution {
  restaurantId: string;
  slug: string;
  hostname: string;
  source: "custom_domain" | "platform_subdomain" | "path_slug";
}

export function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().split(":")[0]!;
}

export function isPlatformRootHostname(hostname: string): boolean {
  const normalized = normalizeHostname(hostname);
  const platform = normalizeHostname(
    process.env.PLATFORM_HOSTNAME ?? "menurio.store",
  );

  return (
    normalized === platform ||
    normalized === `www.${platform}` ||
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized.endsWith(".vercel.app")
  );
}

export function normalizeCustomHostname(hostname: string): string {
  const normalized = hostname.trim().toLowerCase().replace(/\.$/, "");
  const labels = normalized.split(".");
  const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

  if (
    normalized.length > 253 ||
    labels.length < 2 ||
    !labels.every((label) => validLabel.test(label))
  ) {
    throw new Error("Enter a valid hostname without a protocol, port, or path");
  }

  return normalized;
}

export function domainVerificationHostname(hostname: string): string {
  return `_menurio-verify.${hostname}`;
}

export function txtRecordsContainVerificationToken(
  records: string[][],
  token: string,
): boolean {
  return records
    .map((chunks) => chunks.join(""))
    .some(
      (record) =>
        record === token || record === `menurio-verification=${token}`,
    );
}

async function domainHasVerificationToken(
  hostname: string,
  token: string,
): Promise<boolean> {
  try {
    const records = await resolveTxt(domainVerificationHostname(hostname));
    return txtRecordsContainVerificationToken(records, token);
  } catch {
    return false;
  }
}

export function parsePlatformSubdomain(
  hostname: string,
  platformHost: string,
): string | null {
  const normalized = normalizeHostname(hostname);
  const platform = normalizeHostname(platformHost);

  if (normalized === platform || normalized === `www.${platform}`) {
    return null;
  }

  const suffix = `.${platform}`;
  if (!normalized.endsWith(suffix)) return null;

  const subdomain = normalized.slice(0, -suffix.length);
  if (!subdomain || subdomain.includes(".")) return null;

  return subdomain;
}

export async function resolveTenantFromHostname(
  hostname: string,
): Promise<TenantResolution | null> {
  const db = getDb();
  const normalized = normalizeHostname(hostname);

  const [domain] = await db
    .select({
      restaurantId: domains.restaurantId,
      hostname: domains.hostname,
      verified: domains.verified,
      slug: restaurants.slug,
      isPublished: restaurants.isPublished,
    })
    .from(domains)
    .innerJoin(restaurants, eq(domains.restaurantId, restaurants.id))
    .where(eq(domains.hostname, normalized))
    .limit(1);

  if (domain?.verified && domain.isPublished) {
    return {
      restaurantId: domain.restaurantId,
      slug: domain.slug,
      hostname: domain.hostname,
      source: "custom_domain",
    };
  }

  const platformHost =
    process.env.PLATFORM_HOSTNAME ?? "menurio.store";
  const subdomain = parsePlatformSubdomain(normalized, platformHost);

  if (subdomain) {
    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.slug, subdomain))
      .limit(1);

    if (restaurant) {
      return {
        restaurantId: restaurant.id,
        slug: restaurant.slug,
        hostname: normalized,
        source: "platform_subdomain",
      };
    }
  }

  return null;
}

export async function addCustomDomain(
  restaurantId: string,
  hostname: string,
  plan: SubscriptionPlan,
) {
  if (!hasCapability(plan, "CUSTOM_DOMAIN")) {
    throw new Error("Custom domains require PRO+ plan");
  }

  const normalized = normalizeCustomHostname(hostname);
  const verificationToken = crypto.randomUUID();

  const domain = await insertReturning(domains, {
    restaurantId,
    hostname: normalized,
    type: "custom",
    verificationToken,
  });

  return domain;
}

export async function verifyDomain(domainId: string, restaurantId: string) {
  const db = getDb();
  const [domain] = await db
    .select()
    .from(domains)
    .where(
      and(
        eq(domains.id, domainId),
        eq(domains.restaurantId, restaurantId),
      ),
    )
    .limit(1);

  if (!domain) {
    throw new Error("Domain not found");
  }
  if (!domain.verificationToken) {
    throw new Error("Domain verification token is missing");
  }
  if (!(await domainHasVerificationToken(domain.hostname, domain.verificationToken))) {
    throw new Error(
      `Add TXT ${domainVerificationHostname(domain.hostname)} with the verification token, then try again`,
    );
  }

  const [primary] = await db
    .select({ id: domains.id })
    .from(domains)
    .where(
      and(
        eq(domains.restaurantId, restaurantId),
        eq(domains.verified, true),
        eq(domains.isPrimary, true),
      ),
    )
    .limit(1);

  const updated = await updateReturning(domains, domain.id, {
    verified: true,
    isPrimary: domain.isPrimary || !primary,
    updatedAt: new Date(),
  });

  return updated;
}

export async function listDomains(restaurantId: string) {
  const db = getDb();
  return db
    .select()
    .from(domains)
    .where(eq(domains.restaurantId, restaurantId));
}
