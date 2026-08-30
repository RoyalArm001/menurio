"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/states";
import type { PlanEntitlements } from "@/lib/entitlements";
import { canSchedulePush, canUsePush } from "@/lib/entitlements";

type Campaign = {
  id: string;
  title: string;
  message: string;
  status: string;
  scheduledAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
};

export default function NotificationsClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const { push } = useToast();
  const [entitlements, setEntitlements] = useState<PlanEntitlements | null>(null);
  const [plan, setPlan] = useState<string>("FREE");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sendMode, setSendMode] = useState<"now" | "schedule">("now");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const rest = await api.getRestaurant(activeRestaurant.id);
      setEntitlements(rest.entitlements as PlanEntitlements);
      setPlan((rest.subscription as { plan?: string })?.plan ?? "FREE");
      if (canUsePush(((rest.subscription as { plan?: string })?.plan ?? "FREE") as "FREE")) {
        const data = await api.listNotificationCampaigns(activeRestaurant.id);
        setCampaigns((data.campaigns as Campaign[]) ?? []);
      }
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load on restaurant change
    void load();
  }, [activeRestaurant?.id, load]);

  async function createCampaign() {
    if (!activeRestaurant) return;
    setSaving(true);
    try {
      await api.createNotificationCampaign(activeRestaurant.id, {
        title,
        message,
        targetUrl: targetUrl || undefined,
        imageUrl: imageUrl || undefined,
        sendNow: sendMode === "now",
        scheduledAt:
          sendMode === "schedule" && scheduledAt
            ? new Date(scheduledAt).toISOString()
            : undefined,
      });
      push(sendMode === "now" ? "Notification sent" : "Notification scheduled", "success");
      setTitle("");
      setMessage("");
      setTargetUrl("");
      setImageUrl("");
      setScheduledAt("");
      await load();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Send failed", "error");
    } finally {
      setSaving(false);
    }
  }

  if (ctxLoading) return <p className="text-muted">Loading…</p>;
  if (!activeRestaurant) {
    return <EmptyState title="No restaurant" description="Create a restaurant first." />;
  }

  const canPush = entitlements ? canUsePush(plan as "FREE") : false;
  const canSchedule = entitlements ? canSchedulePush(plan as "FREE") : false;

  if (!canPush) {
    return (
      <div className="space-y-4">
        <h1 className="display-font text-3xl font-semibold tracking-tight">Notifications</h1>
        <Card>
          <CardHeader title="Available on PRO" />
          <p className="text-sm text-muted">
            Upgrade to PRO to send push notifications to customers who subscribe on your public menu.
          </p>
          <Link href="/dashboard/subscription">
            <Button className="mt-4">Upgrade to PRO</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">Notifications</h1>
        <p className="mt-2 text-muted">Send push notifications to subscribed customers.</p>
      </div>

      <Card>
        <CardHeader title="New notification" />
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          </div>
          <div>
            <Label>Message</Label>
            <Input value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
          </div>
          <div>
            <Label>Target URL (optional)</Label>
            <Input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder={`/r/${activeRestaurant.slug}`}
            />
          </div>
          <div>
            <Label>Image URL (optional)</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={sendMode === "now"}
                onChange={() => setSendMode("now")}
              />
              Send now
            </label>
            {canSchedule ? (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={sendMode === "schedule"}
                  onChange={() => setSendMode("schedule")}
                />
                Schedule
              </label>
            ) : (
              <span className="text-xs text-muted">Scheduling available on PRO+</span>
            )}
          </div>
          {sendMode === "schedule" && canSchedule ? (
            <div>
              <Label>Schedule date & time</Label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
          ) : null}
          <Button onClick={createCampaign} disabled={saving || !title || !message}>
            {saving ? "Sending…" : sendMode === "now" ? "Send now" : "Schedule"}
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Recent campaigns" />
        {campaigns.length === 0 ? (
          <p className="text-sm text-muted">No campaigns yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {campaigns.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-muted">{c.message}</p>
                </div>
                <Badge>{c.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
