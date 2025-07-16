import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { brands } from "@repo/database";

export const brandSchema = createSelectSchema(brands);

export type Brand = z.infer<typeof brandSchema>;

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  slug: true
});

export type InsertBrand = z.infer<typeof insertBrandSchema>;

export const updateBrandSchema = createInsertSchema(brands)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type UpdateBrand = z.infer<typeof updateBrandSchema>;

export const brandWithProductsSchema = brandSchema.extend({
  products: z.array(z.any()).optional()
});

export type BrandWithProducts = z.infer<typeof brandWithProductsSchema>;
