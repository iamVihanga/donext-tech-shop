"use client";

import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

import { searchParams, Sort } from "@/lib/searchparams";

export function useBrandsTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [limit, setLimit] = useQueryState(
    "limit",
    searchParams.limit.withDefault(10)
  );

  const [sort, setSort] = useQueryState(
    "sort",
    searchParams.sort.withDefault(Sort.desc)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setPage(1);
    setLimit(10);
  }, [setSearchQuery, setPage, setLimit]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery;
  }, [searchQuery]);

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    page,
    setPage,

    limit,
    setLimit,

    sort,
    setSort,

    // Reset
    resetFilters,
    isAnyFilterActive
  };
}
