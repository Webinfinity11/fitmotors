"use server";

import { del } from "@vercel/blob";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { categories, parts } from "@/db/schema";
import type { ActionState } from "@/lib/action-state";
import { requireAdmin } from "@/lib/auth";
import { CATALOG_TAG } from "@/lib/catalog";
import { type CarModelSlug, isCarModel } from "@/lib/models";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isCorrectLogin,
} from "@/lib/session-token";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

function intField(form: FormData, key: string): number | null {
  const value = text(form, key);
  return /^\d{1,9}$/.test(value) ? Number(value) : null;
}

// Drizzle Postgres-ის შეცდომას cause-ში ახვევს.
function pgErrorCode(error: unknown): string | undefined {
  const e = error as { code?: string; cause?: { code?: string } };
  return e?.code ?? e?.cause?.code;
}

function refreshCatalog() {
  updateTag(CATALOG_TAG);
  revalidatePath("/admin", "layout");
}

async function deleteImage(url: string | null | undefined) {
  if (!url) return;
  try {
    await del(url);
  } catch (error) {
    console.error("Failed to delete part image", error);
  }
}

/* ---------- შესვლა ---------- */

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  if (!isCorrectLogin(text(form, "username"), String(form.get("password") ?? ""))) {
    return { error: "მომხმარებელი ან პაროლი არასწორია." };
  }
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin/parts");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------- კატეგორიები ---------- */

export async function createCategory(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const name = text(form, "name");
  const parentId = intField(form, "parentId");
  if (!name || name.length > 120) return { error: "მიუთითეთ დასახელება (მაქსიმუმ 120 სიმბოლო)." };

  const db = getDb();
  if (parentId !== null) {
    // მხოლოდ ორი დონეა: ქვეკატეგორიის მშობელი უნდა იყოს ზედა დონის კატეგორია.
    const [parent] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.id, parentId), isNull(categories.parentId)));
    if (!parent) return { error: "მშობელი კატეგორია ვერ მოიძებნა." };
  }

  try {
    await db.insert(categories).values({ name, parentId, sortOrder: intField(form, "sortOrder") ?? 0 });
  } catch (error) {
    if (pgErrorCode(error) === "23505") return { error: `„${name}“ ამ დონეზე უკვე არსებობს.` };
    throw error;
  }
  refreshCatalog();
  return { ok: true };
}

export async function updateCategory(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = intField(form, "id");
  const name = text(form, "name");
  if (id === null) return { error: "კატეგორია ვერ მოიძებნა." };
  if (!name || name.length > 120) return { error: "მიუთითეთ დასახელება (მაქსიმუმ 120 სიმბოლო)." };

  try {
    await getDb()
      .update(categories)
      .set({ name, sortOrder: intField(form, "sortOrder") ?? 0 })
      .where(eq(categories.id, id));
  } catch (error) {
    if (pgErrorCode(error) === "23505") return { error: `„${name}“ ამ დონეზე უკვე არსებობს.` };
    throw error;
  }
  refreshCatalog();
  return { ok: true };
}

export async function deleteCategory(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = intField(form, "id");
  if (id === null) return { error: "კატეგორია ვერ მოიძებნა." };

  try {
    await getDb().delete(categories).where(eq(categories.id, id));
  } catch (error) {
    // ON DELETE RESTRICT: 23001 restrict_violation, ძველ Postgres-ზე 23503 foreign_key_violation.
    const code = pgErrorCode(error);
    if (code === "23001" || code === "23503") {
      return { error: "ვერ წაიშლება: მას აქვს ქვეკატეგორიები ან მიბმული ნაწილები." };
    }
    throw error;
  }
  refreshCatalog();
  return { ok: true };
}

/* ---------- ნაწილები ---------- */

const STOCK_ERROR = "მარაგი უნდა იყოს მთელი რიცხვი 0-დან 999999-მდე.";

function stockField(form: FormData): number | null {
  const value = text(form, "stock");
  return /^\d{1,6}$/.test(value) ? Number(value) : null;
}

function isBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function savePart(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const db = getDb();

  const id = intField(form, "id");
  const name = text(form, "name");
  const oemCode = text(form, "oemCode");
  const description = text(form, "description");
  const priceInput = text(form, "price").replace(",", ".");
  const imageUrl = text(form, "imageUrl");
  const categoryId = intField(form, "categoryId");
  const subcategoryId = intField(form, "subcategoryId");
  const models = [...new Set(form.getAll("models"))].filter(isCarModel) as CarModelSlug[];
  const stock = stockField(form);

  if (!name || name.length > 200) return { error: "მიუთითეთ ნაწილის დასახელება (მაქსიმუმ 200 სიმბოლო)." };
  if (oemCode.length > 80) return { error: "კოდი ძალიან გრძელია (მაქსიმუმ 80 სიმბოლო)." };
  if (description.length > 5000) return { error: "აღწერა ძალიან გრძელია (მაქსიმუმ 5000 სიმბოლო)." };
  if (priceInput && !/^\d{1,8}(\.\d{1,2})?$/.test(priceInput)) return { error: "ფასი არასწორია. მაგალითი: 120 ან 120.50" };
  if (imageUrl && !isBlobUrl(imageUrl)) return { error: "ფოტოს ბმული არასწორია. ატვირთეთ ფოტო თავიდან." };
  if (stock === null) return { error: STOCK_ERROR };
  if (models.length === 0) return { error: "აირჩიეთ მინიმუმ ერთი მოდელი." };
  if (categoryId === null) return { error: "აირჩიეთ კატეგორია." };

  const targetId = subcategoryId ?? categoryId;
  const [target] = await db
    .select({ id: categories.id, parentId: categories.parentId })
    .from(categories)
    .where(eq(categories.id, targetId));
  const validTarget = subcategoryId === null ? target?.parentId === null : target?.parentId === categoryId;
  if (!target || !validTarget) return { error: "არჩეული კატეგორია ან ქვეკატეგორია ვერ მოიძებნა." };

  const values = {
    name,
    oemCode: oemCode || null,
    description: description || null,
    price: priceInput || null,
    imageUrl: imageUrl || null,
    categoryId: targetId,
    models,
    stock,
    isPublished: form.get("isPublished") === "on",
  };

  if (id === null) {
    await db.insert(parts).values(values);
  } else {
    const [existing] = await db.select({ imageUrl: parts.imageUrl }).from(parts).where(eq(parts.id, id));
    if (!existing) return { error: "ნაწილი ვერ მოიძებნა. შესაძლოა უკვე წაშლილია." };
    await db.update(parts).set({ ...values, updatedAt: new Date() }).where(eq(parts.id, id));
    if (existing.imageUrl !== values.imageUrl) await deleteImage(existing.imageUrl);
  }

  refreshCatalog();
  redirect("/admin/parts");
}

export async function deletePart(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = intField(form, "id");
  if (id === null) return { error: "ნაწილი ვერ მოიძებნა." };

  const [removed] = await getDb().delete(parts).where(eq(parts.id, id)).returning({ imageUrl: parts.imageUrl });
  await deleteImage(removed?.imageUrl);
  refreshCatalog();
  return { ok: true };
}

export async function setPartPublished(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = intField(form, "id");
  if (id === null) return { error: "ნაწილი ვერ მოიძებნა." };

  await getDb()
    .update(parts)
    .set({ isPublished: form.get("publish") === "1", updatedAt: new Date() })
    .where(eq(parts.id, id));
  refreshCatalog();
  return { ok: true };
}

export async function setPartStock(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = intField(form, "id");
  if (id === null) return { error: "ნაწილი ვერ მოიძებნა." };
  const stock = stockField(form);
  if (stock === null) return { error: STOCK_ERROR };

  await getDb().update(parts).set({ stock, updatedAt: new Date() }).where(eq(parts.id, id));
  refreshCatalog();
  return { ok: true };
}
