import { relations, sql } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  varchar
} from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { user } from "./auth.schema";
import { products, productVariants } from "./products.schema";

// Quotation Status Enum
export const quotationStatuses = [
  "draft",
  "pending",
  "approved",
  "rejected",
  "expired"
] as const;

export type QuotationStatus = (typeof quotationStatuses)[number];

// Quotations table
export const quotations = pgTable(
  "quotations",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // Quotation number for reference
    quotationNumber: varchar("quotation_number", { length: 50 })
      .notNull()
      .unique(),

    // Customer information
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 50 }),
    customerCompany: varchar("customer_company", { length: 255 }),

    // Quotation details
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),

    // Quotation totals
    subtotal: decimal("subtotal", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),
    discountAmount: decimal("discount_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0.00"),

    // Status and validity
    status: varchar("status", { length: 50 }).notNull().default("draft"),
    validUntil: text("valid_until"), // ISO date string

    // Additional information
    notes: text("notes"),
    terms: text("terms"), // Terms and conditions

    // Customer address for quotation
    customerAddress: jsonb("customer_address").$type<{
      street?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    }>(),

    ...timestamps
  },
  (table) => [
    index("quotations_number_idx").on(table.quotationNumber),
    index("quotations_user_idx").on(table.userId),
    index("quotations_email_idx").on(table.customerEmail),
    index("quotations_status_idx").on(table.status),
    index("quotations_valid_until_idx").on(table.validUntil),
    index("quotations_created_at_idx").on(table.createdAt)
  ]
);

// Quotation items table (products in the quotation)
export const quotationItems = pgTable(
  "quotation_items",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    quotationId: text("quotation_id")
      .notNull()
      .references(() => quotations.id, { onDelete: "cascade" }),

    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    variantId: text("variant_id").references(() => productVariants.id, {
      onDelete: "set null"
    }),

    quantity: integer("quantity").notNull().default(1),

    // Price at the time of quotation
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),

    // Product details snapshot (in case product changes)
    productName: varchar("product_name", { length: 255 }).notNull(),
    productSku: varchar("product_sku", { length: 100 }),
    variantName: varchar("variant_name", { length: 255 }),

    // Additional item notes
    notes: text("notes"),

    ...timestamps
  },
  (table) => [
    index("quotation_items_quotation_idx").on(table.quotationId),
    index("quotation_items_product_idx").on(table.productId),
    index("quotation_items_variant_idx").on(table.variantId)
  ]
);

// Define relations
export const quotationsRelations = relations(quotations, ({ one, many }) => ({
  user: one(user, {
    fields: [quotations.userId],
    references: [user.id]
  }),
  items: many(quotationItems)
}));

export const quotationItemsRelations = relations(quotationItems, ({ one }) => ({
  quotation: one(quotations, {
    fields: [quotationItems.quotationId],
    references: [quotations.id]
  }),
  product: one(products, {
    fields: [quotationItems.productId],
    references: [products.id]
  }),
  variant: one(productVariants, {
    fields: [quotationItems.variantId],
    references: [productVariants.id]
  })
}));
