export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { resolveQrDestination } from "@/services/qr.service";
import { trackEvent } from "@/services/analytics.service";
import { headers } from "next/headers";

type RouteContext = { params: Promise<{ permanentId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { permanentId } = await context.params;
  const destination = await resolveQrDestination(permanentId);

  if (!destination) {
    return new Response("QR code not found", { status: 404 });
  }

  const hdrs = await headers();
  try {
    await trackEvent(
      destination.restaurantId,
      {
        eventType: "qr_scan",
        metadata: { permanentId, path: destination.url },
      },
      hdrs,
    );
  } catch {
    // Analytics must not block redirect
  }

  redirect(destination.url);
}
