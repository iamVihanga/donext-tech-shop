CREATE TABLE "brands" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"image_url" varchar(500),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "brands_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "brand_id" text;--> statement-breakpoint
CREATE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "brands_name_idx" ON "brands" USING btree ("name");--> statement-breakpoint
CREATE INDEX "brands_active_idx" ON "brands" USING btree ("is_active");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");