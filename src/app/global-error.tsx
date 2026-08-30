"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-[#FBF8F2] p-6">
        <div className="max-w-md rounded-[24px] border border-[#E8E4DC] bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-semibold text-[#1D1B18]">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-[#706C65]">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-[#96691F] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
