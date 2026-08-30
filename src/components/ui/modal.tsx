"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative z-10 max-h-[92vh] w-full overflow-auto rounded-t-[28px] bg-surface p-6 shadow-float sm:max-w-lg sm:rounded-[28px]",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 id="modal-title" className="text-xl font-semibold text-ink">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "bottom";
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute flex flex-col bg-surface shadow-float",
          side === "right"
            ? "inset-y-0 right-0 w-full max-w-md"
            : "inset-x-0 bottom-0 max-h-[88vh] rounded-t-[28px]",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}
