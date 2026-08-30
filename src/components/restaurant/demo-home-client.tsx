"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MapPin,
  Phone,
  Clock,
  Share2,
  AtSign,
  UtensilsCrossed,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { demoRestaurant, products } from "@/data/mock";
import type { MenuProduct } from "@/data/mock";
import { formatPrice } from "@/lib/format";
import { buttonStyles } from "@/components/ui/button";
import {
  getPublicSiteUi,
  resolvePublicLanguage,
  withLangParam,
  type PublicLanguage,
} from "@/lib/i18n/public-languages";

function getProductName(product: MenuProduct, lang: PublicLanguage) {
  if (lang === "hy") return product.armenianName;
  if (lang === "ru") return product.russianName ?? product.name;
  return product.name;
}

function DemoRestaurantHomeInner() {
  const searchParams = useSearchParams();
  const lang = resolvePublicLanguage(searchParams.get("lang"));
  const ui = getPublicSiteUi(lang);
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative aspect-[16/10] max-h-[520px] w-full sm:aspect-[21/9]">
          <Image
            src={demoRestaurant.cover}
            alt={`${demoRestaurant.name} interior`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12">
            <span className="inline-flex rounded-full bg-success px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {ui.open}
            </span>
            <h1 className="display-font mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {demoRestaurant.name}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              {demoRestaurant.tagline}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={withLangParam("/r/demo-restaurant/menu", lang)}
                className={buttonStyles({ size: "lg" })}
              >
                {ui.viewMenu}
              </Link>
              {demoRestaurant.services.tableOrdering ? (
                <Link
                  href={withLangParam("/r/demo-restaurant/menu?table=8", lang)}
                  className={buttonStyles({
                    variant: "secondary",
                    size: "lg",
                    className: "border-white/20 bg-white/10 text-white hover:bg-white/20",
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
          { icon: UtensilsCrossed, label: ui.dineIn, active: demoRestaurant.services.dineIn },
          { icon: ShoppingBag, label: ui.pickup, active: demoRestaurant.services.pickup },
          { icon: Truck, label: ui.delivery, active: demoRestaurant.services.delivery },
        ].map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-[24px] border border-[var(--r-line)] bg-[var(--r-surface)] p-5"
          >
            <div className="grid size-12 place-items-center rounded-2xl bg-[var(--r-primary)]/10 text-[var(--r-primary)]">
              <Icon className="size-5" />
            </div>
            <div>
              <p className="font-semibold">{label}</p>
              <p className="text-sm text-[var(--r-muted)]">
                {active ? ui.available : ui.notAvailable}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--r-primary)]">
              {ui.signatureDishes}
            </p>
            <h2 className="display-font mt-2 text-3xl font-semibold tracking-tight">
              {ui.fromKitchen}
            </h2>
          </div>
          <Link
            href={withLangParam("/r/demo-restaurant/menu", lang)}
            className="text-sm font-semibold text-[var(--r-primary)]"
          >
            {ui.fullMenu}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={withLangParam(`/r/demo-restaurant/menu?dish=${product.slug}`, lang)}
              className="overflow-hidden rounded-[24px] border border-[var(--r-line)] bg-[var(--r-surface)] shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="relative aspect-square bg-[var(--r-bg)]">
                <Image
                  src={product.image}
                  alt={getProductName(product, lang)}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{getProductName(product, lang)}</h3>
                <p className="mt-1 text-sm font-bold text-[var(--r-primary)]">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 rounded-[28px] border border-[var(--r-line)] bg-[var(--r-surface)] p-6 lg:grid-cols-2 lg:p-8">
          <div>
            <h2 className="text-2xl font-semibold">{ui.visitUs}</h2>
            <ul className="mt-5 space-y-4 text-sm text-[var(--r-muted)]">
              <li>
                <a
                  href="https://maps.google.com/?q=12+Abovyan+Street+Yerevan"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-3 transition hover:text-[var(--r-primary)]"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--r-primary)]" />
                  {demoRestaurant.address}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${demoRestaurant.phone.replace(/\s/g, "")}`}
                  className="flex gap-3 transition hover:text-[var(--r-primary)]"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-[var(--r-primary)]" />
                  {demoRestaurant.phone}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/avena.yerevan"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-3 transition hover:text-[var(--r-primary)]"
                >
                  <AtSign className="mt-0.5 size-4 shrink-0 text-[var(--r-primary)]" />
                  {demoRestaurant.instagram}
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-3 transition hover:text-[var(--r-primary)]"
                >
                  <Share2 className="mt-0.5 size-4 shrink-0 text-[var(--r-primary)]" />
                  {demoRestaurant.facebook}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-semibold">
              <Clock className="size-4 text-[var(--r-primary)]" /> {ui.openingHours}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {demoRestaurant.hours.map((h) => (
                <li
                  key={h.days}
                  className="flex justify-between gap-4 border-b border-[var(--r-line)] py-2"
                >
                  <span className="text-[var(--r-muted)]">{h.days}</span>
                  <span className="font-medium">{h.time}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://maps.google.com/?q=12+Abovyan+Street+Yerevan"
              target="_blank"
              rel="noreferrer"
              className="group mt-5 flex h-40 flex-col items-center justify-center rounded-2xl border border-[var(--r-line)] bg-[var(--r-bg)] px-6 text-center transition hover:border-[var(--r-primary)]/40 hover:bg-[var(--r-primary)]/5"
            >
              <span className="grid size-11 place-items-center rounded-full bg-[var(--r-primary)] text-white shadow-sm transition group-hover:-translate-y-0.5">
                <MapPin className="size-5" />
              </span>
              <strong className="mt-3 text-sm text-[var(--r-text)]">{ui.openInMaps}</strong>
              <span className="mt-1 text-xs text-[var(--r-muted)]">
                12 Abovyan Street · 4 min from Republic Square
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export function DemoRestaurantHomeClient() {
  return (
    <Suspense fallback={null}>
      <DemoRestaurantHomeInner />
    </Suspense>
  );
}
