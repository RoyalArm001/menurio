"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center p-6 text-center">
      <h1 className="display-font text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
