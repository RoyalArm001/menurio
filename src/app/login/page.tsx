import { MarketingShell } from "@/components/marketing/shell";
import { buttonStyles } from "@/components/ui/button";
import Link from "next/link";
import {
  loginWithCredentialsAction,
  loginWithGoogleAction,
} from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const redirectTo =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <MarketingShell>
      <div className="site-container flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-[32px] border border-line bg-surface p-8 shadow-soft">
          <h1 className="display-font mt-4 text-3xl font-semibold tracking-tight">
            Sign in to Menurio
          </h1>
          <p className="mt-2 text-sm text-muted">
            {googleConfigured
              ? "Sign in with your email and password, or continue with Google."
              : "Sign in with your email and password."}
          </p>

          {error ? (
            <p className="mt-4 rounded-xl bg-danger/10 px-3 py-2 text-sm text-danger">
              Invalid email or password.
            </p>
          ) : null}

          <form action={loginWithCredentialsAction} className="mt-6 space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />
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
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className={buttonStyles({ size: "lg", className: "w-full" })}
            >
              Sign in
            </button>
          </form>

          {googleConfigured ? (
            <form action={loginWithGoogleAction} className="mt-4">
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <button
                type="submit"
                className={buttonStyles({
                  variant: "secondary",
                  size: "lg",
                  className: "w-full",
                })}
              >
                Continue with Google
              </button>
            </form>
          ) : null}

          <p className="mt-6 text-center text-sm text-muted">
            New to Menurio?{" "}
            <Link href="/register" className="font-semibold text-brand">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
