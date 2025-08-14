CREATE TABLE "quotation_items" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quotation_id" text NOT NULL,
	"product_id" text NOT NULL,
	"variant_id" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"product_sku" varchar(100),
	"variant_name" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);

--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quotation_number" varchar(50) NOT NULL,
	"user_id" text,
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50),
	"customer_company" varchar(255),
	"title" varchar(255) NOT NULL,
	"description" text,
	"subtotal" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"total_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"valid_until" text,
	"notes" text,
	"terms" text,
	"customer_address" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "quotations_quotation_number_unique" UNIQUE("quotation_number")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_phone" text,
	"secondary_phone" text,
	"email" text,
	"business_address" text,
	"socials" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quotation_items_quotation_idx" ON "quotation_items" USING btree ("quotation_id");--> statement-breakpoint
CREATE INDEX "quotation_items_product_idx" ON "quotation_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "quotation_items_variant_idx" ON "quotation_items" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "quotations_number_idx" ON "quotations" USING btree ("quotation_number");--> statement-breakpoint
CREATE INDEX "quotations_user_idx" ON "quotations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quotations_email_idx" ON "quotations" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "quotations_status_idx" ON "quotations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "quotations_valid_until_idx" ON "quotations" USING btree ("valid_until");--> statement-breakpoint
CREATE INDEX "quotations_created_at_idx" ON "quotations" USING btree ("created_at");
