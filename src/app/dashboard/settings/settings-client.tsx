"use client";

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
import { canUsePush, canUsePwa } from "@/lib/entitlements";

type Settings = {
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  deliveryEnabled?: boolean;
  pickupEnabled?: boolean;
  tableOrderingEnabled?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  pwaEnabled?: boolean;
  pwaDisplayName?: string | null;
  pwaIconUrl?: string | null;
  pushNotificationsEnabled?: boolean;
};

export default function SettingsClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [settings, setSettings] = useState<Settings>({});
  const [entitlements, setEntitlements] = useState<PlanEntitlements | null>(null);
  const [plan, setPlan] = useState<string>("FREE");
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const [settingsData, rest] = await Promise.all([
        api.getSettings(activeRestaurant.id),
        api.getRestaurant(activeRestaurant.id),
      ]);
      setSettings((settingsData.settings as Settings) ?? {});
      setEntitlements(rest.entitlements as PlanEntitlements);
      setPlan((rest.subscription as { plan?: string })?.plan ?? "FREE");
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load settings", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch settings on restaurant change
    void load();
  }, [activeRestaurant?.id]);

  async function save() {
    if (!activeRestaurant) return;
    setSaving(true);
    try {
      await api.updateSettings(activeRestaurant.id, settings);
      push("Settings saved", "success");
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  if (ctxLoading) return <p className="text-muted">Loading…</p>;
  if (!activeRestaurant) {
    return <EmptyState title="No restaurant" description="Create a restaurant first." />;
  }

  const canPwa = entitlements ? canUsePwa(plan as "FREE") : false;
  const canPush = entitlements ? canUsePush(plan as "FREE") : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted">Restaurant ordering, contact, and SEO preferences.</p>
      </div>
      <Card>
        <CardHeader title="Contact & location" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Address</Label>
            <Input
              value={settings.address ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={settings.phone ?? ""}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
          </div>
        </div>
      </Card>
      <Card>
        <CardHeader title="Ordering modes" />
        <div className="space-y-3">
          {[
            ["deliveryEnabled", "Delivery"],
            ["pickupEnabled", "Pickup"],
            ["tableOrderingEnabled", "Table ordering"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={Boolean(settings[key as keyof Settings])}
                onChange={(e) =>
                  setSettings({ ...settings, [key]: e.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="SEO" />
        <div className="space-y-4">
          <div>
            <Label>SEO title</Label>
            <Input
              value={settings.seoTitle ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, seoTitle: e.target.value })
              }
            />
          </div>
          <div>
            <Label>SEO description</Label>
            <Input
              value={settings.seoDescription ?? ""}
              onChange={(e) =>
                setSettings({ ...settings, seoDescription: e.target.value })
              }
            />
          </div>
        </div>
      </Card>
      <Card>
        <CardHeader
          title="PWA & notifications"
          action={
            !canPwa ? (
              <Badge variant="outline" className="normal-case tracking-normal">
                PWA · PRO
              </Badge>
            ) : undefined
          }
        />
        {canPwa ? (
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={settings.pwaEnabled !== false}
                onChange={(e) =>
                  setSettings({ ...settings, pwaEnabled: e.target.checked })
                }
              />
              PWA enabled
            </label>
            <div>
              <Label>PWA display name</Label>
              <Input
                value={settings.pwaDisplayName ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, pwaDisplayName: e.target.value })
                }
                placeholder={activeRestaurant.name}
              />
            </div>
            <div>
              <Label>PWA icon URL</Label>
              <Input
                value={settings.pwaIconUrl ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, pwaIconUrl: e.target.value })
                }
                placeholder="https://…"
              />
            </div>
            {canPush ? (
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={settings.pushNotificationsEnabled !== false}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pushNotificationsEnabled: e.target.checked,
                    })
                  }
                />
                Push notifications enabled
              </label>
            ) : (
              <p className="text-sm text-muted">Push notifications require PRO.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Installable app branding is available on PRO and PRO+.
          </p>
        )}
      </Card>
      <Card>
        <CardHeader
          title="Security"
          action={
            <Badge variant="outline" className="normal-case tracking-normal">
              MFA · PRO+ foundation only
            </Badge>
          }
        />
        <p className="text-sm text-muted">
          Multi-factor authentication architecture is prepared but not enabled until a
          real provider is integrated.
        </p>
      </Card>
      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </div>
  );
}
