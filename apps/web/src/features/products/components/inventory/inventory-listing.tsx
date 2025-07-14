"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

import { useGetProducts } from "@/features/products/actions/use-get-products";
import { inventoryColumns } from "./inventory-table/columns";
import { useInventoryTableFilters } from "./inventory-table/use-inventory-table-filters";

export default function InventoryListing() {
  const { page, limit, searchQuery, sort } = useInventoryTableFilters();

  const { data, error, isPending } = useGetProducts({
    limit,
    page,
    sort,
    search: searchQuery
  });

  if (isPending) {
    return (
      <DataTableSkeleton columnCount={inventoryColumns.length} rowCount={4} />
    );
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DataTable
      columns={inventoryColumns}
      data={data.data}
      totalItems={data.meta.totalPages}
    />
  );
}
