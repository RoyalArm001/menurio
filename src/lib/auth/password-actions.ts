"use server";

import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/email";

export async function forgotPasswordAction(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Return success anyway to prevent email enumeration
      return { success: true };
    }

    const token = nanoid(32);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(verificationTokens).values({
      identifier: `reset:${email}`,
      token,
      expires,
    }).onDuplicateKeyUpdate({
      set: { token, expires }
    });

    const emailResult = await sendPasswordResetEmail(email, token);
    
    if (!emailResult.success) {
      console.error("Failed to send reset email", emailResult.error);
      return { error: "Failed to send reset email. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: "An unexpected error occurred." };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    const vt = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });

    if (!vt || vt.expires < new Date() || !vt.identifier.startsWith("reset:")) {
      return { error: "Invalid or expired reset token" };
    }

    const email = vt.identifier.replace("reset:", "");
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { error: "User not found" };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.id, user.id));

    // Delete token so it can't be reused
    await db.delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "An unexpected error occurred." };
  }
}
