import { MarketingShell } from "@/components/marketing/shell";
import { buttonStyles } from "@/components/ui/button";
import Link from "next/link";
import { registerAndSignInAction } from "@/lib/auth/actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <MarketingShell>
      <div className="site-container flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-[32px] border border-line bg-surface p-8 shadow-soft">
          <h1 className="display-font mt-4 text-3xl font-semibold tracking-tight">
            Create your Menurio account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Register with email and create your first restaurant in one step.
          </p>

          {error ? (
            <p className="mt-4 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
              {error === "account"
                ? "Unable to create account. If you already have one, try signing in."
                : "Registration failed. Please try again."}
            </p>
          ) : null}

          <form action={registerAndSignInAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Your name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="restaurantName" className="text-sm font-medium">
                Restaurant name
              </label>
              <input
                id="restaurantName"
                name="restaurantName"
                required
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className={buttonStyles({ size: "lg", className: "w-full" })}
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
