import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { products } from "./products.schema";

// Component types enum
export const componentTypeEnum = pgEnum("component_type", [
  "processor",
  "motherboard",
  "memory",
  "graphic_card",
  "ssd_nvme",
  "hard_disk",
  "power_supply",
  "cooler",
  "pc_case",
  "fan",
  // Accessories (no compatibility check)
  "monitor",
  "software",
  "keyboard",
  "mouse",
  "mouse_pad",
  "headset",
  "speaker",
  "ups",
  "table",
  "chair",
  "thermal_paste",
  "cable",
]);

// Socket types enum (for processors and motherboards)
export const socketTypeEnum = pgEnum("socket_type", [
  "lga1700", // Intel 12th, 13th, 14th gen
  "lga1200", // Intel 10th, 11th gen
  "lga1151", // Intel 6th-9th gen
  "am5", // AMD Ryzen 7000 series
  "am4", // AMD Ryzen 1000-5000 series
  "strx4", // AMD Threadripper
  "other",
]);

// Memory type enum
export const memoryTypeEnum = pgEnum("memory_type", [
  "ddr5",
  "ddr4",
  "ddr3",
  "other",
]);

// Form factor enum
export const formFactorEnum = pgEnum("form_factor", [
  "atx",
  "micro_atx",
  "mini_itx",
  "e_atx",
  "other",
]);

// Cooler type enum
export const coolerTypeEnum = pgEnum("cooler_type", [
  "air",
  "aio_liquid",
  "custom_liquid",
]);

// Product Component Specifications table
// This extends the products table with PC component-specific details
export const productComponentSpecs = pgTable(
  "product_component_specs",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    productId: text("product_id")
      .notNull()
      .unique()
      .references(() => products.id, { onDelete: "cascade" }),
    componentType: componentTypeEnum("component_type").notNull(),

    // Processor specs
    socketType: socketTypeEnum("socket_type"),
    cores: integer("cores"),
    threads: integer("threads"),
    baseClock: decimal("base_clock", { precision: 4, scale: 2 }), // GHz
    boostClock: decimal("boost_clock", { precision: 4, scale: 2 }), // GHz
    tdp: integer("tdp"), // Watts
    integratedGraphics: boolean("integrated_graphics").default(false),

    // Motherboard specs
    chipset: varchar("chipset", { length: 100 }),
    formFactor: formFactorEnum("form_factor"),
    memoryType: memoryTypeEnum("memory_type"),
    maxMemory: integer("max_memory"), // GB
    memorySlots: integer("memory_slots"),
    pciSlots: integer("pci_slots"),
    m2Slots: integer("m2_slots"),
    sataSlots: integer("sata_slots"),

    // Memory specs
    memoryCapacity: integer("memory_capacity"), // GB (per stick)
    memorySpeed: integer("memory_speed"), // MHz
    memoryLatency: varchar("memory_latency", { length: 50 }), // e.g., "CL16"

    // Graphics Card specs
    gpuChipset: varchar("gpu_chipset", { length: 100 }), // e.g., "RTX 4090", "RX 7900 XTX"
    vram: integer("vram"), // GB
    powerConnectors: varchar("power_connectors", { length: 100 }), // e.g., "2x 8-pin" or "1x 16-pin"
    recommendedPsu: integer("recommended_psu"), // Watts
    slotWidth: decimal("slot_width", { precision: 3, scale: 1 }), // How many slots it occupies
    length: integer("length"), // mm

    // Storage specs (SSD/HDD)
    storageCapacity: integer("storage_capacity"), // GB
    storageInterface: varchar("storage_interface", { length: 50 }), // e.g., "NVMe", "SATA", "M.2"
    formFactorStorage: varchar("form_factor_storage", { length: 50 }), // e.g., "M.2 2280", "2.5\"", "3.5\""
    readSpeed: integer("read_speed"), // MB/s
    writeSpeed: integer("write_speed"), // MB/s

    // Power Supply specs
    wattage: integer("wattage"), // Watts
    efficiency: varchar("efficiency", { length: 50 }), // e.g., "80+ Gold", "80+ Platinum"
    modular: varchar("modular", { length: 50 }), // "Fully Modular", "Semi-Modular", "Non-Modular"

    // Cooler specs
    coolerType: coolerTypeEnum("cooler_type"),
    compatibleSockets: text("compatible_sockets").array(), // Array of socket types
    maxTdp: integer("max_tdp"), // Max TDP it can handle
    radiatorSize: integer("radiator_size"), // mm (for AIO)
    height: integer("height"), // mm (for air coolers)

    // PC Case specs
    maxGpuLength: integer("max_gpu_length"), // mm
    maxCoolerHeight: integer("max_cooler_height"), // mm
    maxPsuLength: integer("max_psu_length"), // mm
    frontFans: varchar("front_fans", { length: 50 }), // e.g., "3x 120mm"
    topFans: varchar("top_fans", { length: 50 }),
    rearFans: varchar("rear_fans", { length: 50 }),
    radiatorSupport: varchar("radiator_support", { length: 100 }), // e.g., "Front: 360mm, Top: 240mm"
    driveBays25: integer("drive_bays_25"), // 2.5" bays
    driveBays35: integer("drive_bays_35"), // 3.5" bays

    // Fan specs
    fanSize: integer("fan_size"), // mm
    fanRpm: varchar("fan_rpm", { length: 50 }), // e.g., "500-1800 RPM"
    noiseLevel: decimal("noise_level", { precision: 4, scale: 1 }), // dBA

    // Additional specifications (JSON for flexibility)
    additionalSpecs: json("additional_specs").$type<Record<string, any>>(),

    ...timestamps,
  },
  (table) => [
    index("product_component_specs_product_idx").on(table.productId),
    index("product_component_specs_type_idx").on(table.componentType),
    index("product_component_specs_socket_idx").on(table.socketType),
    index("product_component_specs_memory_type_idx").on(table.memoryType),
    index("product_component_specs_form_factor_idx").on(table.formFactor),
  ]
);

