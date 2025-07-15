import { relations, sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  varchar
} from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";

export const categories = pgTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    parentId: text("parent_id").references((): any => categories.id, {
      onDelete: "cascade"
    }), // Self-referencing for infinite nesting
    path: varchar("path", { length: 500 }), // Materialized path for efficient querying (e.g., "/electronics/computers/laptops")
    level: integer("level").default(0), // Depth level for easy querying
    sortOrder: integer("sort_order").default(0), // For drag and drop ordering
    isActive: boolean("is_active").default(true),
    ...timestamps
  },
  (table) => [
    index("categories_slug_idx").on(table.slug),
    index("categories_name_idx").on(table.name),
    index("categories_parent_idx").on(table.parentId),
    index("categories_path_idx").on(table.path),
    index("categories_level_idx").on(table.level),
    index("categories_sort_order_idx").on(table.sortOrder)
  ]
);

// Products table
export const products = pgTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),

    price: decimal("price", { precision: 10, scale: 2 }).notNull(),

    sku: varchar("sku", { length: 100 }).unique(),
    reservedQuantity: integer("reserved_quantity").default(0),
    stockQuantity: integer("stock_quantity").default(0),
    minStockLevel: integer("min_stock_level").default(0),

    weight: decimal("weight", { precision: 8, scale: 2 }),
    dimensions: varchar("dimensions", { length: 50 }), // e.g., "10x20x30"
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    isActive: boolean("is_active").default(true),
    isFeatured: boolean("is_featured").default(false),

    requiresShipping: boolean("requires_shipping").default(true),

    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    tags: varchar("tags", { length: 500 }),

    ...timestamps
  },
  (table) => [
    index("products_slug_idx").on(table.slug),
    index("products_sku_idx").on(table.sku),
    index("products_category_idx").on(table.categoryId),
    index("products_active_idx").on(table.isActive),
    index("products_featured_idx").on(table.isFeatured),
    index("products_price_idx").on(table.price),
    index("products_stock_idx").on(table.stockQuantity),
    index("products_reserved_idx").on(table.reservedQuantity)
  ]
);

// Product images table (separate table for multiple images per product)
export const productImages = pgTable(
  "product_images",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    altText: varchar("alt_text", { length: 255 }),
    sortOrder: integer("sort_order").default(0),
    isThumbnail: boolean("is_thumbnail").default(false),

    ...timestamps
  },
  (table) => [
    index("product_images_product_idx").on(table.productId),
    index("product_images_sort_idx").on(table.sortOrder),
    index("product_images_thumbnail_idx").on(table.isThumbnail)
  ]
);

// Product variants table (for size, color, etc.)
export const productVariants = pgTable(
  "product_variants",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(), // e.g., "Red - Large"

    sku: varchar("sku", { length: 100 }).unique(),
    stockQuantity: integer("stock_quantity").default(0),

    price: decimal("price", { precision: 10, scale: 2 }),
    comparePrice: decimal("compare_price", { precision: 10, scale: 2 }),

    attributes: text("attributes"), // JSON string for flexible attributes
    isActive: boolean("is_active").default(true),

    ...timestamps
  },
  (table) => [
    index("product_variants_product_idx").on(table.productId),
    index("product_variants_sku_idx").on(table.sku),
    index("product_variants_active_idx").on(table.isActive)
  ]
);

// Define relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parent"
  }),
  children: many(categories, {
    relationName: "parent"
  }),
  products: many(products)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  images: many(productImages),
  variants: many(productVariants)
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  })
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id]
    })
  })
);
