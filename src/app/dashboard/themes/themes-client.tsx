"use client";

import { useCallback, useEffect, useState } from "react";
import { restaurantThemes } from "@/lib/themes/restaurant-themes";
import type { PlanEntitlements } from "@/lib/entitlements";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";
import type { DesignPatch } from "@/lib/design/assert-patch";
import { EmptyState } from "@/components/ui/states";

type DesignDraft = {
  themeId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  buttonStyle: string;
  cardStyle: string;
  navigationStyle: string;
  menuLayout: string;
  imageStyle: string;
  footerStyle: string;
  customCss: string;
  customCssEnabled: boolean;
  whiteLabelEnabled: boolean;
  logoUrl: string | null;
  coverUrl: string | null;
  faviconUrl: string | null;
};

const emptyDraft: DesignDraft = {
  themeId: "modern",
  primaryColor: "#D95532",
  secondaryColor: "#8D3D32",
  accentColor: "#66715C",
  headingFont: "display",
  bodyFont: "sans",
  buttonStyle: "pill",
  cardStyle: "elevated",
  navigationStyle: "sticky",
  menuLayout: "cards",
  imageStyle: "cover",
  footerStyle: "simple",
  customCss: "",
  customCssEnabled: false,
  whiteLabelEnabled: false,
  logoUrl: null,
  coverUrl: null,
  faviconUrl: null,
};

