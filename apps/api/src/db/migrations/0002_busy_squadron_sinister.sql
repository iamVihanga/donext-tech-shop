CREATE TYPE "public"."component_type" AS ENUM('processor', 'motherboard', 'memory', 'graphic_card', 'ssd_nvme', 'hard_disk', 'power_supply', 'cooler', 'pc_case', 'fan', 'monitor', 'software', 'keyboard', 'mouse', 'mouse_pad', 'headset', 'speaker', 'ups', 'table', 'chair', 'thermal_paste', 'cable');--> statement-breakpoint
CREATE TYPE "public"."cooler_type" AS ENUM('air', 'aio_liquid', 'custom_liquid');--> statement-breakpoint
CREATE TYPE "public"."form_factor" AS ENUM('atx', 'micro_atx', 'mini_itx', 'e_atx', 'other');--> statement-breakpoint
CREATE TYPE "public"."memory_type" AS ENUM('ddr5', 'ddr4', 'ddr3', 'other');--> statement-breakpoint
CREATE TYPE "public"."socket_type" AS ENUM('lga1700', 'lga1200', 'lga1151', 'am5', 'am4', 'strx4', 'other');--> statement-breakpoint
CREATE TABLE "compatibility_rules" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"rule_type" varchar(50) NOT NULL,
	"primary_component" "component_type" NOT NULL,
	"secondary_component" "component_type",
	"rule_definition" json NOT NULL,
	"severity" varchar(20) DEFAULT 'error' NOT NULL,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pc_builds" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"name" varchar(255) DEFAULT 'My PC Build' NOT NULL,
	"description" text,
	"processor_id" text,
	"motherboard_id" text,
	"memory_id" text,
	"memory_quantity" integer DEFAULT 1,
	"graphic_card_id" text,
	"ssd_nvme_id" text,
	"hard_disk_id" text,
	"power_supply_id" text,
	"cooler_id" text,
	"pc_case_id" text,
	"fan_ids" text[] DEFAULT '{}',
	"extra_ssd_nvme_ids" text[] DEFAULT '{}',
	"extra_hard_disk_ids" text[] DEFAULT '{}',
	"monitor_ids" text[] DEFAULT '{}',
	"software_ids" text[] DEFAULT '{}',
	"keyboard_id" text,
	"mouse_id" text,
	"mouse_pad_id" text,
	"headset_id" text,
	"speaker_id" text,
	"ups_id" text,
	"table_id" text,
	"chair_id" text,
	"thermal_paste_id" text,
	"cable_ids" text[] DEFAULT '{}',
	"total_price" numeric(12, 2),
	"estimated_wattage" integer,
	"is_public" boolean DEFAULT false,
	"is_template" boolean DEFAULT false,
	"is_purchased" boolean DEFAULT false,
	"compatibility_issues" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_component_specs" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"component_type" "component_type" NOT NULL,
	"socket_type" "socket_type",
	"cores" integer,
	"threads" integer,
	"base_clock" numeric(4, 2),
	"boost_clock" numeric(4, 2),
	"tdp" integer,
	"integrated_graphics" boolean DEFAULT false,
	"chipset" varchar(100),
	"form_factor" "form_factor",
	"memory_type" "memory_type",
	"max_memory" integer,
	"memory_slots" integer,
	"pci_slots" integer,
	"m2_slots" integer,
	"sata_slots" integer,
	"memory_capacity" integer,
	"memory_speed" integer,
	"memory_latency" varchar(50),
	"gpu_chipset" varchar(100),
	"vram" integer,
	"power_connectors" varchar(100),
	"recommended_psu" integer,
	"slot_width" numeric(3, 1),
	"length" integer,
	"storage_capacity" integer,
	"storage_interface" varchar(50),
	"form_factor_storage" varchar(50),
	"read_speed" integer,
	"write_speed" integer,
	"wattage" integer,
	"efficiency" varchar(50),
	"modular" varchar(50),
	"cooler_type" "cooler_type",
	"compatible_sockets" text[],
	"max_tdp" integer,
	"radiator_size" integer,
	"height" integer,
	"max_gpu_length" integer,
	"max_cooler_height" integer,
	"max_psu_length" integer,
	"front_fans" varchar(50),
	"top_fans" varchar(50),
	"rear_fans" varchar(50),
	"radiator_support" varchar(100),
	"drive_bays_25" integer,
	"drive_bays_35" integer,
	"fan_size" integer,
	"fan_rpm" varchar(50),
	"noise_level" numeric(4, 1),
	"additional_specs" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "product_component_specs_product_id_unique" UNIQUE("product_id")
);
--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_processor_id_products_id_fk" FOREIGN KEY ("processor_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_motherboard_id_products_id_fk" FOREIGN KEY ("motherboard_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_memory_id_products_id_fk" FOREIGN KEY ("memory_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_graphic_card_id_products_id_fk" FOREIGN KEY ("graphic_card_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_ssd_nvme_id_products_id_fk" FOREIGN KEY ("ssd_nvme_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_hard_disk_id_products_id_fk" FOREIGN KEY ("hard_disk_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_power_supply_id_products_id_fk" FOREIGN KEY ("power_supply_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_cooler_id_products_id_fk" FOREIGN KEY ("cooler_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_pc_case_id_products_id_fk" FOREIGN KEY ("pc_case_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_keyboard_id_products_id_fk" FOREIGN KEY ("keyboard_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_mouse_id_products_id_fk" FOREIGN KEY ("mouse_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_mouse_pad_id_products_id_fk" FOREIGN KEY ("mouse_pad_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_headset_id_products_id_fk" FOREIGN KEY ("headset_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_speaker_id_products_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_ups_id_products_id_fk" FOREIGN KEY ("ups_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_table_id_products_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_chair_id_products_id_fk" FOREIGN KEY ("chair_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_builds" ADD CONSTRAINT "pc_builds_thermal_paste_id_products_id_fk" FOREIGN KEY ("thermal_paste_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_component_specs" ADD CONSTRAINT "product_component_specs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "compatibility_rules_type_idx" ON "compatibility_rules" USING btree ("rule_type");--> statement-breakpoint
CREATE INDEX "compatibility_rules_primary_idx" ON "compatibility_rules" USING btree ("primary_component");--> statement-breakpoint
CREATE INDEX "compatibility_rules_active_idx" ON "compatibility_rules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "pc_builds_user_idx" ON "pc_builds" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pc_builds_public_idx" ON "pc_builds" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "pc_builds_template_idx" ON "pc_builds" USING btree ("is_template");--> statement-breakpoint
CREATE INDEX "product_component_specs_product_idx" ON "product_component_specs" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_component_specs_type_idx" ON "product_component_specs" USING btree ("component_type");--> statement-breakpoint
CREATE INDEX "product_component_specs_socket_idx" ON "product_component_specs" USING btree ("socket_type");--> statement-breakpoint
CREATE INDEX "product_component_specs_memory_type_idx" ON "product_component_specs" USING btree ("memory_type");--> statement-breakpoint
CREATE INDEX "product_component_specs_form_factor_idx" ON "product_component_specs" USING btree ("form_factor");