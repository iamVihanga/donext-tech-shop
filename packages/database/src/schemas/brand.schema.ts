import { relations, sql } from "drizzle-orm";
import { boolean, index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { products } from "./products.schema";

export const brands = pgTable(
  "brands",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    imageUrl: varchar("image_url", { length: 500 }),
    isActive: boolean("is_active").default(true),

    ...timestamps
  },
  (table) => [
    index("brands_slug_idx").on(table.slug),
    index("brands_name_idx").on(table.name),
    index("brands_active_idx").on(table.isActive)
  ]
);

// Define relations
export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products)
}));