// PC Build Configurations table
export const pcBuilds = pgTable(
  "pc_builds",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull().default("My PC Build"),
    description: text("description"),

    // Core components (compatibility-checked)
    processorId: text("processor_id").references(() => products.id, {
      onDelete: "set null",
    }),
    motherboardId: text("motherboard_id").references(() => products.id, {
      onDelete: "set null",
    }),
    memoryId: text("memory_id").references(() => products.id, {
      onDelete: "set null",
    }),
    memoryQuantity: integer("memory_quantity").default(1), // Number of memory sticks
    graphicCardId: text("graphic_card_id").references(() => products.id, {
      onDelete: "set null",
    }),
    ssdNvmeId: text("ssd_nvme_id").references(() => products.id, {
      onDelete: "set null",
    }),
    hardDiskId: text("hard_disk_id").references(() => products.id, {
      onDelete: "set null",
    }),
    powerSupplyId: text("power_supply_id").references(() => products.id, {
      onDelete: "set null",
    }),
    coolerId: text("cooler_id").references(() => products.id, {
      onDelete: "set null",
    }),
    pcCaseId: text("pc_case_id").references(() => products.id, {
      onDelete: "set null",
    }),

    // Additional components (arrays for multiple items)
    fanIds: text("fan_ids").array().default([]),
    extraSsdNvmeIds: text("extra_ssd_nvme_ids").array().default([]),
    extraHardDiskIds: text("extra_hard_disk_ids").array().default([]),

    // Accessories (no compatibility check needed)
    monitorIds: text("monitor_ids").array().default([]),
    softwareIds: text("software_ids").array().default([]),
    keyboardId: text("keyboard_id").references(() => products.id, {
      onDelete: "set null",
    }),
    mouseId: text("mouse_id").references(() => products.id, {
      onDelete: "set null",
    }),
    mousePadId: text("mouse_pad_id").references(() => products.id, {
      onDelete: "set null",
    }),
    headsetId: text("headset_id").references(() => products.id, {
      onDelete: "set null",
    }),
    speakerId: text("speaker_id").references(() => products.id, {
      onDelete: "set null",
    }),
    upsId: text("ups_id").references(() => products.id, {
      onDelete: "set null",
    }),
    tableId: text("table_id").references(() => products.id, {
      onDelete: "set null",
    }),
    chairId: text("chair_id").references(() => products.id, {
      onDelete: "set null",
    }),
    thermalPasteId: text("thermal_paste_id").references(() => products.id, {
      onDelete: "set null",
    }),
    cableIds: text("cable_ids").array().default([]),

    // Totals and metadata
    totalPrice: decimal("total_price", { precision: 12, scale: 2 }),
    estimatedWattage: integer("estimated_wattage"), // Total system wattage

    // Status
    isPublic: boolean("is_public").default(false),
    isTemplate: boolean("is_template").default(false),
    isPurchased: boolean("is_purchased").default(false),

    // Compatibility warnings/errors
    compatibilityIssues: json("compatibility_issues").$type<
      Array<{
        severity: "error" | "warning" | "info";
        component: string;
        message: string;
      }>
    >(),

    ...timestamps,
  },
  (table) => [
    index("pc_builds_user_idx").on(table.userId),
    index("pc_builds_public_idx").on(table.isPublic),
    index("pc_builds_template_idx").on(table.isTemplate),
  ]
);