export default function ThemesClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [draft, setDraft] = useState<DesignDraft>(emptyDraft);
  const [entitlements, setEntitlements] = useState<PlanEntitlements | null>(null);
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const data = await api.getDesign(activeRestaurant.id);
      const resolved = data.resolved as {
        themeId?: string;
        colors?: { primary?: string; secondary?: string; accent?: string };
        fonts?: { heading?: string; body?: string };
        buttonStyle?: string;
        cardStyle?: string;
        navigationStyle?: string;
        menuLayout?: string;
        imageStyle?: string;
        footerStyle?: string;
        customCss?: string | null;
        whiteLabelEnabled?: boolean;
        logoUrl?: string | null;
        coverUrl?: string | null;
        faviconUrl?: string | null;
      };
      const row = data.design as { customCss?: string | null; customCssEnabled?: boolean };
      setEntitlements(data.entitlements as unknown as PlanEntitlements);
      setDraft({
        themeId: resolved.themeId ?? "modern",
        primaryColor: resolved.colors?.primary ?? "#D95532",
        secondaryColor: resolved.colors?.secondary ?? "#8D3D32",
        accentColor: resolved.colors?.accent ?? "#66715C",
        headingFont: resolved.fonts?.heading ?? "display",
        bodyFont: resolved.fonts?.body ?? "sans",
        buttonStyle: resolved.buttonStyle ?? "pill",
        cardStyle: resolved.cardStyle ?? "elevated",
        navigationStyle: resolved.navigationStyle ?? "sticky",
        menuLayout: resolved.menuLayout ?? "cards",
        imageStyle: resolved.imageStyle ?? "cover",
        footerStyle: resolved.footerStyle ?? "simple",
        customCss: row.customCss ?? "",
        customCssEnabled: Boolean(row.customCssEnabled),
        whiteLabelEnabled: Boolean(resolved.whiteLabelEnabled),
        logoUrl: resolved.logoUrl ?? null,
        coverUrl: resolved.coverUrl ?? null,
        faviconUrl: resolved.faviconUrl ?? null,
      });
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load design", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load persisted tenant design
    void load();
  }, [activeRestaurant?.id]);

  async function save() {
    if (!activeRestaurant || !entitlements) return;
    setSaving(true);
    try {
      const patch: DesignPatch = {
        themeId: draft.themeId,
      };

      if (entitlements.BRAND_COLORS) {
        patch.primaryColor = draft.primaryColor;
        patch.secondaryColor = draft.secondaryColor;
        patch.accentColor = draft.accentColor;
      }
      if (entitlements.PRO_THEMES) {
        patch.headingFont = draft.headingFont;
        patch.bodyFont = draft.bodyFont;
        patch.buttonStyle = draft.buttonStyle;
        patch.cardStyle = draft.cardStyle;
      }
      if (entitlements.ADVANCED_DESIGN) {
        patch.navigationStyle = draft.navigationStyle;
        patch.menuLayout = draft.menuLayout;
        patch.imageStyle = draft.imageStyle;
        patch.footerStyle = draft.footerStyle;
      }
      if (entitlements.CUSTOM_CSS) {
        patch.customCss = draft.customCss || null;
        patch.customCssEnabled = draft.customCssEnabled;
      }
      if (entitlements.WHITE_LABEL) {
        patch.whiteLabelEnabled = draft.whiteLabelEnabled;
      }

      await api.updateDesign(activeRestaurant.id, patch);
      push("Design saved", "success");
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to save design", "error");
    } finally {
      setSaving(false);
    }
  }

  async function upload(purpose: "logo" | "cover" | "favicon", file: File) {
    if (!activeRestaurant) return;
    try {
      const { publicUrl, assetId } = await api.uploadFile(
        activeRestaurant.id,
        file,
        purpose,
      );
      if (!assetId) throw new Error("Upload did not return an asset");
      await api.updateDesign(activeRestaurant.id, {
        ...(purpose === "logo" ? { logoAssetId: assetId } : {}),
        ...(purpose === "cover" ? { coverAssetId: assetId } : {}),
        ...(purpose === "favicon" ? { faviconAssetId: assetId } : {}),
      });
      setDraft((d) => ({
        ...d,
        ...(purpose === "logo" ? { logoUrl: publicUrl } : {}),
        ...(purpose === "cover" ? { coverUrl: publicUrl } : {}),
        ...(purpose === "favicon" ? { faviconUrl: publicUrl } : {}),
      }));
      push("Image uploaded", "success");
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Upload failed", "error");
    }
  }

  if (ctxLoading) return <p className="text-muted">Loading…</p>;
  if (!activeRestaurant) {
    return <EmptyState title="No restaurant" description="Create one first." />;
  }

  const can = entitlements ?? ({} as PlanEntitlements);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div>
          <h1 className="display-font text-3xl font-semibold tracking-tight">
            Brand & design
          </h1>
          <p className="mt-2 text-muted">
            These settings belong only to {activeRestaurant.name} and persist per tenant.
          </p>
        </div>

        <Card>
          <h2 className="text-lg font-semibold">Theme</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {restaurantThemes.map((theme) => {
              const locked =
                (theme.tier === "professional" && !can.PRO_THEMES) ||
                (theme.tier === "advanced" && !can.ADVANCED_DESIGN);
              return (
                <button
                  key={theme.id}
                  type="button"
                  disabled={locked}
                  onClick={() => setDraft({ ...draft, themeId: theme.id })}
                  className={`rounded-2xl border p-4 text-left ${
                    draft.themeId === theme.id ? "ring-2 ring-brand" : "border-line"
                  } ${locked ? "opacity-50" : ""}`}
                >
                  <div className={`h-20 rounded-xl bg-gradient-to-br ${theme.preview}`} />
                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-semibold">{theme.name}</p>
                    {locked ? <Badge variant="outline">{theme.tier}</Badge> : null}
                    {draft.themeId === theme.id ? <Badge variant="brand">Active</Badge> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Assets</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {(
              [
                ["logo", "Logo", can.CUSTOM_LOGO],
                ["cover", "Cover", can.CUSTOM_COVER],
                ["favicon", "Favicon", can.CUSTOM_FAVICON],
              ] as const
            ).map(([purpose, label, allowed]) => (
              <div key={purpose}>
                <Label>{label}</Label>
                <input
                  type="file"
                  accept={purpose === "favicon" ? "image/png,image/webp,image/x-icon" : "image/*"}
                  disabled={!allowed}
                  className="mt-2 block w-full text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(purpose, file);
                  }}
                />
                {!allowed ? (
                  <p className="mt-1 text-xs text-muted">Upgrade required</p>
                ) : null}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Colors & type</h2>
          <fieldset disabled={!can.BRAND_COLORS} className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              ["primaryColor", "Primary"],
              ["secondaryColor", "Secondary"],
              ["accentColor", "Accent"],
            ].map(([key, label]) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input
                  type="color"
                  value={draft[key as keyof DesignDraft] as string}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  className="mt-2 h-12 p-1"
                />
              </div>
            ))}
          </fieldset>
          <fieldset disabled={!can.PRO_THEMES} className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Heading font</Label>
              <select
                className="mt-2 h-11 w-full rounded-xl border border-line bg-surface px-3"
                value={draft.headingFont}
                onChange={(e) => setDraft({ ...draft, headingFont: e.target.value })}
              >
                <option value="display">Display</option>
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
              </select>
            </div>
            <div>
              <Label>Body font</Label>
              <select
                className="mt-2 h-11 w-full rounded-xl border border-line bg-surface px-3"
                value={draft.bodyFont}
                onChange={(e) => setDraft({ ...draft, bodyFont: e.target.value })}
              >
                <option value="display">Display</option>
                <option value="sans">Sans</option>
                <option value="serif">Serif</option>
              </select>
            </div>
          </fieldset>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Styles</h2>
          <fieldset disabled={!can.PRO_THEMES} className="mt-4 grid gap-4 sm:grid-cols-2">
            <StyleSelect
              label="Buttons"
              value={draft.buttonStyle}
              options={["pill", "rounded", "square"]}
              onChange={(value) => setDraft({ ...draft, buttonStyle: value })}
            />
            <StyleSelect
              label="Cards"
              value={draft.cardStyle}
              options={["elevated", "flat", "outlined", "compact"]}
              onChange={(value) => setDraft({ ...draft, cardStyle: value })}
            />
          </fieldset>
          <fieldset disabled={!can.ADVANCED_DESIGN} className="mt-4 grid gap-4 sm:grid-cols-2">
            <StyleSelect
              label="Navigation"
              value={draft.navigationStyle}
              options={["sticky", "solid", "transparent", "minimal"]}
              onChange={(value) => setDraft({ ...draft, navigationStyle: value })}
            />
            <StyleSelect
              label="Menu layout"
              value={draft.menuLayout}
              options={["cards", "list", "grid", "editorial"]}
              onChange={(value) => setDraft({ ...draft, menuLayout: value })}
            />
            <StyleSelect
              label="Images"
              value={draft.imageStyle}
              options={["cover", "rounded", "contain", "square"]}
              onChange={(value) => setDraft({ ...draft, imageStyle: value })}
            />
            <StyleSelect
              label="Footer"
              value={draft.footerStyle}
              options={["simple", "branded", "minimal"]}
              onChange={(value) => setDraft({ ...draft, footerStyle: value })}
            />
          </fieldset>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">White-label & CSS</h2>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              disabled={!can.WHITE_LABEL}
              checked={draft.whiteLabelEnabled}
              onChange={(e) => setDraft({ ...draft, whiteLabelEnabled: e.target.checked })}
            />
            Remove Menurio branding from the public site
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              disabled={!can.CUSTOM_CSS}
              checked={draft.customCssEnabled}
              onChange={(e) => setDraft({ ...draft, customCssEnabled: e.target.checked })}
            />
            Enable custom CSS
          </label>
          <textarea
            disabled={!can.CUSTOM_CSS || !draft.customCssEnabled}
            value={draft.customCss}
            onChange={(e) => setDraft({ ...draft, customCss: e.target.value })}
            className="mt-3 min-h-32 w-full rounded-xl border border-line p-3 text-sm"
            placeholder=".menu-card { border-radius: 8px; }"
          />
        </Card>

        <Button onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save design"}
        </Button>
      </div>

      <Card className="xl:sticky xl:top-24">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">
          Live preview
        </p>
        <div
          className="mt-4 overflow-hidden rounded-[24px] border border-line"
          style={{
            background: "#FBF8F2",
            color: "#1D1B18",
          }}
        >
          <div className="relative aspect-[16/10] bg-cream">
            {draft.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.coverUrl} alt="" className="absolute inset-0 size-full object-cover" />
            ) : null}
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              {draft.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.logoUrl} alt="" className="size-10 rounded-full object-cover" />
              ) : (
                <span
                  className="grid size-10 place-items-center rounded-full text-sm font-bold text-white"
                  style={{ background: draft.primaryColor }}
                >
                  {activeRestaurant.name.slice(0, 1)}
                </span>
              )}
              <div>
                <p className="font-bold">{activeRestaurant.name}</p>
                <p className="text-xs text-muted">{draft.themeId} · {draft.menuLayout}</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full py-2 text-sm font-semibold text-white"
              style={{ background: draft.primaryColor, borderRadius: draft.buttonStyle === "square" ? 6 : 999 }}
            >
              View menu
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StyleSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        className="mt-2 h-11 w-full rounded-xl border border-line bg-surface px-3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
