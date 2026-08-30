"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { restaurantThemes } from "@/lib/themes/restaurant-themes";
import { Card, CardHeader } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";
import { EmptyState } from "@/components/ui/states";

type RestaurantRecord = {
  name: string;
  description: string | null;
  isPublished: boolean;
  logoUrl: string | null;
  coverImageUrl: string | null;
  defaultLanguage: string;
  supportedLanguages: string[];
};

type SettingsRecord = {
  tagline?: string | null;
  address?: string | null;
  phone?: string | null;
  socialLinks?: { instagram?: string; facebook?: string };
  deliveryEnabled?: boolean;
  pickupEnabled?: boolean;
  tableOrderingEnabled?: boolean;
  themeSlug?: string;
  brandPrimaryColor?: string | null;
};

export default function RestaurantEditorClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null);
  const [settings, setSettings] = useState<SettingsRecord>({});
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const [rData, sData] = await Promise.all([
        api.getRestaurant(activeRestaurant.id),
        api.getSettings(activeRestaurant.id),
      ]);
      setRestaurant(rData.restaurant as RestaurantRecord);
      setSettings((sData.settings as SettingsRecord) ?? {});
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load profile on restaurant change
    void load();
  }, [activeRestaurant?.id]);

  async function save() {
    if (!activeRestaurant || !restaurant) return;
    setSaving(true);
    try {
      await api.updateRestaurant(activeRestaurant.id, {
        name: restaurant.name,
        description: restaurant.description,
        isPublished: restaurant.isPublished,
      });
      await api.updateSettings(activeRestaurant.id, {
        tagline: settings.tagline,
        address: settings.address,
        phone: settings.phone,
        socialLinks: settings.socialLinks,
        deliveryEnabled: settings.deliveryEnabled,
        pickupEnabled: settings.pickupEnabled,
        tableOrderingEnabled: settings.tableOrderingEnabled,
        themeSlug: settings.themeSlug,
        brandPrimaryColor: settings.brandPrimaryColor,
      });
      push("Restaurant profile saved", "success");
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(
    file: File,
    purpose: "logo" | "cover",
  ) {
    if (!activeRestaurant) return;
    try {
      const { publicUrl, assetId } = await api.uploadFile(
        activeRestaurant.id,
        file,
        purpose,
      );
      if (purpose === "logo") {
        await api.updateRestaurant(activeRestaurant.id, { logoUrl: publicUrl });
        if (assetId) {
          await api.updateDesign(activeRestaurant.id, { logoAssetId: assetId });
        }
        setRestaurant((r) => r && { ...r, logoUrl: publicUrl });
      } else {
        await api.updateRestaurant(activeRestaurant.id, {
          coverImageUrl: publicUrl,
        });
        if (assetId) {
          await api.updateDesign(activeRestaurant.id, { coverAssetId: assetId });
        }
        setRestaurant((r) => r && { ...r, coverImageUrl: publicUrl });
      }
      push("Image uploaded", "success");
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Upload failed", "error");
    }
  }

  if (ctxLoading || !restaurant) {
    return <p className="text-muted">Loading restaurant profile…</p>;
  }
  if (!activeRestaurant) {
    return <EmptyState title="No restaurant" description="Create one first." />;
  }

  const theme =
    restaurantThemes.find((t) => t.id === settings.themeSlug) ??
    restaurantThemes[0]!;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div>
          <h1 className="display-font text-3xl font-semibold tracking-tight">
            Restaurant website
          </h1>
          <p className="mt-2 text-muted">Edit your public profile and branding.</p>
        </div>

        <Card>
          <CardHeader title="Basic information" />
          <div className="space-y-4">
            <div>
              <Label>Restaurant name</Label>
              <Input
                value={restaurant.name}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                value={settings.tagline ?? ""}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={restaurant.description ?? ""}
                onChange={(e) =>
                  setRestaurant({ ...restaurant, description: e.target.value })
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={restaurant.isPublished}
                onChange={(e) =>
                  setRestaurant({
                    ...restaurant,
                    isPublished: e.target.checked,
                  })
                }
              />
              Published (visible at /r/{activeRestaurant.slug})
            </label>
          </div>
        </Card>

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
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={settings.socialLinks?.instagram ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      instagram: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label>Facebook</Label>
              <Input
                value={settings.socialLinks?.facebook ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      facebook: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Images" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Logo</Label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadImage(f, "logo");
                }}
              />
            </div>
            <div>
              <Label>Cover</Label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadImage(f, "cover");
                }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Brand colors & theme" />
          <div className="mb-4">
            <Label>Brand color</Label>
            <Input
              type="color"
              value={settings.brandPrimaryColor ?? "#D95532"}
              onChange={(e) =>
                setSettings({ ...settings, brandPrimaryColor: e.target.value })
              }
              className="mt-2 h-12 p-1"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {restaurantThemes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSettings({ ...settings, themeSlug: t.id })}
                className={`rounded-2xl border p-4 text-left transition ${
                  settings.themeSlug === t.id
                    ? "border-brand ring-2 ring-brand/20"
                    : "border-line"
                }`}
              >
                <div className={`mb-3 h-16 rounded-xl bg-gradient-to-r ${t.preview}`} />
                <p className="font-semibold">{t.name}</p>
              </button>
            ))}
          </div>
        </Card>

        <Button onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <div className="xl:sticky xl:top-24 xl:self-start">
        <Card padding="none" className="overflow-hidden">
          <div className="p-5">
            <CardHeader title="Live preview" />
          </div>
          <div style={{ background: theme.colors.background, color: theme.colors.text }}>
            <div className="relative aspect-[16/10] bg-cream">
              {restaurant.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={restaurant.coverImageUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <Image src="/images/hero-preview.svg" alt="" fill className="object-cover" />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                {restaurant.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={restaurant.logoUrl}
                    alt=""
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-12 place-items-center rounded-full bg-brand/10 text-lg font-bold text-brand">
                    {restaurant.name.slice(0, 1)}
                  </span>
                )}
                <div>
                  <p className="font-bold">{restaurant.name}</p>
                  <p className="text-sm opacity-70">{settings.tagline}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