// Compatibility Rules table
export const compatibilityRules = pgTable(
  "compatibility_rules",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    ruleType: varchar("rule_type", { length: 50 }).notNull(), // e.g., "socket_match", "memory_type_match", "power_requirement"

    // Components involved in this rule
    primaryComponent: componentTypeEnum("primary_component").notNull(),
    secondaryComponent: componentTypeEnum("secondary_component"),

    // Rule definition (flexible JSON structure)
    ruleDefinition: json("rule_definition")
      .$type<{
        condition: string;
        parameters: Record<string, any>;
        errorMessage?: string;
        warningMessage?: string;
      }>()
      .notNull(),

    severity: varchar("severity", { length: 20 }).notNull().default("error"), // "error", "warning", "info"
    isActive: boolean("is_active").default(true),
    priority: integer("priority").default(0), // Higher priority rules are checked first

    ...timestamps,
  },
  (table) => [
    index("compatibility_rules_type_idx").on(table.ruleType),
    index("compatibility_rules_primary_idx").on(table.primaryComponent),
    index("compatibility_rules_active_idx").on(table.isActive),
  ]
);

// Relations
export const productComponentSpecsRelations = relations(
  productComponentSpecs,
  ({ one }) => ({
    product: one(products, {
      fields: [productComponentSpecs.productId],
      references: [products.id],
    }),
  })
);

export const pcBuildsRelations = relations(pcBuilds, ({ one }) => ({
  user: one(user, {
    fields: [pcBuilds.userId],
    references: [user.id],
  }),
  processor: one(products, {
    fields: [pcBuilds.processorId],
    references: [products.id],
    relationName: "processor",
  }),
  motherboard: one(products, {
    fields: [pcBuilds.motherboardId],
    references: [products.id],
    relationName: "motherboard",
  }),
  memory: one(products, {
    fields: [pcBuilds.memoryId],
    references: [products.id],
    relationName: "memory",
  }),
  graphicCard: one(products, {
    fields: [pcBuilds.graphicCardId],
    references: [products.id],
    relationName: "graphicCard",
  }),
  ssdNvme: one(products, {
    fields: [pcBuilds.ssdNvmeId],
    references: [products.id],
    relationName: "ssdNvme",
  }),
  hardDisk: one(products, {
    fields: [pcBuilds.hardDiskId],
    references: [products.id],
    relationName: "hardDisk",
  }),
  powerSupply: one(products, {
    fields: [pcBuilds.powerSupplyId],
    references: [products.id],
    relationName: "powerSupply",
  }),
  cooler: one(products, {
    fields: [pcBuilds.coolerId],
    references: [products.id],
    relationName: "cooler",
  }),
  pcCase: one(products, {
    fields: [pcBuilds.pcCaseId],
    references: [products.id],
    relationName: "pcCase",
  }),
  keyboard: one(products, {
    fields: [pcBuilds.keyboardId],
    references: [products.id],
    relationName: "keyboard",
  }),
  mouse: one(products, {
    fields: [pcBuilds.mouseId],
    references: [products.id],
    relationName: "mouse",
  }),
  mousePad: one(products, {
    fields: [pcBuilds.mousePadId],
    references: [products.id],
    relationName: "mousePad",
  }),
  headset: one(products, {
    fields: [pcBuilds.headsetId],
    references: [products.id],
    relationName: "headset",
  }),
  speaker: one(products, {
    fields: [pcBuilds.speakerId],
    references: [products.id],
    relationName: "speaker",
  }),
  ups: one(products, {
    fields: [pcBuilds.upsId],
    references: [products.id],
    relationName: "ups",
  }),
  table: one(products, {
    fields: [pcBuilds.tableId],
    references: [products.id],
    relationName: "table",
  }),
  chair: one(products, {
    fields: [pcBuilds.chairId],
    references: [products.id],
    relationName: "chair",
  }),
  thermalPaste: one(products, {
    fields: [pcBuilds.thermalPasteId],
    references: [products.id],
    relationName: "thermalPaste",
  }),
}));
