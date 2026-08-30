"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  UtensilsCrossed,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { buttonStyles } from "@/components/ui/button";
import { usePublicRestaurant } from "@/contexts/public-restaurant-context";
import { withLangParam } from "@/lib/i18n/public-languages";
import {
  useLocalizedRestaurantContent,
  usePublicLanguage,
} from "@/hooks/use-public-language";

export type PublicMenuProduct = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
  categoryName: string;
  tags: string[];
};

export function PublicHomePage({
  featuredProducts,
}: {
  featuredProducts: PublicMenuProduct[];
}) {
  const r = usePublicRestaurant();
  const { ui, lang } = usePublicLanguage();
  const localized = useLocalizedRestaurantContent();
  const base = r.publicBasePath;
  const menuHref = `${base}/menu`;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/10] max-h-[520px] w-full bg-[var(--r-surface)] sm:aspect-[21/9]">
          {r.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={r.coverImageUrl}
              alt={localized.name}
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12">
            <span className="inline-flex rounded-full bg-success px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {ui.open}
            </span>
            <h1 className="display-font mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {localized.name}
            </h1>
            {localized.tagline ? (
              <p className="mt-3 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                {localized.tagline}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={withLangParam(menuHref, lang)}
                className={buttonStyles({ size: "lg" })}
              >
                {ui.viewMenu}
              </Link>
              {r.tableOrderingEnabled ? (
                <Link
                  href={withLangParam(`${menuHref}?table=1`, lang)}
                  className={buttonStyles({
                    variant: "secondary",
                    size: "lg",
                    className:
                      "border-white/20 bg-white/10 text-white hover:bg-white/20",
                  })}
                >
                  {ui.orderAtTable}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
        {[
          { icon: UtensilsCrossed, label: ui.dineIn, active: true },
          { icon: ShoppingBag, label: ui.pickup, active: r.pickupEnabled },
          { icon: Truck, label: ui.delivery, active: r.deliveryEnabled },
        ].map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={`rounded-[24px] border p-5 ${
              active
                ? "border-[var(--r-line)] bg-[var(--r-surface)]"
                : "border-dashed opacity-50"
            }`}
          >
            <Icon className="size-6 text-[var(--r-primary)]" />
            <p className="mt-3 font-semibold">{label}</p>
            <p className="text-sm text-[var(--r-muted)]">
              {active ? ui.available : ui.notAvailable}
            </p>
          </div>
        ))}
      </section>

      {localized.description ? (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="max-w-3xl text-lg leading-8 text-[var(--r-muted)]">
            {localized.description}
          </p>
        </section>
      ) : null}

      {featuredProducts.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="display-font text-2xl font-semibold">{ui.featured}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <Link
                key={p.id}
                href={withLangParam(`${menuHref}?dish=${p.id}`, lang)}
                className="rounded-[24px] border border-[var(--r-line)] bg-[var(--r-surface)] p-4 transition hover:shadow-soft"
              >
                <p className="font-semibold">{p.name}</p>
                <p className="mt-1 text-sm text-[var(--r-muted)] line-clamp-2">
                  {p.description}
                </p>
                <p className="mt-3 font-bold text-[var(--r-primary)]">
                  {formatPrice(p.price, r.currency, lang)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 rounded-[28px] border border-[var(--r-line)] bg-[var(--r-surface)] p-6 sm:grid-cols-2">
          {r.address ? (
            <div className="flex gap-3">
              <MapPin className="size-5 shrink-0 text-[var(--r-primary)]" />
              <div>
                <p className="font-semibold">{ui.address}</p>
                <p className="text-sm text-[var(--r-muted)]">{r.address}</p>
              </div>
            </div>
          ) : null}
          {r.phone ? (
            <div className="flex gap-3">
              <Phone className="size-5 shrink-0 text-[var(--r-primary)]" />
              <div>
                <p className="font-semibold">{ui.phone}</p>
                <p className="text-sm text-[var(--r-muted)]">{r.phone}</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
