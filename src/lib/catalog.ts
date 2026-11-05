import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { CarModelSlug } from "./models";
import {
  type PartFilters,
  queryCategoryTree,
  queryParts,
  queryPriceRange,
  queryPublishedPart,
  querySuggestions,
} from "./parts-query";

// საჯარო კატალოგი ქეშირდება, რომ Neon ყოველ ვიზიტზე არ გაიღვიძოს.
// ადმინში ცვლილებისას actions.ts ამ ტეგს ანახლებს.
export const CATALOG_TAG = "catalog";
const CATALOG_LIFE = { stale: 60, revalidate: 300, expire: 3600 };

export async function getCatalogParts(filters: PartFilters) {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife(CATALOG_LIFE);
  return queryParts(filters, { onlyPublished: true });
}

export async function getCatalogPart(id: number) {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife(CATALOG_LIFE);
  return queryPublishedPart(id);
}

export async function getCatalogPriceRange(model: CarModelSlug | undefined) {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife(CATALOG_LIFE);
  return queryPriceRange(model);
}

export async function getPartSuggestions(q: string, model: CarModelSlug | undefined) {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife(CATALOG_LIFE);
  return querySuggestions(q, model);
}

export async function getCatalogCategories(model: CarModelSlug | undefined) {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife(CATALOG_LIFE);
  return queryCategoryTree({ onlyPublished: true, model });
}
