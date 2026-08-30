"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicRestaurant } from "@/contexts/public-restaurant-context";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function PwaInstallButton() {
  const restaurant = usePublicRestaurant();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() =>
    typeof window !== "undefined" ? isStandalone() : false,
  );
  const [iosHelp, setIosHelp] = useState(false);

  useEffect(() => {
    if (!restaurant.pwa.canInstall || installed) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, [restaurant.pwa.canInstall, installed]);

  if (!restaurant.pwa.canInstall || installed) return null;

  const ios = isIos();
  const canOfferInstall = Boolean(deferred) || ios;
  if (!canOfferInstall && !iosHelp) return null;

  async function handleInstall() {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setDeferred(null);
      }
      return;
    }
    if (ios) {
      setIosHelp(true);
    }
  }

  if (iosHelp) {
    return (
      <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-[var(--r-line)] bg-[var(--r-surface)] p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-[var(--r-text)]">Install {restaurant.pwa.displayName}</p>
            <ol className="mt-2 space-y-1 text-sm text-[var(--r-muted)]">
              <li className="flex items-center gap-2">
                <Share className="size-4 shrink-0" /> Tap Share
              </li>
              <li>Add to Home Screen</li>
            </ol>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setIosHelp(false)}
            className="text-[var(--r-muted)]"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleInstall}
      className="gap-2"
    >
      <Download className="size-4" />
      Install App
    </Button>
  );
}
