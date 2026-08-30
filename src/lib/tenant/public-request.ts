import { headers } from "next/headers";
import { resolveTenantFromHostname, normalizeHostname } from "@/services/domain.service";
import { buildRestaurantPublicPath } from "@/lib/utils/public-urls";

export type PublicRequestContext = {
  publicBasePath: string;
  customHostname: string | null;
};

/**
 * The proxy sets x-menurio-public-host only after resolving a verified custom
 * domain. Validate it again here before using it in links or SEO metadata.
 */
export async function getPublicRequestContext(
  restaurantId: string,
  slug: string,
): Promise<PublicRequestContext> {
  const requestHeaders = await headers();
  const customHostname = requestHeaders.get("x-menurio-public-host");
  const requestHostname = requestHeaders.get("host");

  if (
    customHostname &&
    requestHostname &&
    normalizeHostname(customHostname) === normalizeHostname(requestHostname)
  ) {
    const tenant = await resolveTenantFromHostname(customHostname);
    if (
      tenant?.source === "custom_domain" &&
      tenant.restaurantId === restaurantId
    ) {
      return { publicBasePath: "", customHostname: tenant.hostname };
    }
  }

  return {
    publicBasePath: buildRestaurantPublicPath(slug),
    customHostname: null,
  };
}
