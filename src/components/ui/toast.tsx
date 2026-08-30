"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/format";

type Toast = { id: string; message: string; tone?: "default" | "success" | "error" };

const ToastContext = createContext<{
  push: (message: string, tone?: Toast["tone"]) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: Toast["tone"] = "default") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-full px-5 py-3 text-sm font-semibold shadow-float",
              toast.tone === "success" && "bg-success text-white",
              toast.tone === "error" && "bg-red-600 text-white",
              toast.tone === "default" && "bg-night text-white",
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
