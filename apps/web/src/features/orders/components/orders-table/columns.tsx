"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Badge } from "@repo/ui/components/badge";

import { OrderWithItems } from "@/features/orders/schemas/orders.schema";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";

export const columns: ColumnDef<OrderWithItems>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      return (
        <Button asChild variant={"accent-secondary"} size="sm">
          <Link
            className="flex items-center hover:underline"
            href={`/admin/orders/${row.original.id}`}
          >
            View Order
          </Link>
        </Button>
      );
    }
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      return (
        <div className="max-w-[150px] sm:max-w-[300px] truncate">
          {row.original.customerName || "No customer name available"}
        </div>
      );
    }
  },
  {
    accessorKey: "customerEmail",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="max-w-[150px] sm:max-w-[300px] truncate">
          {row.original.customerEmail || "No customer email available"}
        </div>
      );
    }
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      return (
        <Badge variant={"outline"}>
          LKR {parseInt(row.original.totalAmount).toFixed(2)}
        </Badge>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Placed At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
