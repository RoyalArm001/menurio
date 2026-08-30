import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";

export async function isPlatformAdmin(userId: string): Promise<boolean> {
  const db = getDb();
  const [user] = await db
    .select({ email: users.email, isPlatformAdmin: users.isPlatformAdmin })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return false;
  if (user.isPlatformAdmin) return true;

  const allowlist =
    process.env.PLATFORM_ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ??
    [];
  return allowlist.includes(user.email.toLowerCase());
}
