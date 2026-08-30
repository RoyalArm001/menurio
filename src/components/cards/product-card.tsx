import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/format";
import { TagBadge } from "@/components/ui/badge";
import type { MenuProduct } from "@/data/mock";
import { Plus } from "lucide-react";

export function ProductCard({
  product,
  onSelect,
  onAdd,
  compact = false,
}: {
  product: MenuProduct;
  onSelect?: () => void;
  onAdd?: () => void;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[24px] border border-line/80 bg-surface shadow-soft transition hover:-translate-y-0.5 hover:shadow-float",
        !product.available && "opacity-75",
      )}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {!product.available ? (
            <span className="absolute left-3 top-3 rounded-full bg-night/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Sold Out
            </span>
          ) : null}
          <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-1">
            {product.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
        <div className={cn("p-4", compact && "p-3")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-ink">{product.name}</h3>
              {!compact ? (
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">
                  {product.description}
                </p>
              ) : null}
            </div>
            <div className="shrink-0 text-right">
              <p className="font-bold text-ink">{formatPrice(product.price)}</p>
              {product.compareAtPrice ? (
                <p className="text-xs text-muted line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              ) : null}
            </div>
          </div>
          {!compact ? (
            <p className="mt-3 text-xs text-muted">{product.calories} kcal</p>
          ) : null}
        </div>
      </button>
      {onAdd && product.available ? (
        <div className="border-t border-line/70 px-4 py-3">
          <button
            type="button"
            onClick={onAdd}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-night py-2.5 text-sm font-semibold text-white transition hover:bg-black"
          >
            <Plus className="size-4" /> Add to cart
          </button>
        </div>
      ) : null}
    </article>
  );
}

export function RestaurantCard({
  name,
  description,
  href,
  image,
  status,
}: {
  name: string;
  description: string;
  href: string;
  image: string;
  status?: string;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[28px] border border-line/80 bg-surface shadow-soft transition hover:-translate-y-1 hover:shadow-float"
    >
      <div className="relative aspect-[16/10] bg-cream">
        <Image src={image} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        {status ? (
          <span className="absolute left-4 top-4 rounded-full bg-success px-3 py-1 text-xs font-bold text-white">
            {status}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-ink">{name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </div>
    </Link>
  );
}
