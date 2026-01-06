"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

import { useGetRules } from "../actions/use-get-rules";
import { columns } from "./rules-table/columns";
import { useRulesTableFilters } from "./rules-table/use-rules-table-filters";

export default function RulesListing() {
  const { page, limit } = useRulesTableFilters();

  const { data, error, isPending } = useGetRules({
    page,
    limit,
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
      data={data.rules || data || []}
      totalItems={data.pagination?.totalPages || 0}
    />
  );
}
