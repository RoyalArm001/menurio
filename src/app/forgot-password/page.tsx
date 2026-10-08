"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/auth/password-actions";
import { Wordmark } from "@/components/brand/wordmark";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await forgotPasswordAction(email);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Wordmark />
        </Link>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-ink/60 hover:text-ink transition-colors"
          >
            Back to login
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-black/5">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Reset password</h1>
            <p className="text-sm text-ink/60 mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {success ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center text-sm border border-green-100">
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 px-3 rounded-xl border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-ink text-white rounded-xl font-medium text-sm hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:opacity-50 transition-all"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
