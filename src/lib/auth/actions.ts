"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { registerUserWithRestaurant, RegistrationError } from "@/services/registration.service";

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function loginWithCredentialsAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");
  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: safeRedirect,
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as any).digest === "string" &&
      (error as any).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    if (error instanceof AuthError) {
      redirect(`/login?error=invalid&next=${encodeURIComponent(safeRedirect)}`);
    }
    console.error("Login authentication error:", error);
    redirect(`/login?error=invalid&next=${encodeURIComponent(safeRedirect)}`);
  }
}

export async function loginWithGoogleAction(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");
  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/dashboard";
  await signIn("google", { redirectTo: safeRedirect });
}

export async function registerAndSignInAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const restaurantName = String(formData.get("restaurantName") ?? "").trim();

  try {
    await registerUserWithRestaurant({ name, email, password, restaurantName });
  } catch (error) {
    if (error instanceof RegistrationError) {
      redirect("/register?error=account");
    }
    redirect("/register?error=failed");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as any).digest === "string" &&
      (error as any).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    if (error instanceof AuthError) {
      redirect("/login?next=/dashboard");
    }
    console.error("Registration sign-in error:", error);
    redirect("/login?next=/dashboard");
  }
}
