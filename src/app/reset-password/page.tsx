"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordAction } from "@/lib/auth/password-actions";
import { Wordmark } from "@/components/brand/wordmark";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600 font-medium bg-red-50 p-4 rounded-xl border border-red-100">
          Invalid or missing reset token.
        </p>
        <Link href="/forgot-password" className="text-ink underline hover:no-underline font-medium inline-block mt-4">
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Please enter a new password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await resetPasswordAction(token as string, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium border border-green-100">
          Password updated successfully!
        </div>
        <p className="text-sm text-ink/60">Redirecting to login...</p>
        <Link href="/login" className="text-ink underline hover:no-underline font-medium inline-block">
          Click here if not redirected
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          New Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full h-11 px-3 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full h-11 px-3 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-ink text-white rounded-xl font-medium text-sm hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50 transition-all"
      >
        {loading ? "Saving..." : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Wordmark />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-black/5">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Set new password</h1>
            <p className="text-sm text-ink/60 mt-2">
              Choose a strong password to secure your account.
            </p>
          </div>

          <Suspense fallback={<div className="text-center p-4 text-sm text-ink/60">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
