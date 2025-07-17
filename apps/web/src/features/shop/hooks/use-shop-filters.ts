"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

import { searchParams, Sort } from "@/lib/searchparams";

export function useShopFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q.withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [limit, setLimit] = useQueryState(
    "limit",
    searchParams.limit.withDefault(12) // Show 12 products by default
  );

  const [sort, setSort] = useQueryState(
    "sort",
    searchParams.sort.withDefault(Sort.desc)
  );

  const [categoryId, setCategoryId] = useQueryState("category");

  const [brandId, setBrandId] = useQueryState("brand");

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setPage(1);
    setLimit(12);
    setCategoryId(null);
    setBrandId(null);
  }, [setSearchQuery, setPage, setLimit, setCategoryId, setBrandId]);

  const isAnyFilterActive = useMemo(() => {
    return !!(searchQuery || categoryId || brandId);
  }, [searchQuery, categoryId, brandId]);

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    page,
    setPage,

    // Limit
    limit,
    setLimit,

    // Sort
    sort,
    setSort,

    // Category
    categoryId,
    setCategoryId,

    // Brand
    brandId,
    setBrandId,

    // Reset
    resetFilters,
    isAnyFilterActive
  };
}
