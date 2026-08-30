"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, Minus, Plus, Flame, Leaf } from "lucide-react";
import { categories, products, demoRestaurant } from "@/data/mock";
import type { MenuProduct } from "@/data/mock";
import { Tabs } from "@/components/ui/tabs";
import { ProductCard } from "@/components/cards/product-card";
import { Drawer, Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { resolvePublicLanguage, getPublicSiteUi } from "@/lib/i18n/public-languages";

type Lang = "en" | "hy" | "ru";

function getProductName(product: MenuProduct, lang: Lang) {
  if (lang === "hy") return product.armenianName;
  if (lang === "ru") return product.russianName ?? product.name;
  return product.name;
}

export default function DemoMenuPageClient() {
  const searchParams = useSearchParams();
  const initialDish = searchParams.get("dish");
  const openCart = searchParams.get("cart") === "1";
  const lang = resolvePublicLanguage(searchParams.get("lang")) as Lang;
  const ui = getPublicSiteUi(lang);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MenuProduct | null>(() =>
    initialDish ? products.find((p) => p.slug === initialDish) ?? null : null,
  );
  const [cartOpen, setCartOpen] = useState(openCart);
  const { items, addItem, updateQuantity, removeItem, total, count, clear } =
    useCart();
  const { push } = useToast();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inCategory =
        activeCategory === "all" || p.category === activeCategory;
      const q = search.trim().toLocaleLowerCase();
      const inSearch =
        !q ||
        [
          p.name,
          p.armenianName,
          p.russianName ?? "",
          p.description,
          ...p.ingredients,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(q);
      return inCategory && inSearch;
    });
  }, [activeCategory, search]);

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener("avena:open-cart", handleOpenCart);
    return () => window.removeEventListener("avena:open-cart", handleOpenCart);
  }, []);

  const tabItems = [
    { id: "all", label: ui.all, count: products.length },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      count: products.filter((product) => product.category === c.id).length,
    })),
  ];

  function handleAdd(product: MenuProduct) {
    if (!product.available) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      available: product.available,
    });
    push(`${product.name} added to cart`, "success");
  }

  function handleCheckout() {
    push("Order submitted (demo only — backend coming soon)", "success");
    clear();
    setCartOpen(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--r-primary)]">
            {ui.menu}
          </p>
          <h1 className="display-font text-3xl font-semibold tracking-tight sm:text-4xl">
            {demoRestaurant.name}
          </h1>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--r-muted)]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ui.search}
          className="border-[var(--r-line)] bg-[var(--r-surface)] pl-11"
        />
      </div>

      <Tabs
        items={tabItems}
        value={activeCategory}
        onChange={setActiveCategory}
        className="mb-6"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              name: getProductName(product, lang),
            }}
            onSelect={() => setSelected(product)}
            onAdd={() => handleAdd(product)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-[var(--r-muted)]">
          No dishes match your search.
        </p>
      ) : null}

      {count > 0 ? (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 left-4 right-4 z-30 flex items-center justify-between rounded-full bg-[var(--r-primary)] px-5 py-4 font-semibold text-white shadow-float sm:hidden"
        >
          <span>View cart ({count})</span>
          <span>{formatPrice(total)}</span>
        </button>
      ) : null}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? getProductName(selected, lang) : undefined}
        className="sm:max-w-xl"
      >
        {selected ? (
          <div>
            <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[20px] bg-[var(--r-bg)]">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover"
              />
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
              {!selected.available ? (
                <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-bold uppercase">
                  Sold Out
                </span>
              ) : null}
            </div>
            <p className="text-sm leading-7 text-[var(--r-muted)]">
              {selected.description}
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <p>
                <strong>Ingredients:</strong>{" "}
                {selected.ingredients.join(", ")}
              </p>
              <p className="flex items-center gap-2">
                <Flame className="size-4 text-[var(--r-primary)]" />
                {selected.calories} kcal
              </p>
              {selected.allergens.length ? (
                <p>
                  <strong>Allergens:</strong> {selected.allergens.join(", ")}
                </p>
              ) : (
                <p className="flex items-center gap-2 text-success">
                  <Leaf className="size-4" /> No major allergens listed
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-2xl font-bold text-[var(--r-primary)]">
                {formatPrice(selected.price)}
              </p>
              <Button
                disabled={!selected.available}
                onClick={() => {
                  handleAdd(selected);
                  setSelected(null);
                }}
              >
                Add to cart
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Drawer open={cartOpen} onClose={() => setCartOpen(false)} title="Your order">
        {items.length === 0 ? (
          <p className="text-center text-[var(--r-muted)]">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-2xl border border-[var(--r-line)] p-3"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[var(--r-bg)]">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-[var(--r-muted)]">
                    {formatPrice(item.product.price)}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="grid size-8 place-items-center rounded-full border border-[var(--r-line)]"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="grid size-8 place-items-center rounded-full border border-[var(--r-line)]"
                    >
                      <Plus className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-xs font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-[var(--r-line)] pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="mt-4 w-full" onClick={handleCheckout}>
                Submit order
              </Button>
              <p className="mt-2 text-center text-xs text-[var(--r-muted)]">
                Demo checkout — order API integration coming soon
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
