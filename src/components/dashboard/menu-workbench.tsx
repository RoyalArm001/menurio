"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  GripVertical,
  ImagePlus,
  Languages,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { cx } from "@/components/ui/button";
import {
  editorCategories,
  editorProducts,
  type EditorCategory,
  type EditorProduct,
} from "./dashboard-data";
import {
  DashboardButton,
  Field,
  PageHeader,
  Panel,
  PrototypeNotice,
  SelectControl,
  StatusPill,
  Toggle,
} from "./dashboard-ui";

const blankProduct = (categoryId: string): EditorProduct => ({
  id: `draft-${Date.now()}`,
  name: "",
  categoryId,
  description: "",
  price: 0,
  image: "/images/burrata.png",
  available: true,
  featured: false,
  translations: { hy: "", ru: "" },
});

function ProductEditor({
  draft,
  categories,
  isNew,
  onChange,
  onClose,
  onSave,
}: {
  draft: EditorProduct;
  categories: EditorCategory[];
  isNew: boolean;
  onChange: (product: EditorProduct) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const [tab, setTab] = useState<"details" | "translations">("details");
  const uploadRef = useRef<HTMLInputElement>(null);

  function handleImage(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange({ ...draft, image: reader.result });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] xl:static xl:z-auto xl:bg-transparent xl:backdrop-blur-none">
      <button type="button" aria-label="Close product editor" className="absolute inset-0 xl:hidden" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-[min(94vw,430px)] flex-col overflow-hidden bg-paper text-ink shadow-2xl xl:relative xl:inset-auto xl:w-auto xl:rounded-[22px] xl:border xl:border-line xl:shadow-[0_12px_40px_rgba(0,0,0,.14)]">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-surface px-5">
          <div>
            <p className="text-sm font-semibold text-ink">{isNew ? "New product" : "Edit product"}</p>
            <p className="mt-0.5 text-[10px] text-muted">English · Armenian · Russian</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-cream hover:text-ink" aria-label="Close editor">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex border-b border-line bg-surface px-5">
          {(["details", "translations"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cx(
                "relative flex h-11 items-center gap-2 px-3 text-xs font-semibold capitalize transition",
                tab === item ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {item === "translations" ? <Languages className="size-3.5" /> : null}
              {item}
              {tab === item ? <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand" /> : null}
            </button>
          ))}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-5">
          {tab === "details" ? (
            <div className="space-y-5">
              <div>
                <span className="mb-2 block text-xs font-semibold text-ink/80">Product image</span>
                <button
                  type="button"
                  onClick={() => uploadRef.current?.click()}
                  className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-cream text-left"
                >
                  <Image src={draft.image} alt="Product preview" fill unoptimized={draft.image.startsWith("data:")} className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-xl bg-white/92 px-3 py-2 text-[11px] font-semibold text-[#373733] shadow-lg backdrop-blur">
                    <ImagePlus className="size-3.5" /> Replace image
                  </span>
                </button>
                <input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleImage(event.target.files?.[0])} />
                <p className="mt-2 text-[10px] text-muted">JPG, PNG or WebP · visual preview only</p>
              </div>

              <Field label="Product name" placeholder="e.g. Charcoal trout" value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} />
              <SelectControl label="Category" value={draft.categoryId} onChange={(categoryId) => onChange({ ...draft, categoryId })}>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </SelectControl>
              <label className="block">
                <span className="mb-2 flex items-center justify-between text-xs font-semibold text-ink/80">Description <span className="font-normal text-muted">{draft.description.length}/180</span></span>
                <textarea
                  value={draft.description}
                  maxLength={180}
                  onChange={(event) => onChange({ ...draft, description: event.target.value })}
                  placeholder="Describe ingredients, flavor and preparation"
                  className="min-h-28 w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-3 text-sm leading-5 text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand/10"
                />
              </label>
              <Field label="Price" hint="AMD" type="number" min="0" step="100" value={draft.price || ""} onChange={(event) => onChange({ ...draft, price: Number(event.target.value) })} />

              <div className="divide-y divide-line rounded-2xl border border-line bg-surface px-4">
                <div className="flex items-center justify-between gap-4 py-4">
                  <div><p className="text-xs font-semibold text-ink/85">Available to order</p><p className="mt-1 text-[10px] text-muted">Guests can add this item to cart</p></div>
                  <Toggle checked={draft.available} onChange={(available) => onChange({ ...draft, available })} label="Product availability" />
                </div>
                <div className="flex items-center justify-between gap-4 py-4">
                  <div><p className="flex items-center gap-1.5 text-xs font-semibold text-ink/85"><Star className="size-3.5 text-amber-500" /> Featured product</p><p className="mt-1 text-[10px] text-muted">Highlight on your website and menu</p></div>
                  <Toggle checked={draft.featured} onChange={(featured) => onChange({ ...draft, featured })} label="Feature product" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl border border-line bg-cream p-4">
                <div className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-600"><Sparkles className="size-4" /></span>
                  <div><p className="text-xs font-semibold text-ink">Translation workspace</p><p className="mt-1 text-[11px] leading-5 text-muted">Keep every language polished and on-brand. Automatic translation will be connected later.</p></div>
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="mb-4 flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-cream text-[10px] font-bold">HY</span><p className="text-xs font-semibold">Armenian</p><StatusPill tone={draft.translations.hy ? "green" : "amber"}>{draft.translations.hy ? "Ready" : "Missing"}</StatusPill></div>
                <Field label="Translated name" lang="hy" placeholder="Ապրանքի անունը" value={draft.translations.hy} onChange={(event) => onChange({ ...draft, translations: { ...draft.translations, hy: event.target.value } })} />
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4">
                <div className="mb-4 flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-cream text-[10px] font-bold">RU</span><p className="text-xs font-semibold">Russian</p><StatusPill tone={draft.translations.ru ? "green" : "amber"}>{draft.translations.ru ? "Ready" : "Missing"}</StatusPill></div>
                <Field label="Translated name" lang="ru" placeholder="Название продукта" value={draft.translations.ru} onChange={(event) => onChange({ ...draft, translations: { ...draft.translations, ru: event.target.value } })} />
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-line bg-surface p-4">
          <DashboardButton variant="light" className="flex-1" onClick={onClose}>Cancel</DashboardButton>
          <DashboardButton variant="brand" className="flex-[1.4]" disabled={!draft.name.trim()} onClick={onSave}><Check className="size-4" /> {isNew ? "Create product" : "Save changes"}</DashboardButton>
        </div>
      </aside>
    </div>
  );
}

export function MenuWorkbench() {
  const [categories, setCategories] = useState(editorCategories);
  const [products, setProducts] = useState(editorProducts);
  const [activeCategory, setActiveCategory] = useState("small-plates");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<EditorProduct | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [saved, setSaved] = useState(false);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const inCategory = activeCategory === "all" || product.categoryId === activeCategory;
    const matches = product.name.toLowerCase().includes(query.toLowerCase());
    return inCategory && matches;
  }), [activeCategory, products, query]);

  function openEditor(product?: EditorProduct) {
    setIsNew(!product);
    setDraft(product ? { ...product, translations: { ...product.translations } } : blankProduct(activeCategory === "all" ? categories[0]?.id || "mains" : activeCategory));
    setSaved(false);
  }

  function saveProduct() {
    if (!draft) return;
    setProducts((current) => isNew ? [...current, draft] : current.map((product) => product.id === draft.id ? draft : product));
    setActiveCategory(draft.categoryId);
    setDraft(null);
    setSaved(true);
  }

  function moveProduct(productId: string, direction: -1 | 1) {
    setProducts((current) => {
      const from = current.findIndex((product) => product.id === productId);
      if (from < 0) return current;
      const sameCategory = current.map((product, index) => ({ product, index })).filter(({ product }) => product.categoryId === current[from]!.categoryId);
      const within = sameCategory.findIndex(({ product }) => product.id === productId);
      const target = sameCategory[within + direction]?.index;
      if (target === undefined) return current;
      const next = [...current];
      [next[from], next[target]] = [next[target]!, next[from]!];
      return next;
    });
  }

  function moveCategory(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= categories.length) return;
    setCategories((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }

  function addCategory() {
    const name = categoryName.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    setCategories((current) => [...current, { id, name, description: "New category" }]);
    setActiveCategory(id);
    setCategoryName("");
    setAddingCategory(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Restaurant menu"
        title="Menu editor"
        description="Build a menu that stays beautiful, accurate and easy to order from."
        actions={
          <>
            {saved ? <StatusPill tone="green"><Check className="size-3" /> Changes saved</StatusPill> : null}
            <DashboardButton variant="light">Preview menu</DashboardButton>
            <DashboardButton variant="brand" onClick={() => openEditor()}><Plus className="size-4" /> Add product</DashboardButton>
          </>
        }
      />

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_380px]">
        <Panel className="h-fit overflow-hidden p-2.5">
          <div className="flex items-center justify-between px-2 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Categories</p>
            <button type="button" aria-label="Add category" onClick={() => setAddingCategory(true)} className="grid size-7 place-items-center rounded-lg text-muted transition hover:bg-cream hover:text-ink"><Plus className="size-4" /></button>
          </div>
          {addingCategory ? (
            <div className="mb-2 rounded-xl border border-line bg-cream p-2">
              <input autoFocus value={categoryName} onChange={(event) => setCategoryName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addCategory(); if (event.key === "Escape") setAddingCategory(false); }} placeholder="Category name" className="h-9 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-ink outline-none placeholder:text-muted/65 focus:border-brand" />
              <div className="mt-2 flex gap-1.5"><button type="button" onClick={addCategory} className="flex-1 rounded-lg bg-brand py-2 text-[10px] font-bold text-white transition hover:bg-brand-deep">Create</button><button type="button" onClick={() => setAddingCategory(false)} className="rounded-lg px-2.5 text-[10px] font-semibold text-muted transition hover:text-ink">Cancel</button></div>
            </div>
          ) : null}
          <div className="no-scrollbar flex gap-1 overflow-x-auto lg:block lg:space-y-1">
            <button type="button" onClick={() => setActiveCategory("all")} className={cx("flex min-w-max items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition lg:w-full", activeCategory === "all" ? "bg-brand text-white" : "text-muted hover:bg-cream hover:text-ink")}><span>All products</span><span className={activeCategory === "all" ? "text-white/60" : "text-muted/70"}>{products.length}</span></button>
            {categories.map((category, index) => (
              <div key={category.id} className={cx("group flex min-w-max items-center rounded-xl transition lg:w-full", activeCategory === category.id ? "bg-cream" : "hover:bg-cream/65")}>
                <button type="button" onClick={() => setActiveCategory(category.id)} className={cx("flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-2.5 text-left text-xs font-semibold", activeCategory === category.id ? "text-ink" : "text-muted")}><span className="truncate">{category.name}</span><span className="text-[10px] text-muted/70">{products.filter((product) => product.categoryId === category.id).length}</span></button>
                <div className="mr-1 hidden items-center lg:group-hover:flex"><button type="button" aria-label={`Move ${category.name} up`} disabled={index === 0} onClick={() => moveCategory(index, -1)} className="p-1 text-muted/70 disabled:opacity-20"><ArrowUp className="size-3" /></button><button type="button" aria-label={`Move ${category.name} down`} disabled={index === categories.length - 1} onClick={() => moveCategory(index, 1)} className="p-1 text-muted/70 disabled:opacity-20"><ArrowDown className="size-3" /></button></div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setAddingCategory(true)} className="mt-2 flex w-full items-center gap-2 rounded-xl border border-dashed border-line px-3 py-2.5 text-xs font-semibold text-muted transition hover:border-brand hover:bg-cream hover:text-ink"><Plus className="size-3.5" /> New category</button>
        </Panel>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="relative min-w-[180px] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-4 text-xs text-ink outline-none placeholder:text-muted/65 focus:border-brand" /></label>
            <StatusPill>{visibleProducts.length} products</StatusPill>
          </div>
          <PrototypeNotice />
          <div className="mt-3 space-y-2.5">
            {visibleProducts.map((product, index) => (
              <Panel key={product.id} className={cx("group overflow-hidden transition hover:border-brand/35 hover:shadow-[0_10px_34px_rgba(0,0,0,.08)]", draft?.id === product.id && "border-brand/45 ring-2 ring-brand/10")}>
                <div className="flex items-center gap-3 p-3 sm:gap-4">
                  <GripVertical className="hidden size-4 shrink-0 text-muted/50 sm:block" />
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream sm:size-[72px]"><Image src={product.image} alt="" fill className={cx("object-cover", !product.available && "grayscale")} /></div>
                  <button type="button" onClick={() => openEditor(product)} className="min-w-0 flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-1.5"><h3 className="truncate text-sm font-semibold text-ink">{product.name}</h3>{product.featured ? <StatusPill tone="amber"><Star className="size-2.5 fill-current" /> Featured</StatusPill> : null}{!product.available ? <StatusPill tone="neutral">Sold out</StatusPill> : null}</div>
                    <p className="mt-1 line-clamp-1 text-[11px] leading-5 text-muted">{product.description}</p>
                    <p className="mt-1.5 text-xs font-bold text-ink/85">{product.price.toLocaleString("en-US")} ֏</p>
                  </button>
                  <div className="hidden items-center gap-2 sm:flex">
                    <Toggle checked={product.available} onChange={(available) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, available } : item))} label={`${product.name} availability`} />
                    <div className="flex flex-col"><button type="button" disabled={index === 0} onClick={() => moveProduct(product.id, -1)} aria-label={`Move ${product.name} up`} className="rounded-md p-1 text-muted hover:bg-cream disabled:opacity-20"><ArrowUp className="size-3" /></button><button type="button" disabled={index === visibleProducts.length - 1} onClick={() => moveProduct(product.id, 1)} aria-label={`Move ${product.name} down`} className="rounded-md p-1 text-muted hover:bg-cream disabled:opacity-20"><ArrowDown className="size-3" /></button></div>
                    <button type="button" onClick={() => openEditor(product)} aria-label={`Edit ${product.name}`} className="grid size-9 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:border-brand hover:text-ink"><Pencil className="size-3.5" /></button>
                  </div>
                  <button type="button" onClick={() => openEditor(product)} className="grid size-9 place-items-center rounded-xl text-muted sm:hidden" aria-label={`Edit ${product.name}`}><MoreHorizontal className="size-5" /></button>
                </div>
              </Panel>
            ))}
            {visibleProducts.length === 0 ? (
              <Panel className="grid min-h-60 place-items-center p-8 text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-cream text-muted"><Search className="size-5" /></span><p className="mt-4 text-sm font-semibold">No products found</p><p className="mt-1 text-xs text-muted">Try another search or add a new product.</p><DashboardButton size="sm" className="mt-4" onClick={() => openEditor()}><Plus className="size-3.5" /> Add product</DashboardButton></div></Panel>
            ) : null}
          </div>
        </div>

        {draft ? <ProductEditor draft={draft} categories={categories} isNew={isNew} onChange={setDraft} onClose={() => setDraft(null)} onSave={saveProduct} /> : (
          <Panel className="hidden h-fit min-h-[510px] place-items-center border-dashed bg-transparent p-8 text-center xl:grid">
            <div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface text-muted shadow-sm"><ChevronLeft className="size-5" /></span><p className="mt-4 text-sm font-semibold text-ink/80">Select a product</p><p className="mt-1 max-w-48 text-xs leading-5 text-muted">Choose a product to edit its details, image and translations.</p></div>
          </Panel>
        )}
      </div>
    </div>
  );
}
