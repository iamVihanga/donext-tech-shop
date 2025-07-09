"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableSort } from "@/components/table/data-table-sort";
import { useInventoryTableFilters } from "./use-inventory-table-filters";

type Props = {};

export function InventoryTableActions({}: Props) {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    page,
    setPage,

    sort,
    setSort,

    // Reset
    resetFilters,
    isAnyFilterActive
  } = useInventoryTableFilters();

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTableSort setPage={setPage} setSort={setSort} sortValue={sort} />
    </div>
  );
}
