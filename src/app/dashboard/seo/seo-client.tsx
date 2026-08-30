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

type SeoTranslation = {
  languageCode: string;
  title?: string | null;
  description?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
};

export default function SeoClient() {
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const { push } = useToast();
  const [canEdit, setCanEdit] = useState(false);
  const [plan, setPlan] = useState("FREE");
  const [indexable, setIndexable] = useState(true);
  const [languages, setLanguages] = useState<string[]>(["en"]);
  const [activeLang, setActiveLang] = useState("en");
  const [translations, setTranslations] = useState<SeoTranslation[]>([]);
  const [analyticsId, setAnalyticsId] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!activeRestaurant) return;
    try {
      const rest = await api.getRestaurant(activeRestaurant.id);
      const langs =
        ((rest.restaurant as { supportedLanguages?: string[] }).supportedLanguages) ??
        ["en"];
      setLanguages(langs);
      setActiveLang(langs[0] ?? "en");
      setPlan((rest.subscription as { plan?: string })?.plan ?? "FREE");

      const seo = await api.getSeoSettings(activeRestaurant.id);
      setCanEdit(Boolean((seo as { canEdit?: boolean }).canEdit));
      const settings = (seo as { settings?: { indexable?: boolean; analyticsMeasurementId?: string | null } }).settings;
      setIndexable(settings?.indexable !== false);
      setAnalyticsId(settings?.analyticsMeasurementId ?? "");
      setTranslations(((seo as { translations?: SeoTranslation[] }).translations) ?? []);
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load SEO", "error");
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load on restaurant change
    void load();
  }, [activeRestaurant?.id, load]);

  function currentTranslation() {
    return (
      translations.find((t) => t.languageCode === activeLang) ?? {
        languageCode: activeLang,
      }
    );
  }

  function updateTranslation(patch: Partial<SeoTranslation>) {
    const existing = currentTranslation();
    const next = translations.filter((t) => t.languageCode !== activeLang);
    next.push({ ...existing, ...patch, languageCode: activeLang });
    setTranslations(next);
  }

  async function save() {
    if (!activeRestaurant) return;
    setSaving(true);
    try {
      await api.updateSeoSettings(activeRestaurant.id, {
        indexable,
        analyticsMeasurementId: analyticsId || null,
        translations,
      });
      push("SEO settings saved", "success");
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

  if (!canEdit) {
    return (
      <div className="space-y-4">
        <h1 className="display-font text-3xl font-semibold tracking-tight">SEO</h1>
        <Card>
          <CardHeader title="Automatic SEO is active" />
          <p className="text-sm text-muted">
            Your public menu at <code>/r/{activeRestaurant.slug}</code> already includes
            title, description, canonical URL, Open Graph tags, and sitemap inclusion.
          </p>
          <p className="mt-3 text-sm text-muted">
            Upgrade to PRO to edit SEO title, multilingual metadata, hreflang, and structured data.
          </p>
          <Link href="/dashboard/subscription">
            <Button className="mt-4">Upgrade to PRO</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const tr = currentTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display-font text-3xl font-semibold tracking-tight">SEO Settings</h1>
        <p className="mt-2 text-muted">
          Customize how search engines and social platforms see your restaurant.
        </p>
        <Badge className="mt-2">{plan}</Badge>
      </div>

      <Card>
        <CardHeader title="Language" />
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                activeLang === lang ? "bg-brand text-white" : "bg-bg text-muted"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Search metadata" />
        <div className="space-y-4">
          <div>
            <Label>SEO title ({activeLang})</Label>
            <Input
              value={tr.title ?? ""}
              onChange={(e) => updateTranslation({ title: e.target.value })}
              maxLength={120}
              placeholder={`${activeRestaurant.name} Menu | MENURIO`}
            />
            <p className="mt-1 text-xs text-muted">Recommended: under 60 characters</p>
          </div>
          <div>
            <Label>Meta description ({activeLang})</Label>
            <Input
              value={tr.description ?? ""}
              onChange={(e) => updateTranslation({ description: e.target.value })}
              maxLength={300}
            />
            <p className="mt-1 text-xs text-muted">Recommended: 120–160 characters</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Social / Open Graph" />
        <div className="space-y-4">
          <div>
            <Label>OG title</Label>
            <Input
              value={tr.ogTitle ?? ""}
              onChange={(e) => updateTranslation({ ogTitle: e.target.value })}
              maxLength={120}
            />
          </div>
          <div>
            <Label>OG description</Label>
            <Input
              value={tr.ogDescription ?? ""}
              onChange={(e) => updateTranslation({ ogDescription: e.target.value })}
              maxLength={300}
            />
          </div>
          <div>
            <Label>OG image URL</Label>
            <Input
              value={tr.ogImage ?? ""}
              onChange={(e) => updateTranslation({ ogImage: e.target.value })}
              placeholder="https://…"
            />
          </div>
        </div>
      </Card>

      {plan === "PRO_PLUS" ? (
        <Card>
          <CardHeader title="Advanced (PRO+)" />
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={indexable}
                onChange={(e) => setIndexable(e.target.checked)}
              />
              Allow search indexing
            </label>
            <div>
              <Label>Google Analytics Measurement ID</Label>
              <Input
                value={analyticsId}
                onChange={(e) => setAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        </Card>
      ) : null}

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save SEO settings"}
      </Button>
    </div>
  );
}
