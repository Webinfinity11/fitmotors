import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const carModel = pgEnum("car_model", ["fit", "hrv", "vezel"]);

// parent_id = NULL კატეგორიაა, შევსებული parent_id კი ქვეკატეგორია.
export const categories = pgTable(
  "categories",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    parentId: integer("parent_id").references((): AnyPgColumn => categories.id, { onDelete: "restrict" }),
    name: text().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("categories_parent_idx").on(t.parentId),
    uniqueIndex("categories_parent_name_uq").on(sql`coalesce(${t.parentId}, 0)`, sql`lower(${t.name})`),
  ],
);

// category_id მიუთითებს ყველაზე ზუსტ დონეზე: ქვეკატეგორიაზე, თუ არჩეულია, თორემ კატეგორიაზე.
export const parts = pgTable(
  "parts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    oemCode: text("oem_code"),
    description: text(),
    price: numeric({ precision: 10, scale: 2 }),
    imageUrl: text("image_url"),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    models: carModel().array().notNull(),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("parts_category_idx").on(t.categoryId),
    index("parts_models_idx").using("gin", t.models),
    index("parts_created_idx").on(t.createdAt.desc()),
    check("parts_models_not_empty", sql`cardinality(${t.models}) > 0`),
    check("parts_price_not_negative", sql`${t.price} >= 0`),
  ],
);
