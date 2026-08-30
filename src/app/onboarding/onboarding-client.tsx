"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Palette,
  UtensilsCrossed,
  Languages,
  QrCode,
  Rocket,
  Camera,
  FileText,
  Table,
  PenLine,
  UserCircle,
  Phone,
  ShieldCheck,
  Check,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/shell";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/format";
import { api, ApiError } from "@/lib/api/client";
import { QrCodeDisplay } from "@/components/qr/qr-code-display";
import { buildQrPermanentPath } from "@/lib/utils/public-urls";
import { useToast } from "@/components/ui/toast";

const steps = [
  { id: 1, title: "Account", icon: UserCircle },
  { id: 2, title: "Restaurant", icon: Store },
  { id: 3, title: "Contact", icon: Phone },
  { id: 4, title: "Branding", icon: Palette },
  { id: 5, title: "Menu", icon: UtensilsCrossed },
  { id: 6, title: "Languages", icon: Languages },
  { id: 7, title: "Confirm", icon: ShieldCheck },
];

const languageOptions = [
  { code: "en", prefix: "GB", label: "English" },
  { code: "hy", prefix: "AM", label: "Armenian" },
  { code: "ru", prefix: "RU", label: "Russian" },
  { code: "fr", prefix: "FR", label: "French" },
];

const restaurantTypes = [
  "Restaurant",
  "Cafe",
  "Bar",
  "Hotel restaurant",
  "Fast food",
];

