"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { SegmentedTabs } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/states";
import { useRestaurant } from "@/contexts/restaurant-context";
import { api, ApiError } from "@/lib/api/client";

type Translation = { languageCode: string; name: string; description?: string | null };
type Product = {
  id: string;
  price: string;
  compareAtPrice: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  translations: Translation[];
};
type Category = {
  id: string;
  translations: Translation[];
  products: Product[];
};
type MenuTree = { id: string; name: string; categories: Category[] };

export default function MenuEditorClient() {
  const router = useRouter();
  const { activeRestaurant, loading: ctxLoading } = useRestaurant();
  const [menus, setMenus] = useState<MenuTree[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [importPreview, setImportPreview] = useState<
    Array<{ category: string; name: string; price: string; description?: string }> | null
  >(null);
  const [importJobId, setImportJobId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [menuLanguage, setMenuLanguage] = useState("en");
  const { push } = useToast();

  const menu = menus[0];
  const categories = menu?.categories ?? [];

  const loadMenu = useCallback(async () => {
    if (!activeRestaurant) return;
    setLoading(true);
    try {
      const [data, restaurantData] = await Promise.all([
        api.getMenuTree(activeRestaurant.id),
        api.getRestaurant(activeRestaurant.id),
      ]);
      const tree = data.menus as MenuTree[];
      setMenus(tree);
      setMenuLanguage(
        (restaurantData.restaurant as { defaultLanguage?: string })
          .defaultLanguage ?? "en",
      );
      const firstCat = tree[0]?.categories[0]?.id;
      if (firstCat) setActiveCategory(firstCat);
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed to load menu", "error");
    } finally {
      setLoading(false);
    }
  }, [activeRestaurant, push]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch menu on restaurant change
    void loadMenu();
  }, [activeRestaurant?.id]);

  async function createCategory() {
    if (!activeRestaurant || !menu || !newCategoryName.trim()) return;
    try {
      await api.createCategory(activeRestaurant.id, {
        menuId: menu.id,
        translations: [{ languageCode: menuLanguage, name: newCategoryName.trim() }],
      });
      push("Category created", "success");
      setCategoryModal(false);
      setNewCategoryName("");
      await loadMenu();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Failed", "error");
    }
  }

  async function saveProduct(form: {
    name: string;
    description: string;
    price: string;
    compareAtPrice: string;
    isAvailable: boolean;
    isFeatured: boolean;
  }) {
    if (!activeRestaurant || !activeCategory) return;
    try {
      if (editing) {
        await api.patchProduct(activeRestaurant.id, editing.id, {
          price: form.price,
          compareAtPrice: form.compareAtPrice || null,
          isAvailable: form.isAvailable,
          isFeatured: form.isFeatured,
          translations: [
            {
              languageCode: menuLanguage,
              name: form.name,
              description: form.description,
            },
          ],
        });
        push("Product updated", "success");
      } else {
        await api.createProduct(activeRestaurant.id, {
          categoryId: activeCategory,
          price: form.price,
          compareAtPrice: form.compareAtPrice || undefined,
          isAvailable: form.isAvailable,
          translations: [
            {
              languageCode: menuLanguage,
              name: form.name,
              description: form.description,
            },
          ],
        });
        push("Product created", "success");
      }
      setModalOpen(false);
      setEditing(null);
      await loadMenu();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Save failed", "error");
    }
  }

  async function deleteProduct(productId: string) {
    if (!activeRestaurant) return;
    if (!confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(activeRestaurant.id, productId);
      push("Product deleted", "success");
      await loadMenu();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Delete failed", "error");
    }
  }

  async function handleExcelImport(file: File) {
    if (!activeRestaurant) return;
    setImporting(true);
    try {
      const { assetId } = await api.uploadFile(
        activeRestaurant.id,
        file,
        "import",
      );
      if (!assetId) throw new Error("Upload registration failed");
      const result = await api.createImport(activeRestaurant.id, assetId, "excel");
      setImportJobId((result.job as { id: string }).id);
      setImportPreview(
        (result.preview as Array<{ category: string; name: string; price: string; description?: string }>) ?? [],
      );
      push("Preview ready — confirm to import", "success");
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Import failed", "error");
    } finally {
      setImporting(false);
    }
  }

  async function confirmImport() {
    if (!activeRestaurant || !importJobId) return;
    setImporting(true);
    try {
      await api.confirmImport(activeRestaurant.id, importJobId);
      push("Menu imported", "success");
      setImportPreview(null);
      setImportJobId(null);
      await loadMenu();
    } catch (e) {
      push(e instanceof ApiError ? e.message : "Confirm failed", "error");
    } finally {
      setImporting(false);
    }
  }

  if (ctxLoading || loading) return <p className="text-muted">Loading menu…</p>;
  if (!activeRestaurant) {
    return (
      <EmptyState
        title="No restaurant"
        description="Create a restaurant first."
        actionLabel="Create restaurant"
        onAction={() => router.push("/onboarding")}
      />
    );
  }

  const categoryProducts =
    categories.find((c) => c.id === activeCategory)?.products ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="display-font text-3xl font-semibold tracking-tight">
            Menu editor
          </h1>
          <p className="mt-2 text-muted">
            Categories and products persist to your database.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          disabled={!activeCategory}
        >
          <Plus className="size-4" /> Add product
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Excel import</h2>
            <p className="text-sm text-muted">
              Upload .xlsx with columns: category, name, price, description
            </p>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            disabled={importing}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleExcelImport(f);
            }}
          />
        </div>
        {importPreview && importPreview.length > 0 ? (
          <div className="mt-4">
            <p className="text-sm font-medium">{importPreview.length} rows detected</p>
            <ul className="mt-2 max-h-40 overflow-y-auto text-sm text-muted">
              {importPreview.slice(0, 8).map((row, i) => (
                <li key={i}>
                  {row.category} · {row.name} · {row.price}
                </li>
              ))}
            </ul>
            <Button className="mt-3" disabled={importing} onClick={() => void confirmImport()}>
              Confirm import
            </Button>
          </div>
        ) : null}
      </Card>

      <Card padding="sm">
        <div className="flex flex-wrap items-center justify-between gap-4 p-2">
          <SegmentedTabs
            items={categories.map((c) => ({
              id: c.id,
              label: c.translations[0]?.name ?? "Category",
            }))}
            value={activeCategory}
            onChange={setActiveCategory}
          />
          <Button variant="secondary" size="sm" onClick={() => setCategoryModal(true)}>
            <Plus className="size-4" /> Category
          </Button>
        </div>
      </Card>

      {categoryProducts.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first dish to this category."
          actionLabel="Add product"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {categoryProducts.map((product) => {
            const t = product.translations[0];
            return (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-[24px] border border-line bg-surface p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{t?.name ?? "Product"}</h3>
                    {!product.isAvailable ? (
                      <Badge variant="warning">Sold Out</Badge>
                    ) : null}
                    {product.isFeatured ? (
                      <Badge variant="brand">Featured</Badge>
                    ) : null}
                  </div>
                  {t?.description ? (
                    <p className="mt-1 line-clamp-1 text-sm text-muted">
                      {t.description}
                    </p>
                  ) : null}
                  <p className="mt-2 font-bold text-ink">
                    {formatPrice(Number(product.price))}
                    {product.compareAtPrice ? (
                      <span className="ml-2 text-sm font-normal text-muted line-through">
                        {formatPrice(Number(product.compareAtPrice))}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditing(product);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="size-4" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProductModal
        key={editing?.id ?? "new"}
        open={modalOpen}
        product={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={saveProduct}
      />

      <Modal
        open={categoryModal}
        onClose={() => setCategoryModal(false)}
        title="New category"
      >
        <Label>Name</Label>
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="mt-2"
        />
        <Button className="mt-4 w-full" onClick={createCategory}>
          Create category
        </Button>
      </Modal>
    </div>
  );
}

function ProductModal({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (form: {
    name: string;
    description: string;
    price: string;
    compareAtPrice: string;
    isAvailable: boolean;
    isFeatured: boolean;
  }) => void;
}) {
  const t = product?.translations[0];
  const [name, setName] = useState(t?.name ?? "");
  const [description, setDescription] = useState(t?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "0");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compareAtPrice ?? "",
  );
  const [isAvailable, setIsAvailable] = useState(product?.isAvailable ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? "Edit product" : "New product"}
      className="sm:max-w-lg"
    >
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Price</Label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <Label>Compare at</Label>
            <Input
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured
        </label>
        <Button
          className="w-full"
          onClick={() =>
            onSave({
              name,
              description,
              price,
              compareAtPrice,
              isAvailable,
              isFeatured,
            })
          }
        >
          Save product
        </Button>
      </div>
    </Modal>
  );
}
