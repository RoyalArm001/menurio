import { createHash } from "crypto";

export function hashIp(ip: string): string {
  const salt = process.env.ANALYTICS_IP_SALT ?? "menurio-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function truncateUserAgent(ua: string | null, max = 256): string | null {
  if (!ua) return null;
  return ua.slice(0, max);
}

export function getClientIp(headers: Headers): string | null {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    null
  );
}
