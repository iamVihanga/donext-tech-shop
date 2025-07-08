"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

import { useGetOrders } from "../actions/use-get-orders";
import { columns } from "./orders-table/columns";
import { useOrdersTableFilters } from "./orders-table/use-orders-table-filters";

export default function OrdersListing() {
  const { page, limit, searchQuery, sort } = useOrdersTableFilters();

  const { data, error, isPending } = useGetOrders({
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
