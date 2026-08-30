import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { createId } from "@/db/write-helpers";
import { hashPassword } from "@/lib/auth/password";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string) {
  const db = getDb();
  const normalized = normalizeEmail(email);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);
  return user ?? null;
}

export async function findUserById(id: string) {
  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user ?? null;
}

export async function createUserWithPassword(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  const db = getDb();
  const id = createId();
  const now = new Date();
  await db.insert(users).values({
    id,
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    passwordHash: input.passwordHash,
    createdAt: now,
    updatedAt: now,
  });
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) throw new Error("Failed to create user");
  return user;
}

export async function setUserPassword(userId: string, plainPassword: string) {
  const db = getDb();
  const passwordHash = await hashPassword(plainPassword);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));
}
