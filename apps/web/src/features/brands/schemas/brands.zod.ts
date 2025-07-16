import { z } from "zod";

export const brandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  isActive: z.boolean().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable()
});

export type Brand = z.infer<typeof brandSchema>;

export const insertBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string(),
  imageUrl: z.string().url("Please enter a valid URL").or(z.literal("")),
  isActive: z.boolean()
});

export type InsertBrand = z.infer<typeof insertBrandSchema>;

export const updateBrandSchema = insertBrandSchema.partial();

export type UpdateBrand = z.infer<typeof updateBrandSchema>;
