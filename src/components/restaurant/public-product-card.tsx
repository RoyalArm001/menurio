"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { cn, formatPrice } from "@/lib/format";
import { Badge, TagBadge } from "@/components/ui/badge";
import type { PublicMenuProduct } from "@/components/restaurant/public-home";
import {
  usePublicDesign,
  usePublicRestaurant,
} from "@/contexts/public-restaurant-context";
import { usePublicLanguage } from "@/hooks/use-public-language";

export function PublicProductCard({
  product,
  soldOutLabel,
  addLabel,
  onSelect,
  onAdd,
}: {
  product: PublicMenuProduct;
  soldOutLabel: string;
  addLabel: string;
  onSelect?: () => void;
  onAdd?: () => void;
}) {
  const design = usePublicDesign();
  const restaurant = usePublicRestaurant();
  const { lang } = usePublicLanguage();
  const card =
    design.cardStyle === "flat"
      ? "rounded-[var(--r-card-radius)] bg-[var(--r-surface)]"
      : design.cardStyle === "outlined"
        ? "rounded-[var(--r-card-radius)] border border-[var(--r-line)] bg-transparent"
        : design.cardStyle === "compact"
          ? "rounded-[var(--r-card-radius)] border border-[var(--r-line)] bg-[var(--r-surface)]"
          : "rounded-[var(--r-card-radius)] border border-[var(--r-line)] bg-[var(--r-surface)] shadow-soft hover:-translate-y-0.5 hover:shadow-float";
  const image =
    design.imageStyle === "contain"
      ? "object-contain"
      : design.imageStyle === "square"
        ? "object-cover rounded-none"
        : design.imageStyle === "rounded"
          ? "object-cover rounded-2xl"
          : "object-cover";

  return (
    <article
      className={cn(
        "group overflow-hidden transition",
        card,
        !product.isAvailable && "opacity-75",
      )}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--r-bg)]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className={cn("transition duration-500 group-hover:scale-[1.03]", image)}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-[var(--r-muted)]">
              {product.name.slice(0, 1)}
            </div>
          )}
          {!product.isAvailable ? (
            <span className="absolute left-3 top-3 rounded-full bg-night/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              {soldOutLabel}
            </span>
          ) : null}
          {product.tags.length > 0 ? (
            <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1">
              {product.tags.map((tag) =>
                ["New", "Popular", "Spicy", "Vegan"].includes(tag) ? (
                  <TagBadge
                    key={tag}
                    tag={tag as "New" | "Popular" | "Spicy" | "Vegan"}
                  />
                ) : (
                  <Badge key={tag} variant="outline" className="text-[10px]">
                    {tag}
                  </Badge>
                ),
              )}
            </div>
          ) : null}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-[var(--r-text)]">{product.name}</h3>
              {product.description ? (
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--r-muted)]">
                  {product.description}
                </p>
              ) : null}
            </div>
            <div className="shrink-0 text-right">
              <p className="font-bold text-[var(--r-primary)]">
                {formatPrice(product.price, restaurant.currency, lang)}
              </p>
              {product.compareAtPrice ? (
                <p className="text-xs text-[var(--r-muted)] line-through">
                  {formatPrice(product.compareAtPrice, restaurant.currency, lang)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </button>
      {onAdd && product.isAvailable ? (
        <div className="border-t border-[var(--r-line)] px-4 py-3">
          <button
            type="button"
            onClick={onAdd}
            className="flex w-full items-center justify-center gap-2 bg-[var(--r-primary)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ borderRadius: "var(--r-button-radius)" }}
          >
            <Plus className="size-4" /> {addLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}
