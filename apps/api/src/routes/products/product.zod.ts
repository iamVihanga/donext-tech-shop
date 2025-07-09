import { productImages, products, productVariants } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ------- Product Images ZOD Schemas ----------
export const productImageSchema = createSelectSchema(productImages);

export type ProductImage = z.infer<typeof productImageSchema>;

export const insertProductImageSchema = createInsertSchema(productImages).omit({
  id: true,
  productId: true,
  createdAt: true,
  updatedAt: true
});

export type InsertProductImage = z.infer<typeof insertProductImageSchema>;

// ------- Product Variants ZOD Schemas ----------
export const productVariantsSchema = createSelectSchema(productVariants);

export type ProductVariant = z.infer<typeof productVariantsSchema>;

export const insertProductVariantSchema = createInsertSchema(
  productVariants
).omit({
  id: true,
  createdAt: true,
  productId: true,
  updatedAt: true
});

export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;

// ------- Product Entity ZOD Schemas ----------
export const productSchema = createSelectSchema(products).extend({
  images: z.array(productImageSchema),
  variants: z.array(productVariantsSchema)
});

export type Product = z.infer<typeof productSchema>;

export const insertProductSchema = createInsertSchema(products)
  .extend({
    images: z.array(insertProductImageSchema),
    variants: z.array(insertProductVariantSchema)
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  });

export type InsertProduct = z.infer<typeof insertProductSchema>;

export const updateProductSchema = createInsertSchema(products)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .partial();

export type UpdateProduct = z.infer<typeof updateProductSchema>;

// Stock adjustment schema
export const stockAdjustmentSchema = z.object({
  adjustmentType: z.enum(["increase", "decrease"]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  reason: z.string().optional()
});

export type StockAdjustment = z.infer<typeof stockAdjustmentSchema>;
