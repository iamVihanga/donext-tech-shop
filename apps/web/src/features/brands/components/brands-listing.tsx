"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

import { useGetBrands } from "@/features/brands/actions/use-brands";
import { columns } from "./brands-table/columns";
import { useBrandsTableFilters } from "./brands-table/use-brands-table-filters";

export default function BrandsListing() {
  const { page, limit, searchQuery, sort } = useBrandsTableFilters();

  const { data, error, isPending } = useGetBrands({
    limit,
    page,
    sort: sort as "asc" | "desc",
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
