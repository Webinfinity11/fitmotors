CREATE TYPE "public"."car_model" AS ENUM('fit', 'hrv', 'vezel');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"parent_id" integer,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "parts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"oem_code" text,
	"description" text,
	"price" numeric(10, 2),
	"image_url" text,
	"category_id" integer NOT NULL,
	"models" "car_model"[] NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parts_models_not_empty" CHECK (cardinality("parts"."models") > 0),
	CONSTRAINT "parts_price_not_negative" CHECK ("parts"."price" >= 0)
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parts" ADD CONSTRAINT "parts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_parent_name_uq" ON "categories" USING btree (coalesce("parent_id", 0),lower("name"));--> statement-breakpoint
CREATE INDEX "parts_category_idx" ON "parts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "parts_models_idx" ON "parts" USING gin ("models");--> statement-breakpoint
CREATE INDEX "parts_created_idx" ON "parts" USING btree ("created_at" DESC NULLS LAST);