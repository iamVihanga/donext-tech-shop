import { categories } from "../schemas/products.schema";

/**
 * Generate category path from category ID (for API handlers)
 * @param categories - Array of all categories
 * @param categoryId - Category ID
 * @returns Generated path string
 */
export function generateCategoryPath(
  categories: CategoryWithChildren[],
  categoryId: string
): string {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return "";

  if (!category.parentId) {
    return `/${category.slug}`;
  }

  const parentPath = generateCategoryPath(categories, category.parentId);
  return `${parentPath}/${category.slug}`;
}

/**
 * Calculate category level from category ID (for API handlers)
 * @param categories - Array of all categories
 * @param categoryId - Category ID
 * @returns Category level (depth)
 */
export function calculateCategoryLevel(
  categories: CategoryWithChildren[],
  categoryId: string
): number {
  const category = categories.find((c) => c.id === categoryId);
  if (!category || !category.parentId) return 0;

  return 1 + calculateCategoryLevel(categories, category.parentId);
}

/**
 * Generate category path from category name and parent path
 * @param categoryName - Current category name
 * @param parentPath - Parent category path
 * @returns Generated path string
 */
export function generateCategoryPathFromName(
  categoryName: string,
  parentPath?: string | null
): string {
  const slug = categoryName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (!parentPath) {
    return `/${slug}`;
  }

  return `${parentPath}/${slug}`;
}

/**
 * Calculate category level from path string
 * @param path - Category path
 * @returns Category level (depth)
 */
export function calculateCategoryLevelFromPath(path: string): number {
  if (!path || path === "/") return 0;
  return path.split("/").length - 1;
}

/**
 * Extract category breadcrumb from path
 * @param path - Category path
 * @returns Array of path segments
 */
export function getCategoryBreadcrumb(path: string): string[] {
  if (!path || path === "/") return [];
  return path.split("/").filter((segment) => segment.length > 0);
}

/**
 * Check if category is descendant of another category
 * @param childPath - Child category path
 * @param parentPath - Parent category path
 * @returns Boolean indicating if child is descendant of parent
 */
export function isDescendantOf(childPath: string, parentPath: string): boolean {
  if (!childPath || !parentPath) return false;
  return childPath.startsWith(parentPath + "/");
}

/**
 * Get immediate parent path from category path
 * @param path - Category path
 * @returns Parent path or null if root level
 */
export function getParentPath(path: string): string | null {
  if (!path || path === "/") return null;

  const segments = path.split("/").filter((segment) => segment.length > 0);
  if (segments.length <= 1) return null;

  return "/" + segments.slice(0, -1).join("/");
}

export type CategoryWithChildren = typeof categories.$inferSelect & {
  children?: CategoryWithChildren[];
};

/**
 * Build category tree from flat category array
 * @param categories - Flat array of categories
 * @returns Nested category tree
 */
export function buildCategoryTree(
  categories: CategoryWithChildren[]
): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>();
  const rootCategories: CategoryWithChildren[] = [];

  // First pass: create map and initialize children arrays
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Second pass: build parent-child relationships
  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id)!;

    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children!.push(categoryWithChildren);
      }
    } else {
      rootCategories.push(categoryWithChildren);
    }
  });

  // Sort categories by sortOrder
  const sortCategories = (cats: CategoryWithChildren[]) => {
    cats.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    cats.forEach((cat) => {
      if (cat.children && cat.children.length > 0) {
        sortCategories(cat.children);
      }
    });
  };

  sortCategories(rootCategories);
  return rootCategories;
}
