import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { restaurants } from "@/db/schema";

export {
  buildQrPermanentPath,
  buildQrPermanentUrl,
  buildRestaurantPublicPath,
  buildRestaurantPublicUrl,
  getPlatformBaseUrl,
} from "@/lib/utils/public-urls";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export async function generateUniqueSlug(base: string): Promise<string> {
  const db = getDb();
  let slug = slugify(base);
  if (!slug) slug = "restaurant";

  let candidate = slug;
  let suffix = 0;

  while (true) {
    const [existing] = await db
      .select({ id: restaurants.id })
      .from(restaurants)
      .where(eq(restaurants.slug, candidate))
      .limit(1);

    if (!existing) return candidate;
    suffix += 1;
    candidate = `${slug}-${suffix}`;
  }
}
