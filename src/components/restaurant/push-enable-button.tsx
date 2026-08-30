"use client";

import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicRestaurant } from "@/contexts/public-restaurant-context";
import { useToast } from "@/components/ui/toast";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

export function PushEnableButton() {
  const restaurant = usePublicRestaurant();
  const { push } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!restaurant.push.canSubscribe) return null;
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return null;
  }

  async function enableNotifications() {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        push("Notification permission denied", "error");
        return;
      }

      const vapidKey = restaurant.push.vapidPublicKey;
      if (!vapidKey) {
        push("Push is not configured", "error");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const res = await fetch(`/api/public/restaurants/${restaurant.slug}/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Subscribe failed");
      }

      setEnabled(true);
      push("Notifications enabled", "success");
    } catch (e) {
      push(e instanceof Error ? e.message : "Could not enable notifications", "error");
    } finally {
      setLoading(false);
    }
  }

  if (enabled || Notification.permission === "granted") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--r-muted)]">
        <Bell className="size-3.5" /> Notifications on
      </span>
    );
  }

  if (Notification.permission === "denied") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[var(--r-muted)]">
        <BellOff className="size-3.5" /> Notifications blocked
      </span>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={loading}
      onClick={enableNotifications}
      className="gap-2"
    >
      <Bell className="size-4" />
      {loading ? "Enabling…" : "Enable notifications"}
    </Button>
  );
}
