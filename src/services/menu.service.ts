import { eq, and, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { insertReturning, updateReturning } from "@/db/write-helpers";
import {
  menus,
  branches,
  categories,
  products,
  productTranslations,
  categoryTranslations,
} from "@/db/schema";
import { assertTenantScope } from "@/lib/tenant/context";
import { generateUniqueSlug, slugify } from "@/lib/utils/slug";
import { writeAuditLog } from "@/lib/audit/log";
import type { z } from "zod";
import type {
  createMenuSchema,
  createCategorySchema,
  createProductSchema,
} from "@/lib/validation/schemas";

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;

export async function createMenu(
  restaurantId: string,
  userId: string,
  input: CreateMenuInput,
) {
  const db = getDb();
  if (input.branchId) {
    const [branch] = await db
      .select({ id: branches.id })
      .from(branches)
      .where(
        and(
          eq(branches.id, input.branchId),
          eq(branches.restaurantId, restaurantId),
        ),
      )
      .limit(1);
    if (!branch) throw new Error("Branch not found");
  }

  const slug =
    input.slug ?? slugify(input.name) ?? (await generateUniqueSlug(input.name));

  const menu = await insertReturning(menus, {
    restaurantId,
    branchId: input.branchId,
    name: input.name,
    slug,
    isDefault: input.isDefault ?? false,
  });

  await writeAuditLog({
    restaurantId,
    userId,
    action: "menu.created",
    entityType: "menu",
    entityId: menu.id,
  });

  return menu;
}

export async function listMenus(restaurantId: string) {
  const db = getDb();
  return db
    .select()
    .from(menus)
    .where(eq(menus.restaurantId, restaurantId))
    .orderBy(asc(menus.sortOrder));
}

export async function createCategory(
  restaurantId: string,
  userId: string,
  input: CreateCategoryInput,
) {
  const db = getDb();

  const [menu] = await db
    .select()
    .from(menus)
    .where(and(eq(menus.id, input.menuId), eq(menus.restaurantId, restaurantId)))
    .limit(1);

  if (!menu) throw new Error("Menu not found");

  const baseName = input.translations[0]?.name ?? "category";
  const slug = input.slug ?? slugify(baseName) ?? "category";

  const category = await insertReturning(
    categories,
    {
      menuId: input.menuId,
      restaurantId,
      slug,
      sortOrder: input.sortOrder ?? 0,
    },
  );

  await db.insert(categoryTranslations).values(
    input.translations.map((t) => ({
      categoryId: category.id,
      restaurantId,
      languageCode: t.languageCode,
      name: t.name,
      description: t.description,
    })),
  );

  await writeAuditLog({
    restaurantId,
    userId,
    action: "category.created",
    entityType: "category",
    entityId: category.id,
  });

  return category;
}

export async function createProduct(
  restaurantId: string,
  userId: string,
  input: CreateProductInput,
) {
  const db = getDb();

  const [category] = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.id, input.categoryId),
        eq(categories.restaurantId, restaurantId),
      ),
    )
    .limit(1);

  if (!category) throw new Error("Category not found");

  const product = await insertReturning(
    products,
    {
      categoryId: input.categoryId,
      restaurantId,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      currency: input.currency ?? "AMD",
      isAvailable: input.isAvailable ?? true,
      tags: input.tags ?? [],
      allergens: input.allergens ?? [],
      sortOrder: input.sortOrder ?? 0,
    },
  );

  await db.insert(productTranslations).values(
    input.translations.map((t) => ({
      productId: product.id,
      restaurantId,
      languageCode: t.languageCode,
      name: t.name,
      description: t.description,
    })),
  );

  await writeAuditLog({
    restaurantId,
    userId,
    action: "product.created",
    entityType: "product",
    entityId: product.id,
  });

  return product;
}

export async function getMenuTree(restaurantId: string, menuId?: string) {
  const db = getDb();

  const menuList = menuId
    ? await db
        .select()
        .from(menus)
        .where(and(eq(menus.restaurantId, restaurantId), eq(menus.id, menuId)))
    : await db
        .select()
        .from(menus)
        .where(eq(menus.restaurantId, restaurantId))
        .orderBy(asc(menus.sortOrder));

  const result = [];

  for (const menu of menuList) {
    const cats = await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.menuId, menu.id), eq(categories.restaurantId, restaurantId)),
      )
      .orderBy(asc(categories.sortOrder));

    const categoriesWithProducts = [];

    for (const cat of cats) {
      const catTranslations = await db
        .select()
        .from(categoryTranslations)
        .where(eq(categoryTranslations.categoryId, cat.id));

      const prods = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.categoryId, cat.id),
            eq(products.restaurantId, restaurantId),
          ),
        )
        .orderBy(asc(products.sortOrder));

      const productsWithTranslations = [];

      for (const prod of prods) {
        const translations = await db
          .select()
          .from(productTranslations)
          .where(eq(productTranslations.productId, prod.id));
        productsWithTranslations.push({ ...prod, translations });
      }

      categoriesWithProducts.push({
        ...cat,
        translations: catTranslations,
        products: productsWithTranslations,
      });
    }

    result.push({ ...menu, categories: categoriesWithProducts });
  }

  return result;
}

export async function updateProduct(
  restaurantId: string,
  productId: string,
  data: Partial<{
    price: string;
    compareAtPrice: string | null;
    isAvailable: boolean;
    isFeatured: boolean;
    ingredients: string[];
    calories: number | null;
    tags: string[];
    allergens: string[];
    imageUrl: string | null;
    imageKey: string | null;
    sortOrder: number;
    translations: Array<{
      languageCode: string;
      name: string;
      description?: string;
    }>;
  }>,
) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!existing) throw new Error("Product not found");
  assertTenantScope(existing.restaurantId, restaurantId);

  const { translations, ...productFields } = data;

  const updated = await updateReturning(
    products,
    productId,
    { ...productFields, updatedAt: new Date() },
  );

  if (translations?.length) {
    for (const t of translations) {
      await db
        .insert(productTranslations)
        .values({
          productId,
          restaurantId,
          languageCode: t.languageCode,
          name: t.name,
          description: t.description,
        })
        .onDuplicateKeyUpdate({
          set: {
            name: t.name,
            description: t.description,
            updatedAt: new Date(),
          },
        });
    }
  }

  return updated;
}

export async function deleteProduct(restaurantId: string, productId: string) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!existing) throw new Error("Product not found");
  assertTenantScope(existing.restaurantId, restaurantId);

  await db.delete(products).where(eq(products.id, productId));
}
