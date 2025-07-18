import { categories } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Base category schema
export const categorySchema = createSelectSchema(categories);

export type Category = z.infer<typeof categorySchema>;

// Simple category with children schema (non-recursive for OpenAPI)
export const categoryWithChildrenSchema = categorySchema.extend({
  children: z.array(categorySchema).optional()
});

export type CategoryWithChildren = z.infer<typeof categoryWithChildrenSchema>;

// For backward compatibility
export const categoryWithSubCategories = categoryWithChildrenSchema;
export type CategoryWithSubcategories = CategoryWithChildren;

// New category creation schema
export const newCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  slug: true // Will be auto-generated from name
});

export type NewCategory = z.infer<typeof newCategorySchema>;
export type NewCategoryT = NewCategory; // For backward compatibility

// Category update schema
export const updateCategorySchema = createInsertSchema(categories)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    slug: true
  })
  .partial();

export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type UpdateCategoryT = UpdateCategory; // For backward compatibility

// Category move schema for drag and drop
export const moveCategorySchema = z.object({
  categoryId: z.string(),
  newParentId: z.string().nullable(),
  newSortOrder: z.number().int().min(0)
});

export type MoveCategory = z.infer<typeof moveCategorySchema>;

// Category tree response schema
export const categoryTreeSchema = z.array(categoryWithChildrenSchema);

export type CategoryTree = z.infer<typeof categoryTreeSchema>;

// Category breadcrumb schema
export const categoryBreadcrumbSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  path: z.string().nullable()
});

export const categoryBreadcrumbsSchema = z.array(categoryBreadcrumbSchema);

export type CategoryBreadcrumb = z.infer<typeof categoryBreadcrumbSchema>;
export type CategoryBreadcrumbs = z.infer<typeof categoryBreadcrumbsSchema>;

// Category with breadcrumbs schema
export const categoryWithBreadcrumbsSchema = categorySchema.extend({
  breadcrumbs: categoryBreadcrumbsSchema
});

export type CategoryWithBreadcrumbs = z.infer<
  typeof categoryWithBreadcrumbsSchema
>;

// Legacy schemas for backward compatibility
export const subcategorySchema = categorySchema;
export type SubCategory = Category;
export const newSubcategorySchema = newCategorySchema;
export type NewSubcategoryT = NewCategory;
