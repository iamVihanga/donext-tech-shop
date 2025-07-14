"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

import { useGetProducts } from "@/features/products/actions/use-get-products";
import { columns } from "./products-table/columns";
import { useProductTableFilters } from "./products-table/use-products-table-filters";

export default function ProductsListing() {
  const { page, limit, searchQuery, sort } = useProductTableFilters();

  const { data, error, isPending } = useGetProducts({
    limit,
    page,
    sort,
    search: searchQuery
  });

  if (isPending) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={4} />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DataTable
      columns={columns}
      data={data.data}
      totalItems={data.meta.totalPages}
    />
  );
}