export function OnboardingClient({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [step, setStep] = useState(1);
  const [menuMethod, setMenuMethod] = useState("manual");
  const [ownerName, setOwnerName] = useState(userName);
  const [ownerPhone, setOwnerPhone] = useState("");
  const [name, setName] = useState("");
  const [restaurantType, setRestaurantType] = useState("Restaurant");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState(userEmail);
  const [instagram, setInstagram] = useState("");
  const [brandColor, setBrandColor] = useState("#D95532");
  const [languages, setLanguages] = useState<string[]>(["en", "hy", "ru"]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    slug: string;
    qrPermanentId: string;
  } | null>(null);
  const { push } = useToast();
  const router = useRouter();

  const platformUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_PLATFORM_URL ??
    "";

  const fullAddress = [address.trim(), city.trim()].filter(Boolean).join(", ");

  const createRestaurant = useCallback(async () => {
    if (!name.trim()) {
      push("Restaurant name is required", "error");
      return;
    }
    if (!termsAccepted) {
      push("Please accept the terms to continue", "error");
      return;
    }
    setSubmitting(true);
    setStep(8);
    try {
      const data = await api.createRestaurant({
        name: name.trim(),
        description: description.trim() || undefined,
        defaultLanguage: languages[0] ?? "en",
        supportedLanguages: languages,
        address: fullAddress || undefined,
        phone: adminPhone.trim() || ownerPhone.trim() || undefined,
        email: adminEmail.trim() || undefined,
        instagram: instagram.trim() || undefined,
        brandPrimaryColor: brandColor,
      });
      setResult({
        slug: data.restaurant.slug,
        qrPermanentId: data.qrPermanentId,
      });
      push("Restaurant created!", "success");
    } catch (e) {
      setStep(7);
      push(
        e instanceof ApiError ? e.message : "Failed to create restaurant",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    name,
    description,
    languages,
    fullAddress,
    adminPhone,
    ownerPhone,
    adminEmail,
    instagram,
    brandColor,
    termsAccepted,
    push,
  ]);

  function canContinue(): boolean {
    switch (step) {
      case 1:
        return ownerName.trim().length > 0 && ownerPhone.trim().length > 0;
      case 2:
        return name.trim().length > 0 && city.trim().length > 0;
      case 3:
        return adminPhone.trim().length > 0 && adminEmail.trim().length > 0;
      case 7:
        return termsAccepted;
      default:
        return true;
    }
  }

  async function handleContinue() {
    if (step === 7) {
      await createRestaurant();
      return;
    }
    setStep((s) => Math.min(7, s + 1));
  }

  function toggleLanguage(code: string) {
    setLanguages((prev) => {
      if (prev.includes(code)) {
        return prev.length > 1 ? prev.filter((l) => l !== code) : prev;
      }
      return [code, ...prev.filter((l) => l !== code)];
    });
  }

  const showFooter = step < 8 && !(step === 8);

  return (
    <MarketingShell>
      <div className="site-container py-10 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <Badge variant="brand" className="mb-4 normal-case tracking-normal">
            12 months free
          </Badge>
          <h1 className="display-font text-4xl font-semibold tracking-tight text-ink">
            Create your restaurant
          </h1>
          <p className="mt-3 text-muted">
            Register your account, add contact details, and publish your menu.
          </p>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {steps.map((s) => {
              const Icon = s.icon;
              const active = s.id === step;
              const done = s.id < step;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => s.id <= step && setStep(s.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "bg-brand text-white"
                      : done
                        ? "bg-brand/10 text-brand-deep"
                        : "bg-cream text-muted",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.id}</span>
                </button>
              );
            })}
          </div>

          <Card className="mt-8">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your account</h2>
                <p className="text-sm text-muted">
                  Personal details for the restaurant owner. You are signed in
                  with Google.
                </p>
                <div>
                  <Label>Full name</Label>
                  <Input
                    placeholder="Your name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Personal phone</Label>
                  <Input
                    type="tel"
                    placeholder="+374 91 000000"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email (from Google)</Label>
                  <Input value={userEmail} readOnly className="bg-cream/60" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Restaurant information</h2>
                <div>
                  <Label>Restaurant name</Label>
                  <Input
                    placeholder="e.g. Lavash, Avena, Cascade"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Restaurant type</Label>
                  <select
                    value={restaurantType}
                    onChange={(e) => setRestaurantType(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm"
                  >
                    {restaurantTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>City</Label>
                    <Input
                      placeholder="Yerevan"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Street address</Label>
                    <Input
                      placeholder="12 Abovyan Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Short description</Label>
                  <Textarea
                    placeholder="What makes your restaurant special?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Admin contact</h2>
                <p className="text-sm text-muted">
                  How guests and your team reach the restaurant admin.
                </p>
                <div>
                  <Label>Admin phone</Label>
                  <Input
                    type="tel"
                    placeholder="+374 10 58 18 18"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Admin email</Label>
                  <Input
                    type="email"
                    placeholder="hello@restaurant.am"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Instagram (optional)</Label>
                  <Input
                    placeholder="@restaurant"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Logo & branding</h2>
                <p className="text-sm text-muted">
                  Upload logo and cover in the dashboard after setup.
                </p>
                <div>
                  <Label>Brand color</Label>
                  <Input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="h-12 p-1"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Create or import menu</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { id: "manual", icon: PenLine, label: "Manual entry" },
                    {
                      id: "photo",
                      icon: Camera,
                      label: "Photo",
                      badge: "PRO — AI pending",
                    },
                    {
                      id: "pdf",
                      icon: FileText,
                      label: "PDF",
                      badge: "PRO — AI pending",
                    },
                    { id: "excel", icon: Table, label: "Excel import" },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMenuMethod(m.id)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition",
                          menuMethod === m.id
                            ? "border-brand bg-brand/5"
                            : "border-line hover:border-brand/30",
                        )}
                      >
                        <Icon className="size-5 text-brand" />
                        <p className="mt-2 font-semibold">{m.label}</p>
                        {m.badge ? (
                          <Badge
                            variant="outline"
                            className="mt-2 normal-case tracking-normal"
                          >
                            {m.badge}
                          </Badge>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-muted">
                  {menuMethod === "manual"
                    ? "A default menu is created. Add dishes in the menu editor."
                    : menuMethod === "excel"
                      ? "Excel import is available from the dashboard menu editor."
                      : "Photo/PDF import requires PRO and a future AI provider."}
                </p>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Languages</h2>
                <p className="text-sm text-muted">
                  FREE includes 1 language. Upgrade for more.
                </p>
                <div className="flex flex-wrap gap-2 border-b border-line pb-4">
                  {languageOptions.map(({ code, prefix, label }) => {
                    const selected = languages.includes(code);
                    const isPrimary = languages[0] === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleLanguage(code)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-semibold transition",
                          selected
                            ? isPrimary
                              ? "bg-brand text-white"
                              : "border border-brand bg-brand/5 text-brand-deep"
                            : "border border-line bg-white text-muted",
                        )}
                      >
                        <span className="font-black">{prefix}</span> {label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted">
                  First selected language is the default. Tap again to remove
                  (minimum 1).
                </p>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold">Confirm & publish</h2>
                <div className="rounded-2xl border border-line bg-cream/40 p-4 text-sm">
                  <p className="font-semibold text-ink">{name || "—"}</p>
                  <p className="mt-1 text-muted">{fullAddress || "—"}</p>
                  <p className="mt-2 text-muted">
                    Admin: {adminPhone || "—"} · {adminEmail || "—"}
                  </p>
                  <p className="mt-2 text-muted">
                    Owner: {ownerName} · {ownerPhone}
                  </p>
                  <p className="mt-2 text-muted">
                    Languages:{" "}
                    {languages
                      .map(
                        (code) =>
                          languageOptions.find((l) => l.code === code)?.label ??
                          code,
                      )
                      .join(", ")}
                  </p>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm leading-6 text-muted">
                    I confirm that the information above is correct and I agree
                    to the{" "}
                    <Link href="/terms" className="font-semibold text-brand">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-semibold text-brand">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>
            )}

            {step === 8 && submitting && (
              <div className="space-y-4 text-center">
                <h2 className="text-xl font-semibold">
                  Creating your restaurant…
                </h2>
                <div className="mx-auto grid size-48 place-items-center rounded-[24px] border border-line bg-white">
                  <QrCode className="size-32 animate-pulse text-ink" />
                </div>
                <p className="text-sm text-muted">Setting up database records…</p>
              </div>
            )}

            {step === 8 && result && !submitting && (
              <div className="space-y-6 text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success">
                  <Check className="size-8" />
                </div>
                <h2 className="text-xl font-semibold">Ready to publish!</h2>
                <p className="text-sm text-muted">
                  Your restaurant is live at{" "}
                  <strong className="text-ink">
                    {platformUrl || ""}/r/{result.slug}
                  </strong>
                </p>
                <div className="mx-auto max-w-xs">
                  <QrCodeDisplay
                    value={`${platformUrl}${buildQrPermanentPath(result.qrPermanentId)}`}
                    size={200}
                    brandColor={brandColor}
                    caption="Սканավորեք · Scan menu"
                  />
                </div>
                <p className="text-xs text-muted">
                  Permanent link:{" "}
                  <span className="font-mono">
                    {platformUrl}
                    {buildQrPermanentPath(result.qrPermanentId)}
                  </span>
                </p>
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/dashboard/qr")}
                >
                  <QrCode className="size-4" />
                  Manage QR codes
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/dashboard")}
                >
                  <Rocket className="size-4" />
                  Go to dashboard
                </Button>
                <Link
                  href={`/r/${result.slug}`}
                  className={buttonStyles({
                    variant: "ghost",
                    size: "lg",
                    className: "ml-0 inline-flex w-full sm:w-auto",
                  })}
                >
                  View your site
                </Link>
              </div>
            )}

            {showFooter && step <= 7 && (
              <div className="mt-8 flex justify-between gap-3 border-t border-line pt-6">
                <Button
                  variant="ghost"
                  disabled={step === 1 || submitting}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  Back
                </Button>
                <Button
                  disabled={!canContinue() || submitting}
                  onClick={() => void handleContinue()}
                >
                  {step === 7 ? "Create restaurant" : "Continue"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MarketingShell>
  );
}
