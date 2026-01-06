"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

import { useGetSpecifications } from "../actions/use-get-specifications";
import { columns } from "./specifications-table/columns";
import { useSpecificationTableFilters } from "./specifications-table/use-specifications-table-filters";

export default function SpecificationsListing() {
  const { page, limit, componentType, socketType, memoryType, formFactor } =
    useSpecificationTableFilters();

  const { data, error, isPending } = useGetSpecifications({
    page,
    limit,
    componentType,
    socketType,
    memoryType,
    formFactor,
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
      data={data.components || []}
      totalItems={data.pagination?.totalPages || 0}
    />
  );
}
