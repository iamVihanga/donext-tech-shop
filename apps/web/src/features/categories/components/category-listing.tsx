"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetCategories } from "@/features/categories/actions/use-get-category";
import { columns } from "./categories-table/columns";
import { useCategoriesTableFilter } from "./categories-table/use-categories-table-filters";

export default function CategoriesListing() {
  const { page, limit, searchQuery, sort } = useCategoriesTableFilter();

  const { data, error, isPending } = useGetCategories({
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
