"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Search, Minus, Plus } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Drawer, Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/components/ui/toast";
import { usePublicDesign, usePublicRestaurant } from "@/contexts/public-restaurant-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api/client";
import type { PublicMenuProduct } from "@/components/restaurant/public-home";
import { PublicProductCard } from "@/components/restaurant/public-product-card";
import {
  useLocalizedRestaurantContent,
  usePublicLanguage,
} from "@/hooks/use-public-language";

export function PublicMenuClient({
  products,
  categories,
}: {
  products: PublicMenuProduct[];
  categories: Array<{ id: string; name: string }>;
}) {
  const searchParams = useSearchParams();
  const initialDish = searchParams.get("dish");
  const tableParam = searchParams.get("table");
  const openCart = searchParams.get("cart") === "1";

  const restaurant = usePublicRestaurant();
  const design = usePublicDesign();
  const { ui, lang } = usePublicLanguage();
  const localized = useLocalizedRestaurantContent();

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PublicMenuProduct | null>(() =>
    initialDish ? products.find((p) => p.id === initialDish) ?? null : null,
  );
  const [cartOpen, setCartOpen] = useState(openCart);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [orderType, setOrderType] = useState<"TABLE" | "PICKUP" | "DELIVERY">(
    tableParam ? "TABLE" : restaurant.pickupEnabled ? "PICKUP" : "TABLE",
  );
  const [submitting, setSubmitting] = useState(false);

  const { items, addItem, updateQuantity, removeItem, total, count, clear } =
    useCart();
  const { push } = useToast();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inCategory =
        activeCategory === "all" || p.categoryId === activeCategory;
      const q = search.trim().toLocaleLowerCase();
      const inSearch =
        !q ||
        [p.name, p.description ?? ""].join(" ").toLocaleLowerCase().includes(q);
      return inCategory && inSearch;
    });
  }, [activeCategory, search, products]);

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener("ws:open-cart", handleOpenCart);
    return () => window.removeEventListener("ws:open-cart", handleOpenCart);
  }, []);

  const tabItems = [
    { id: "all", label: ui.all, count: products.length },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      count: products.filter((p) => p.categoryId === c.id).length,
    })),
  ];

  function handleAdd(product: PublicMenuProduct) {
    if (!product.isAvailable) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl ?? undefined,
      available: product.isAvailable,
    });
    push(`${product.name}`, "success");
  }

  async function handleCheckout() {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      await api.submitPublicOrder(restaurant.slug, {
        orderType,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        customerNotes: customerNotes || undefined,
        tableLabel: tableParam ?? (orderType === "TABLE" ? "1" : undefined),
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          notes: i.notes,
        })),
      });
      push(ui.orderSubmitted, "success");
      clear();
      setCartOpen(false);
      setCheckoutOpen(false);
    } catch (e) {
      push(e instanceof ApiError ? e.message : ui.orderFailed, "error");
    } finally {
      setSubmitting(false);
    }
  }

  const orderingEnabled =
    restaurant.tableOrderingEnabled ||
    restaurant.pickupEnabled ||
    restaurant.deliveryEnabled;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--r-primary)]">
            {ui.menu}
          </p>
          <h1 className="display-font text-3xl font-semibold tracking-tight sm:text-4xl">
            {localized.name}
          </h1>
          {tableParam ? (
            <p className="mt-2 text-sm text-[var(--r-muted)]">
              {ui.table} {tableParam}
            </p>
          ) : null}
          {restaurant.waiterCallEnabled && tableParam ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  void api
                    .submitPublicWaiter(restaurant.slug, {
                      type: "CALL_WAITER",
                      tableLabel: tableParam,
                    })
                    .then(() => push(ui.orderSubmitted, "success"))
                    .catch((e) =>
                      push(
                        e instanceof ApiError ? e.message : ui.orderFailed,
                        "error",
                      ),
                    )
                }
              >
                {ui.callWaiter}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  void api
                    .submitPublicWaiter(restaurant.slug, {
                      type: "REQUEST_BILL",
                      tableLabel: tableParam,
                    })
                    .then(() => push(ui.orderSubmitted, "success"))
                    .catch((e) =>
                      push(
                        e instanceof ApiError ? e.message : ui.orderFailed,
                        "error",
                      ),
                    )
                }
              >
                {ui.requestBill}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--r-muted)]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ui.search}
          className="border-[var(--r-line)] bg-[var(--r-surface)] pl-11"
        />
      </div>

      {categories.length > 0 ? (
        <Tabs
          items={tabItems}
          value={activeCategory}
          onChange={setActiveCategory}
          className="mb-6"
        />
      ) : null}

      {products.length === 0 ? (
        <p className="py-16 text-center text-[var(--r-muted)]">{ui.emptyMenu}</p>
      ) : (
        <div
          className={
            design.menuLayout === "list"
              ? "space-y-3"
              : design.menuLayout === "editorial"
                ? "grid gap-6 lg:grid-cols-2"
                : design.menuLayout === "grid"
                  ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {filtered.map((product) => (
            <PublicProductCard
              key={product.id}
              product={product}
              soldOutLabel={ui.soldOut}
              addLabel={ui.addToCart}
              onSelect={() => setSelected(product)}
              onAdd={() => handleAdd(product)}
            />
          ))}
        </div>
      )}

      {products.length > 0 && filtered.length === 0 ? (
        <p className="py-16 text-center text-[var(--r-muted)]">{ui.noDishes}</p>
      ) : null}

      {count > 0 ? (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 left-4 right-4 z-30 flex items-center justify-between rounded-full bg-[var(--r-primary)] px-5 py-4 font-semibold text-white shadow-float sm:hidden"
        >
          <span>
            {ui.cart} ({count})
          </span>
          <span>{formatPrice(total, restaurant.currency, lang)}</span>
        </button>
      ) : null}

      <Drawer open={cartOpen} onClose={() => setCartOpen(false)} title={ui.cart}>
        {items.length === 0 ? (
          <p className="text-sm text-[var(--r-muted)]">{ui.emptyCart}</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
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
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-[var(--r-muted)]">
                    {formatPrice(item.product.price, restaurant.currency, lang)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="grid size-8 place-items-center rounded-full border"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="grid size-8 place-items-center rounded-full border"
                    >
                      <Plus className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-xs text-red-600"
                    >
                      {ui.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t border-[var(--r-line)] pt-4">
          <div className="flex justify-between font-semibold">
            <span>{ui.subtotal}</span>
            <span>{formatPrice(total, restaurant.currency, lang)}</span>
          </div>
          {orderingEnabled ? (
            <Button
              className="mt-4 w-full"
              disabled={items.length === 0}
              onClick={() => setCheckoutOpen(true)}
            >
              {ui.onlineOrdering} ({count})
            </Button>
          ) : (
            <p className="mt-4 text-sm text-[var(--r-muted)]">
              {ui.orderingDisabled}
            </p>
          )}
        </div>
      </Drawer>

      <Modal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={ui.checkout}
      >
        <div className="space-y-4">
          <div>
            <Label>{ui.orderType}</Label>
            <select
              className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-sm"
              value={orderType}
              onChange={(e) =>
                setOrderType(e.target.value as "TABLE" | "PICKUP" | "DELIVERY")
              }
            >
              {restaurant.tableOrderingEnabled ? (
                <option value="TABLE">{ui.orderTable}</option>
              ) : null}
              {restaurant.pickupEnabled ? (
                <option value="PICKUP">{ui.orderPickup}</option>
              ) : null}
              {restaurant.deliveryEnabled ? (
                <option value="DELIVERY">{ui.orderDelivery}</option>
              ) : null}
            </select>
          </div>
          <div>
            <Label>{ui.name}</Label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <Label>{ui.phone}</Label>
            <Input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
          <div>
            <Label>{ui.notes}</Label>
            <Input
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            disabled={submitting}
            onClick={() => void handleCheckout()}
          >
            {submitting
              ? ui.submitting
              : `${ui.placeOrder} · ${formatPrice(total, restaurant.currency, lang)}`}
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? "Product"}
        className="sm:max-w-xl"
      >
        {selected ? (
          <div className="space-y-4">
            {selected.imageUrl ? (
              <div className="relative mb-2 aspect-[16/10] overflow-hidden rounded-[20px] bg-[var(--r-bg)]">
                <Image
                  src={selected.imageUrl}
                  alt={selected.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-cover"
                />
              </div>
            ) : null}
            {selected.description ? (
              <p className="text-sm text-[var(--r-muted)]">
                {selected.description}
              </p>
            ) : null}
            <p className="text-2xl font-bold text-[var(--r-primary)]">
              {formatPrice(selected.price, restaurant.currency, lang)}
            </p>
            <Button
              className="w-full"
              disabled={!selected.isAvailable}
              onClick={() => {
                handleAdd(selected);
                setSelected(null);
              }}
            >
              {ui.addToCart}
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
