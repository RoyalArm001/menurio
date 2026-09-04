import dotenv from "dotenv";
dotenv.config({ path: ".env.local", override: true });
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { users } from "../src/db/schema";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@menurio.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin2026!Menurio";
  const adminName = process.env.ADMIN_NAME || "Super Admin";

  console.log(`Setting up superadmin: ${adminEmail}`);

  const db = getDb();
  const passwordHash = await hashPassword(adminPassword);
  const now = new Date();

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail.toLowerCase().trim()))
    .limit(1);

  if (existing) {
    await db
      .update(users)
      .set({
        name: adminName,
        passwordHash,
        isPlatformAdmin: true,
        updatedAt: now,
      })
      .where(eq(users.id, existing.id));
    console.log(`✓ Updated existing user ${adminEmail} to superadmin!`);
  } else {
    const id = randomUUID();
    await db.insert(users).values({
      id,
      name: adminName,
      email: adminEmail.toLowerCase().trim(),
      passwordHash,
      isPlatformAdmin: true,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`✓ Created new superadmin user ${adminEmail} with ID: ${id}`);
  }

  console.log(`\n========================================`);
  console.log(`SUPERADMIN ACCOUNT READY:`);
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`========================================\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});
