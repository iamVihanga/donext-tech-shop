CREATE TABLE "subcategories" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"parent_category_id" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subcategories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_categories_id_fk";
--> statement-breakpoint
DROP INDEX "categories_parent_idx";--> statement-breakpoint
DROP INDEX "categories_path_idx";--> statement-breakpoint
DROP INDEX "categories_level_idx";--> statement-breakpoint
DROP INDEX "categories_sort_order_idx";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "subcategory_id" text;--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_parent_category_id_categories_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subcategories_slug_idx" ON "subcategories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "subcategories_parent_category_idx" ON "subcategories" USING btree ("parent_category_id");--> statement-breakpoint
CREATE INDEX "subcategories_name_idx" ON "subcategories" USING btree ("name");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_subcategory_idx" ON "products" USING btree ("subcategory_id");--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "parent_id";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "path";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "level";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "sort_order";