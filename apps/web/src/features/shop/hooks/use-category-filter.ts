// import {
//   CategoryWithChildren,
//   isDescendantOf,
// } from "@/lib/utils/category-helpers";
import { CategoryWithChildren } from "@repo/database";
import { useCallback } from "react";
import { useShopFilters } from "./use-shop-filters";

export function useCategoryFilter() {
  const { categoryId, setCategoryId, setPage, brandId, setBrandId } =
    useShopFilters();

  // Get all descendant category IDs for a given category
  const getDescendantCategoryIds = useCallback(
    (category: CategoryWithChildren): string[] => {
      let descendants: string[] = [category.id];

      if (category.children?.length) {
        category.children.forEach((child) => {
          descendants = [...descendants, ...getDescendantCategoryIds(child)];
        });
      }

      return descendants;
    },
    []
  );

  // Check if category is active (including its descendants)
  const isCategoryActive = useCallback(
    (category: CategoryWithChildren) => {
      if (!categoryId) return false;

      const descendantIds = getDescendantCategoryIds(category);
      return descendantIds.includes(categoryId);
    },
    [categoryId, getDescendantCategoryIds]
  );

  // Filter products by category and brand
  const filterProducts = useCallback(
    (products: any[]) => {
      return products.filter((product) => {
        const categoryMatch = !categoryId || product.categoryId === categoryId;
        const brandMatch = !brandId || product.brandId === brandId;
        return categoryMatch && brandMatch;
      });
    },
    [categoryId, brandId]
  );

  // Get available brands for current category
  const getAvailableBrands = useCallback(
    (products: any[]) => {
      const filteredProducts = products.filter(
        (product) => !categoryId || product.categoryId === categoryId
      );

      return Array.from(
        new Set(filteredProducts.map((product) => product.brandId))
      );
    },
    [categoryId]
  );

  const handleCategorySelect = useCallback(
    (category: CategoryWithChildren) => {
      if (categoryId === category.id) {
        setCategoryId(null);
      } else {
        setCategoryId(category.id);
        // Reset brand filter when changing category
        setBrandId(null);
      }
      setPage(1);
    },
    [categoryId, setCategoryId, setBrandId, setPage]
  );

  return {
    categoryId,
    isCategoryActive,
    handleCategorySelect,
    filterProducts,
    getAvailableBrands,
  };
}
