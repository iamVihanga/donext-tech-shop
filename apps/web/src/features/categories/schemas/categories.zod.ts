import { categories } from "@repo/database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Categories schema definitions and type definitions
export const categorySchema = createSelectSchema(categories).extend({
  createdAt: z.date().transform((date) => date && date.toISOString()),
  updatedAt: z
    .date()
    .transform((date) => date && date.toISOString())
    .nullable()
});

export type Category = z.infer<typeof categorySchema>;

// Category with children for infinite nesting (simplified for frontend)
export const categoryWithChildrenSchema = categorySchema.extend({
  children: z.array(z.lazy(() => categorySchema)).optional()
});

export type CategoryWithChildren = z.infer<typeof categoryWithChildrenSchema>;

// For backward compatibility
export const categoryWithSubCategories = categorySchema.extend({
  children: z.array(categorySchema).optional(),
  subcategories: z.array(categorySchema).optional() // Add subcategories alias for backward compatibility
});

export type CategoryWithSubcategories = z.infer<
  typeof categoryWithSubCategories
>;

// ----------------------------------------------

export const newCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  isActive: z.boolean(),
  parentId: z.string().optional()
});

export type NewCategoryT = z.infer<typeof newCategorySchema>;

export const newSubcategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  isActive: z.boolean()
});

export type NewSubcategoryT = z.infer<typeof newSubcategorySchema>;

// ----------------------------------------------

export const updateCategorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  isActive: z.boolean()
});

export type UpdateCategoryT = z.infer<typeof updateCategorySchema>;
