import { NextResponse } from "next/server";
import { getRestaurantPublicProfile } from "@/services/restaurant.service";
import { resolveTenantDesign } from "@/services/design.service";
import {
  buildRestaurantWebManifest,
  isPwaAvailableForRestaurant,
} from "@/services/pwa.service";
import {
  applySecurityHeaders,
  jsonError,
} from "@/lib/security/middleware-helpers";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const profile = await getRestaurantPublicProfile(slug);

  if (!profile || !profile.restaurant.isPublished) {
    return jsonError("Not found", 404);
  }

  const plan = profile.subscription?.plan ?? "FREE";
  if (
    !isPwaAvailableForRestaurant({
      slug,
      restaurantName: profile.restaurant.name,
      plan,
      settings: profile.settings,
    })
  ) {
    return jsonError("PWA not available for this restaurant", 403);
  }

  const design = await resolveTenantDesign(profile.restaurant.id, plan);
  const manifest = buildRestaurantWebManifest({
    slug,
    restaurantName: profile.restaurant.name,
    logoUrl: design.logoUrl ?? profile.restaurant.logoUrl,
    settings: profile.settings,
    plan,
    publicBasePath: request.headers.get("x-menurio-public-host") ? "/" : undefined,
  });

  return applySecurityHeaders(
    NextResponse.json(manifest, {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=300",
      },
    }),
  );
}
