import "server-only";
import { and, arrayContains, asc, count, desc, eq, gt, gte, ilike, lte, max, min, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import { categories, parts } from "@/db/schema";
import { type CarModelSlug, isCarModel } from "./models";

export const PAGE_SIZE = 24;

export type PartFilters = {
  model?: CarModelSlug;
  categoryId?: number;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  page: number;
};

export type CategoryNode = {
  id: number;
  name: string;
  sortOrder: number;
  count: number;
  children: Omit<CategoryNode, "children">[];
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function positiveInt(value: string | undefined): number | undefined {
  if (!value || !/^\d{1,9}$/.test(value)) return undefined;
  return Number(value) || undefined;
}

function priceValue(value: string | undefined): string | undefined {
  const normalized = value?.trim().replace(",", ".");
  return normalized && /^\d{1,8}(\.\d{1,2})?$/.test(normalized) ? normalized : undefined;
}

export function parseFilters(params: RawSearchParams): PartFilters {
  const first = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const model = first("model");
  let minPrice = priceValue(first("minPrice"));
  let maxPrice = priceValue(first("maxPrice"));
  // შემთხვევით შებრუნებული დიაპაზონი ცარიელ შედეგს არ უნდა იძლეოდეს.
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) [minPrice, maxPrice] = [maxPrice, minPrice];
  return {
    model: isCarModel(model) ? model : undefined,
    categoryId: positiveInt(first("category")),
    q: first("q")?.trim().slice(0, 100) || undefined,
    minPrice,
    maxPrice,
    page: positiveInt(first("page")) ?? 1,
  };
}

const parentCategory = alias(categories, "parent_category");

// საიტზე ჩანს მხოლოდ გამოქვეყნებული ნაწილი, რომლის მარაგიც 0-ზე მეტია.
const visibleOnSite = () => and(eq(parts.isPublished, true), gt(parts.stock, 0));

// მომხმარებლის %, _ და \ ჩვეულებრივ სიმბოლოებად ეძებება.
function containsPattern(q: string): string {
  return `%${q.replace(/[\\%_]/g, "\\$&")}%`;
}

export async function querySuggestions(q: string, model: CarModelSlug | undefined) {
  const pattern = containsPattern(q);
  return getDb()
    .select({
      id: parts.id,
      name: parts.name,
      oemCode: parts.oemCode,
      imageUrl: parts.imageUrl,
      models: parts.models,
    })
    .from(parts)
    .where(
      and(
        visibleOnSite(),
        model ? arrayContains(parts.models, [model]) : undefined,
        or(ilike(parts.name, pattern), ilike(parts.oemCode, pattern)),
      ),
    )
    .orderBy(asc(parts.name))
    .limit(6);
}

export async function queryParts(filters: PartFilters, options: { onlyVisible: boolean }) {
  const db = getDb();
  const pattern = filters.q ? containsPattern(filters.q) : undefined;
  const where = and(
    options.onlyVisible ? visibleOnSite() : undefined,
    filters.model ? arrayContains(parts.models, [filters.model]) : undefined,
    // კატეგორიის არჩევისას მისი ქვეკატეგორიების ნაწილებიც ჩანს.
    filters.categoryId
      ? or(eq(categories.id, filters.categoryId), eq(categories.parentId, filters.categoryId))
      : undefined,
    pattern ? or(ilike(parts.name, pattern), ilike(parts.oemCode, pattern)) : undefined,
    // ფასის გარეშე ნაწილები ფასის ფილტრში არ ხვდება.
    filters.minPrice ? gte(parts.price, filters.minPrice) : undefined,
    filters.maxPrice ? lte(parts.price, filters.maxPrice) : undefined,
  );

  const [rows, totals] = await Promise.all([
    db
      .select({
        id: parts.id,
        name: parts.name,
        oemCode: parts.oemCode,
        description: parts.description,
        price: parts.price,
        imageUrl: parts.imageUrl,
        models: parts.models,
        isPublished: parts.isPublished,
        stock: parts.stock,
        categoryName: categories.name,
        parentCategoryName: parentCategory.name,
      })
      .from(parts)
      .innerJoin(categories, eq(parts.categoryId, categories.id))
      .leftJoin(parentCategory, eq(categories.parentId, parentCategory.id))
      .where(where)
      .orderBy(desc(parts.createdAt), desc(parts.id))
      .limit(PAGE_SIZE)
      .offset((filters.page - 1) * PAGE_SIZE),
    db
      .select({ total: count() })
      .from(parts)
      .innerJoin(categories, eq(parts.categoryId, categories.id))
      .where(where),
  ]);

  return { rows, total: totals[0]?.total ?? 0 };
}

export type PartRow = Awaited<ReturnType<typeof queryParts>>["rows"][number];

export async function queryPublishedPart(id: number) {
  const [part] = await getDb()
    .select({
      id: parts.id,
      name: parts.name,
      oemCode: parts.oemCode,
      description: parts.description,
      price: parts.price,
      imageUrl: parts.imageUrl,
      models: parts.models,
      categoryId: categories.id,
      categoryName: categories.name,
      parentCategoryId: parentCategory.id,
      parentCategoryName: parentCategory.name,
    })
    .from(parts)
    .innerJoin(categories, eq(parts.categoryId, categories.id))
    .leftJoin(parentCategory, eq(categories.parentId, parentCategory.id))
    .where(and(eq(parts.id, id), visibleOnSite()));
  return part ?? null;
}

export async function queryPriceRange(model: CarModelSlug | undefined) {
  const [range] = await getDb()
    .select({ min: min(parts.price), max: max(parts.price) })
    .from(parts)
    .where(and(visibleOnSite(), model ? arrayContains(parts.models, [model]) : undefined));
  return range;
}

export async function queryCategoryTree(options: {
  onlyVisible: boolean;
  model?: CarModelSlug;
}): Promise<CategoryNode[]> {
  const db = getDb();
  const [allCategories, counts] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
    db
      .select({ categoryId: parts.categoryId, count: count() })
      .from(parts)
      .where(
        and(
          options.onlyVisible ? visibleOnSite() : undefined,
          options.model ? arrayContains(parts.models, [options.model]) : undefined,
        ),
      )
      .groupBy(parts.categoryId),
  ]);

  const countOf = new Map(counts.map((c) => [c.categoryId, c.count]));
  return allCategories
    .filter((c) => c.parentId === null)
    .map((top) => {
      const children = allCategories
        .filter((c) => c.parentId === top.id)
        .map((c) => ({ id: c.id, name: c.name, sortOrder: c.sortOrder, count: countOf.get(c.id) ?? 0 }));
      return {
        id: top.id,
        name: top.name,
        sortOrder: top.sortOrder,
        count: (countOf.get(top.id) ?? 0) + children.reduce((sum, c) => sum + c.count, 0),
        children,
      };
    });
}
