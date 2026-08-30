import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveTenantFromHostname } from "@/services/domain.service";

/** Resolve tenant from Host header — used on custom domains (server-side only) */
export async function resolveTenantFromRequest() {
  const hdrs = await headers();
  const hostname = hdrs.get("x-hostname") ?? hdrs.get("host") ?? "";
  if (!hostname) return null;
  return resolveTenantFromHostname(hostname);
}

export async function redirectIfCustomDomainRoot() {
  try {
    const tenant = await resolveTenantFromRequest();
    if (tenant) {
      redirect(`/r/${tenant.slug}`);
    }
  } catch {
    /* DB unavailable — keep serving platform homepage */
  }
}
