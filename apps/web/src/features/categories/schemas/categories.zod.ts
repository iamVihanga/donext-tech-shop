import { categories, subcategories } from "@repo/database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Categories schema definitions and type definitions
export const categorySchema = createSelectSchema(categories);

export type Category = z.infer<typeof categorySchema>;

export const subcategorySchema = createSelectSchema(subcategories).extend({
  createdAt: z.date().transform((date) => date && date.toISOString()),
  updatedAt: z
    .date()
    .transform((date) => date && date.toISOString())
    .nullable()
});

export type SubCategory = z.infer<typeof subcategorySchema>;

export const categoryWithSubCategories = categorySchema.extend({
  createdAt: z.date().transform((date) => date && date.toISOString()),
  updatedAt: z
    .date()
    .transform((date) => date && date.toISOString())
    .nullable(),
  subcategories: z.array(subcategorySchema)
});

export type CategoryWithSubcategories = z.infer<
  typeof categoryWithSubCategories
>;

// ----------------------------------------------

export const newCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  isActive: z.boolean()
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
