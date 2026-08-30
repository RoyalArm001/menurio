/**
 * Production error reporting hook.
 * Implement provider integration here (Sentry, Datadog, etc.).
 */
export function reportError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV === "development") {
    console.error("[reportError]", context, error);
    return;
  }
  // Future: send to external monitoring provider
  console.error("[reportError]", context, error instanceof Error ? error.message : error);
}
